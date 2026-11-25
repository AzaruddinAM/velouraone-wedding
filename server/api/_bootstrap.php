<?php
/**
 * VelouraOne admin API – shared security core.
 *
 *  • Admin password is stored only as an Argon2id hash (never in plain text, never in git).
 *  • Login: rate-limited per IP + globally, constant-time checks, audit log.
 *  • Session: HttpOnly + Secure + SameSite=Strict cookie, regenerated on login,
 *    idle timeout and absolute lifetime, bound to the browser.
 *  • Every change (generate / delete / logout) needs the CSRF token and a same-origin request.
 *  • Data files start with "<?php exit;" so they can never be downloaded, even without .htaccess.
 */
declare(strict_types=1);

const DATA_DIR = __DIR__ . '/_data';
const SITES_DIR = DATA_DIR . '/sites';
const UPLOAD_DIR = __DIR__ . '/../uploads';
const IDLE_TIMEOUT = 30 * 60;          // 30 minutes without activity
const ABSOLUTE_TIMEOUT = 8 * 60 * 60;  // 8 hours per sign-in
const MAX_FAILS_PER_IP = 5;            // then locked for LOCK_SECONDS
const MAX_FAILS_GLOBAL = 30;           // all IPs together, per hour
const LOCK_SECONDS = 15 * 60;
const GUARD = "<?php exit; ?>\n";

// ----- Response basics -------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");

function respond(array $body, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $message, int $status): never
{
    respond(['ok' => false, 'error' => $message], $status);
}

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
}

function client_ip(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 64);
}

function request_json(): array
{
    $raw = file_get_contents('php://input', false, null, 0, 8 * 1024 * 1024 + 1);
    if ($raw === false || strlen($raw) > 8 * 1024 * 1024) fail('Request too large.', 413);
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

// ----- Storage (data files are PHP files that exit immediately if requested) ---------

function ensure_dirs(): void
{
    foreach ([DATA_DIR, SITES_DIR, UPLOAD_DIR] as $dir) {
        if (!is_dir($dir)) mkdir($dir, 0750, true);
    }
}

function read_data(string $file, array $default = []): array
{
    if (!is_file($file)) return $default;
    $raw = (string) file_get_contents($file);
    if (str_starts_with($raw, GUARD)) $raw = substr($raw, strlen(GUARD));
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $default;
}

function write_data(string $file, array $data): void
{
    ensure_dirs();
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    file_put_contents($tmp, GUARD . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
    rename($tmp, $file);
}

/** Atomic read-modify-write of a data file (used for the login rate limiter). */
function update_data(string $file, callable $change): array
{
    ensure_dirs();
    $handle = fopen($file . '.lock', 'c');
    flock($handle, LOCK_EX);
    try {
        $data = $change(read_data($file));
        write_data($file, $data);
        return $data;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function audit(string $event): void
{
    ensure_dirs();
    $line = sprintf("%s\t%s\t%s\t%s\n", gmdate('c'), client_ip(), $event, substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 120));
    $file = DATA_DIR . '/audit.log.php';
    if (!is_file($file)) file_put_contents($file, GUARD);
    file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
}

// ----- Configuration -----------------------------------------------------------------

function admin_config(): array
{
    // _config.local.php: your computer only (git-ignored). _config.php: written by the deploy from GitHub secrets.
    foreach (['/_config.local.php', '/_config.php'] as $name) {
        if (is_file(__DIR__ . $name)) {
            $config = require __DIR__ . $name;
            if (is_array($config) && !empty($config['username']) && !empty($config['password_hash'])) return $config;
        }
    }
    fail('Admin sign-in is not set up yet.', 503);
}

// ----- Session -----------------------------------------------------------------------

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = is_https();
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name($secure ? '__Host-vo_admin' : 'vo_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function fingerprint(): string
{
    return hash('sha256', (string) ($_SERVER['HTTP_USER_AGENT'] ?? ''));
}

function is_admin(): bool
{
    start_session();
    $s = $_SESSION;
    if (empty($s['admin']) || empty($s['since']) || empty($s['seen'])) return false;
    $now = time();
    if ($now - $s['seen'] > IDLE_TIMEOUT || $now - $s['since'] > ABSOLUTE_TIMEOUT || !hash_equals($s['fp'] ?? '', fingerprint())) {
        end_session();
        return false;
    }
    $_SESSION['seen'] = $now;
    return true;
}

function end_session(): void
{
    start_session();
    $_SESSION = [];
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => $params['path'],
        'secure' => $params['secure'],
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_destroy();
}

function csrf_token(): string
{
    start_session();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

/** Blocks requests from other sites and requests without the CSRF token. */
function require_same_origin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $originHost = parse_url($origin, PHP_URL_HOST) . (parse_url($origin, PHP_URL_PORT) ? ':' . parse_url($origin, PHP_URL_PORT) : '');
    $forwardedHost = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? '';
    if ($origin === '' || ($originHost !== $host && $originHost !== $forwardedHost)) fail('Request blocked.', 403);
}

function require_admin(bool $changing = true): void
{
    if (!is_admin()) fail('Please sign in again.', 401);
    if ($changing) {
        require_same_origin();
        $token = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
        if ($token === '' || !hash_equals(csrf_token(), $token)) fail('Security check failed – please reload the page.', 403);
    }
}

// ----- Login rate limiting -----------------------------------------------------------

function login_locked(): bool
{
    $limits = read_data(DATA_DIR . '/ratelimit.php');
    $now = time();
    $ip = $limits['ip'][client_ip()] ?? null;
    if ($ip && ($ip['until'] ?? 0) > $now) return true;
    $global = $limits['global'] ?? null;
    return $global && ($global['until'] ?? 0) > $now;
}

function record_login_failure(): void
{
    $ipKey = client_ip();
    update_data(DATA_DIR . '/ratelimit.php', function (array $limits) use ($ipKey): array {
        $now = time();
        // Forget stale entries.
        foreach ($limits['ip'] ?? [] as $key => $entry) {
            if (($entry['last'] ?? 0) < $now - 3600) unset($limits['ip'][$key]);
        }
        $entry = $limits['ip'][$ipKey] ?? ['fails' => 0, 'last' => 0, 'until' => 0];
        $entry['fails'] = ($entry['last'] ?? 0) < $now - LOCK_SECONDS ? 1 : $entry['fails'] + 1;
        $entry['last'] = $now;
        if ($entry['fails'] >= MAX_FAILS_PER_IP) $entry['until'] = $now + LOCK_SECONDS;
        $limits['ip'][$ipKey] = $entry;

        $global = $limits['global'] ?? ['fails' => 0, 'since' => $now, 'until' => 0];
        if ($global['since'] < $now - 3600) $global = ['fails' => 0, 'since' => $now, 'until' => 0];
        $global['fails']++;
        if ($global['fails'] >= MAX_FAILS_GLOBAL) $global['until'] = $now + LOCK_SECONDS;
        $limits['global'] = $global;
        return $limits;
    });
}

function clear_login_failures(): void
{
    $ipKey = client_ip();
    update_data(DATA_DIR . '/ratelimit.php', function (array $limits) use ($ipKey): array {
        unset($limits['ip'][$ipKey]);
        return $limits;
    });
}

// ----- Input helpers -------------------------------------------------------------------

/** Trimmed single-line text without control characters, at most $max characters. */
function clean_text(mixed $value, int $max): string
{
    $text = is_string($value) ? $value : '';
    $text = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $text) ?? '';
    return mb_substr(trim($text), 0, $max);
}
