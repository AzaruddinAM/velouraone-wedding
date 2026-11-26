<?php
/**
 * Public health check (no secrets): can this server check Argon2id / bcrypt passwords,
 * and is the admin login configured? Only yes/no answers are returned.
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

// Hashes of a fixed dummy phrase (not a real password) made on a known-good PHP.
const PHRASE = 'veloura-health-check';
const ARGON = '$argon2id$v=19$m=65536,t=4,p=1$TVNDYVhkWFJnVUMxemFmSw$BwHhSkzI4t4bTJ/dHNBW6YEBV1Ua+UixF4wLCRNuZS0';
const BCRYPT = '$2y$12$wxZZjCQ3MIvzvQiYtm8XbOlPhshoUuu0bPgFUL8Idz72rK1IfMtyy';

$configured = false;
$configAlgo = null;
foreach (['/_config.local.php', '/_config.php'] as $name) {
    if (is_file(__DIR__ . $name)) {
        $config = require __DIR__ . $name;
        if (is_array($config) && !empty($config['password_hash'])) {
            $configured = true;
            $configAlgo = password_get_info((string) $config['password_hash'])['algoName'] ?? null;
            break;
        }
    }
}

respond([
    'ok' => true,
    'php' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
    'argon2idSupported' => defined('PASSWORD_ARGON2ID'),
    'argon2idVerifies' => password_verify(PHRASE, ARGON),
    'bcryptVerifies' => password_verify(PHRASE, BCRYPT),
    'adminConfigured' => $configured,
    'adminHashType' => $configAlgo,
]);
