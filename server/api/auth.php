<?php
/**
 * Admin sign-in.
 *   GET  /api/auth.php            → { authenticated, csrf? }
 *   POST /api/auth.php  {action:'login', username, password}
 *   POST /api/auth.php  {action:'logout'}           (needs CSRF token)
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $signedIn = is_admin();
    respond(['ok' => true, 'authenticated' => $signedIn, 'csrf' => $signedIn ? csrf_token() : null]);
}

if ($method !== 'POST') fail('Method not allowed.', 405);

require_same_origin();
$body = request_json();
$action = $body['action'] ?? '';

if ($action === 'logout') {
    require_admin();
    audit('logout');
    end_session();
    respond(['ok' => true]);
}

if ($action !== 'login') fail('Unknown action.', 400);

if (login_locked()) {
    audit('login-blocked');
    fail('Too many attempts. Please wait 15 minutes and try again.', 429);
}

$config = admin_config();
$username = clean_text($body['username'] ?? '', 100);
$password = is_string($body['password'] ?? null) ? $body['password'] : '';

// Always run the (slow) hash check, even for a wrong username, so timing reveals nothing.
$userOk = hash_equals((string) $config['username'], $username);
$passOk = $password !== '' && strlen($password) <= 256 && password_verify($password, (string) $config['password_hash']);

if (!$userOk || !$passOk) {
    record_login_failure();
    audit('login-failed');
    usleep(random_int(400_000, 900_000)); // slows down guessing
    fail('Wrong username or password.', 401);
}

clear_login_failures();
start_session();
session_regenerate_id(true);
$_SESSION = [
    'admin' => true,
    'since' => time(),
    'seen' => time(),
    'fp' => fingerprint(),
    'csrf' => bin2hex(random_bytes(32)),
];
audit('login-ok');
respond(['ok' => true, 'authenticated' => true, 'csrf' => $_SESSION['csrf']]);
