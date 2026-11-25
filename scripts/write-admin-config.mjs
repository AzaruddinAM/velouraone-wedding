// Deploy step: writes the server's private admin config from GitHub secrets
// (ADMIN_USERNAME, ADMIN_PASSWORD_HASH). The file can never be opened from the web
// (api/.htaccess blocks every file that starts with "_").
import { writeFileSync } from 'node:fs';

const target = process.argv[2] ?? 'dist/velouraone-wedding/browser/api/_config.php';
const username = process.env.ADMIN_USERNAME ?? '';
const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? '';

if (!username || !passwordHash) {
  console.log('Admin secrets are not set – the admin sign-in stays switched off on the server.');
  process.exit(0);
}
if (!/^\$(argon2id|argon2i|2y)\$/.test(passwordHash)) {
  console.error('ADMIN_PASSWORD_HASH does not look like a password hash – run "npm run admin:password" to create one.');
  process.exit(1);
}

const b64 = (s) => Buffer.from(s).toString('base64');
writeFileSync(
  target,
  `<?php\n// Written by the deploy from GitHub secrets. Do not edit on the server.\nreturn ['username' => base64_decode('${b64(username)}'), 'password_hash' => base64_decode('${b64(passwordHash)}')];\n`,
);
console.log('Admin config written.');
