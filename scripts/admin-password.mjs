// Sets up the admin sign-in.
//
//   npm run admin:password          – asks for a username + password (typing is hidden),
//                                     encrypts the password with Argon2id and prints the values
//                                     to add as GitHub secrets. Also enables the login on this computer.
//   npm run admin:password -- --test – creates a random TEST login for local testing only
//                                     (saved in admin-test-login.local.txt, which git ignores).
//
// The plain password is never written anywhere; only its Argon2id hash is.
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const LOCAL_CONFIG = 'server/api/_config.local.php';

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (text) => rl.output.write(text.startsWith(question) ? text : text.includes('\n') ? '\n' : '');
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/** Argon2id hash made by PHP (the same library the server uses); the password goes in through stdin. */
function hash(password) {
  return execFileSync('php', ['-r', 'echo password_hash(stream_get_contents(STDIN), defined("PASSWORD_ARGON2ID") ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT);'], {
    input: password,
  }).toString();
}

function writeLocalConfig(username, passwordHash) {
  const b64 = (s) => Buffer.from(s).toString('base64');
  writeFileSync(
    LOCAL_CONFIG,
    `<?php\n// Local admin login for this computer only (git-ignored).\nreturn ['username' => base64_decode('${b64(username)}'), 'password_hash' => base64_decode('${b64(passwordHash)}')];\n`,
  );
}

if (process.argv.includes('--test')) {
  const username = 'admin-test';
  const password = randomBytes(15).toString('base64url');
  writeLocalConfig(username, hash(password));
  writeFileSync('admin-test-login.local.txt', `Local TEST admin login (this computer only – not used on the live site)\nusername: ${username}\npassword: ${password}\n`);
  console.log('Test login created for this computer. Details are in admin-test-login.local.txt (git-ignored).');
  process.exit(0);
}

const username = (await ask('Admin username: ')).trim();
if (username.length < 4) throw new Error('Use at least 4 characters for the username.');
const password = await ask('Admin password (hidden, 12+ characters): ', true);
if (password.length < 12) throw new Error('Use at least 12 characters for the password.');
const again = await ask('Type the password again: ', true);
if (again !== password) throw new Error('The passwords do not match.');

const passwordHash = hash(password);
writeLocalConfig(username, passwordHash);
console.log(`
Done – the login now works on this computer.

For the live site, add these two repository secrets on GitHub
(Settings → Secrets and variables → Actions → New repository secret):

  ADMIN_USERNAME       ${username}
  ADMIN_PASSWORD_HASH  ${passwordHash}

The hash is the encrypted form of your password – the password itself is never stored.
`);
