const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const asar = require('./tooling/node_modules/@electron/asar/lib/asar.js');
const expected = 'c2eeb2b332a1354a7323fe816079579aa5e16aac979c6d17a95acb5dc34730e7';
function find(dir, name) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.name === name) return p;
    if (entry.isDirectory()) { const result = find(p, name); if (result) return result; }
  }
}
(async () => {
  const url = 'https://github.com/cashualcall/darkbrowser-releases/releases/download/v0.2.0-preview.1/DARKBROWSER-Setup-0.2.0-preview.1.exe';
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
  if (pkg.name !== 'darkbrowser' || pkg.version !== '0.2.0-preview.1') throw Error('Unexpected application identity');
  delete pkg.packageManager;
  fs.writeFileSync('app/package.json', JSON.stringify(pkg, null, 2));
  // Exercise the published wallet payload on each native packaging host.
  const os=require('node:os');
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'dark-wallet-package-'));
  const walletFile=path.join(temporary,'fixture.json');
  const {Vault}=require(path.resolve('app/src/main/dark-vault.js'));
  const vault=new Vault(walletFile);
  try {
    const addresses=await vault.create('disposable-package-test-password','abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
    if(addresses.evm!=='0x9858EfFD232B4033E47d90003D41EC34EcaEda94'||addresses.solana!=='HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk')throw Error('Wallet derivation failed on native host');
    vault.lock();
    const restored=await vault.unlock('disposable-package-test-password');
    if(restored.evm!==addresses.evm||restored.solana!==addresses.solana)throw Error('Wallet recovery failed');
    console.log('PASS: published wallet encryption, EVM/Solana derivation and recovery on '+process.platform+'/'+process.arch);
  } finally {vault.lock();if(fs.existsSync(walletFile))fs.unlinkSync(walletFile);fs.rmdirSync(temporary);}
  console.log('Verified and extracted the existing public application payload; no private source checkout used.');
})().catch(e => { console.error(e.message); process.exitCode = 1; });
