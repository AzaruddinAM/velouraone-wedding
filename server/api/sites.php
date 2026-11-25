<?php
/**
 * Generated couple websites (admin only).
 *   GET    /api/sites.php                         → list
 *   POST   /api/sites.php  {design, details, photo?}  → generate, returns { slug, url }
 *   DELETE /api/sites.php?slug=…                  → remove
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin(false);
    ensure_dirs();
    $sites = [];
    foreach (glob(SITES_DIR . '/*.php') ?: [] as $file) {
        $site = read_data($file);
        if ($site) $sites[] = ['slug' => $site['slug'], 'design' => $site['design'], 'bride' => $site['details']['bride'] ?? '', 'groom' => $site['details']['groom'] ?? '', 'date' => $site['details']['date'] ?? '', 'created' => $site['created'] ?? ''];
    }
    usort($sites, fn ($a, $b) => strcmp($b['created'], $a['created']));
    respond(['ok' => true, 'sites' => $sites]);
}

if ($method === 'DELETE') {
    require_admin();
    $slug = (string) ($_GET['slug'] ?? '');
    if (!preg_match('/^[a-z0-9-]{3,80}$/', $slug)) fail('Not found.', 404);
    $file = SITES_DIR . "/$slug.php";
    $site = read_data($file);
    if (!$site) fail('Not found.', 404);
    if (!empty($site['photo'])) @unlink(UPLOAD_DIR . '/' . basename($site['photo']));
    unlink($file);
    audit("site-deleted $slug");
    respond(['ok' => true]);
}

if ($method !== 'POST') fail('Method not allowed.', 405);
require_admin();

$body = request_json();
$design = (string) ($body['design'] ?? '');
if (!preg_match('/^w\d{1,3}-[a-z0-9-]{1,80}$/', $design)) fail('Please choose a website design.', 422);

$in = is_array($body['details'] ?? null) ? $body['details'] : [];
$details = [
    'bride' => clean_text($in['bride'] ?? '', 60),
    'groom' => clean_text($in['groom'] ?? '', 60),
    'date' => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($in['date'] ?? '')) ? $in['date'] : '',
    'time' => preg_match('/^\d{2}:\d{2}$/', (string) ($in['time'] ?? '')) ? $in['time'] : '',
    'venue' => clean_text($in['venue'] ?? '', 120),
    'address' => clean_text($in['address'] ?? '', 200),
    'familyLine' => clean_text($in['familyLine'] ?? '', 160),
    'groomParents' => clean_text($in['groomParents'] ?? '', 160),
    'brideParents' => clean_text($in['brideParents'] ?? '', 160),
    'rsvpPhone' => preg_replace('/\D+/', '', (string) ($in['rsvpPhone'] ?? '')) ?: '',
];
if (strlen($details['rsvpPhone']) > 15) $details['rsvpPhone'] = '';
if ($details['bride'] === '' || $details['groom'] === '' || $details['date'] === '') {
    fail('Bride, groom and date are required.', 422);
}

// Optional couple photo: checked, then re-saved as a clean JPEG (strips anything hidden in the file).
$photo = null;
$photoData = $body['photo'] ?? null;
if (is_string($photoData) && $photoData !== '') {
    if (!preg_match('#^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$#', $photoData, $m)) fail('Photo must be a JPG, PNG or WebP image.', 422);
    $bytes = base64_decode($m[2], true);
    if ($bytes === false || strlen($bytes) > 6 * 1024 * 1024) fail('Photo is too large (max 6 MB).', 413);
    $info = @getimagesizefromstring($bytes);
    if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) fail('That file is not a valid image.', 422);
    if (!function_exists('imagecreatefromstring')) fail('Photo processing is not available on this server.', 500);
    $image = @imagecreatefromstring($bytes);
    if (!$image) fail('That file is not a valid image.', 422);
    $w = imagesx($image);
    $h = imagesy($image);
    $scale = min(1, 1600 / max($w, $h));
    $clean = imagecreatetruecolor((int) round($w * $scale), (int) round($h * $scale));
    imagefill($clean, 0, 0, imagecolorallocate($clean, 255, 255, 255));
    imagecopyresampled($clean, $image, 0, 0, 0, 0, imagesx($clean), imagesy($clean), $w, $h);
    ensure_dirs();
    $name = bin2hex(random_bytes(12)) . '.jpg';
    imagejpeg($clean, UPLOAD_DIR . '/' . $name, 85);
    $photo = 'uploads/' . $name;
}

// Readable, hard-to-guess address: /i/ananya-arjun-k3f9x
$base = strtolower($details['bride'] . '-' . $details['groom']);
$base = preg_replace('/[^a-z0-9]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $base) ?: $base) ?? 'couple';
$base = trim(substr($base, 0, 50), '-') ?: 'couple';
do {
    $alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
    $suffix = '';
    for ($i = 0; $i < 5; $i++) $suffix .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    $slug = $base . '-' . $suffix;
} while (is_file(SITES_DIR . "/$slug.php"));

write_data(SITES_DIR . "/$slug.php", [
    'slug' => $slug,
    'design' => $design,
    'details' => $details,
    'photo' => $photo,
    'created' => gmdate('c'),
]);
audit("site-created $slug $design");
respond(['ok' => true, 'slug' => $slug, 'path' => "/i/$slug"]);
