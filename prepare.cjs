const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const asar = require('./tooling/node_modules/@electron/asar/lib/asar.js');
const expected = '71656eee9823baf11270dd5afa7115b07a47143ddb2776673333752171a25909';
function find(dir, name) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.name === name) return p;
    if (entry.isDirectory()) { const result = find(p, name); if (result) return result; }
  }
}
(async () => {
  const url = 'https://github.com/cashualcall/darkbrowser-releases/releases/download/v0.1.0-preview.1/DARKBROWSER-Setup-0.1.0-preview.1.exe';
  const response = await fetch(url);
  if (!response.ok) throw Error('Installer download failed: ' + response.status);
  const data = Buffer.from(await response.arrayBuffer());
  if (crypto.createHash('sha256').update(data).digest('hex') !== expected) throw Error('Installer checksum mismatch');
  fs.writeFileSync('installer.exe', data);
  const seven = process.platform === 'darwin' ? '7zz' : '7z';
  execFileSync(seven, ['x', 'installer.exe', '-ounpack', '-y'], { stdio: 'pipe' });
  const inner = find('unpack', 'app-64.7z');
  if (!inner) throw Error('NSIS application payload missing');
  execFileSync(seven, ['x', inner, '-opayload', '-y'], { stdio: 'pipe' });
  const archive = find('payload', 'app.asar');
  if (!archive) throw Error('Application archive missing');
  asar.extractAll(archive, 'app');
  const pkg = JSON.parse(fs.readFileSync('app/package.json', 'utf8'));
  if (pkg.name !== 'darkbrowser' || pkg.version !== '0.1.0-preview.1') throw Error('Unexpected application identity');
  delete pkg.packageManager;
  fs.writeFileSync('app/package.json', JSON.stringify(pkg, null, 2));
  console.log('Verified and extracted the existing public application payload; no private source checkout used.');
})().catch(e => { console.error(e.message); process.exitCode = 1; });
