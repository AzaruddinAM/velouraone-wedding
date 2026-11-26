// Deploy step: writes the server's private admin config from GitHub secrets
// (ADMIN_USERNAME, ADMIN_PASSWORD_HASH). The file can never be opened from the web
// (api/.htaccess blocks every file that starts with "_").
import { writeFileSync } from 'node:fs';

const target = process.argv[2] ?? 'dist/velouraone-wedding/browser/api/_config.php';
// Tolerate stray spaces, line breaks or quotes around values pasted into GitHub.
const clean = (v) => (v ?? '').trim().replace(/^['"]+|['"]+$/g, '').trim();
const username = clean(process.env.ADMIN_USERNAME);
const passwordHash = clean(process.env.ADMIN_PASSWORD_HASH);

if (!username || !passwordHash) {
  console.log('Admin secrets are not set – the admin sign-in stays switched off on the server.');
  process.exit(0);
}
if (!/^\$(argon2id|argon2i|2y)\$/.test(passwordHash)) {
  // Safe diagnosis only – never prints the value itself.
  const shape = (v) =>
    `length ${v.length}, starts with "$": ${v.startsWith('$')}, "$" signs: ${(v.match(/\$/g) ?? []).length}, ` +
    `spaces inside: ${/\s/.test(v)}, starts with a letter: ${/^[A-Za-z]/.test(v)}`;
  const looksSwapped = /^\$(argon2id|argon2i|2y)\$/.test(username);
  console.log(
    `::error::ADMIN_PASSWORD_HASH is not an encrypted password (a real one starts with $argon2id$ and is about 97 characters). ` +
      `It has ${shape(passwordHash)}.` +
      (looksSwapped ? ' The encrypted value seems to be in ADMIN_USERNAME instead – the two secrets are swapped.' : ''),
  );
  process.exit(1);
}

const b64 = (s) => Buffer.from(s).toString('base64');
writeFileSync(
  target,
  `<?php\n// Written by the deploy from GitHub secrets. Do not edit on the server.\nreturn ['username' => base64_decode('${b64(username)}'), 'password_hash' => base64_decode('${b64(passwordHash)}')];\n`,
);
console.log('Admin config written.');
