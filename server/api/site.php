<?php
/**
 * Public: details of one generated couple website.
 *   GET /api/site.php?slug=ananya-arjun-k3f9  → { design, details }
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') fail('Method not allowed.', 405);
$slug = (string) ($_GET['slug'] ?? '');
if (!preg_match('/^[a-z0-9-]{3,80}$/', $slug)) fail('Not found.', 404);

$site = read_data(SITES_DIR . "/$slug.php");
if (!$site) fail('Not found.', 404);

header('Cache-Control: public, max-age=60');
header('X-Robots-Tag: noindex');
$details = $site['details'];
$details['photoUrl'] = $site['photo'] ? '/' . $site['photo'] : null;
respond(['ok' => true, 'design' => $site['design'], 'details' => $details]);
