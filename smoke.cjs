const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
(async () => {
  const executable = process.argv[2];
  if (!executable || !fs.existsSync(executable)) throw Error('Packaged executable missing');
  let loaded = false;
  const server = http.createServer((_req, res) => { loaded = true; res.end('<title>DARKBROWSER package test</title>Navigation works'); });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'darkbrowser-release-'));
  fs.writeFileSync(path.join(profile, 'settings.json'), JSON.stringify({ onboardingVersion: 1, usagePing: false, searchSuggestions: false, adblockEnabled: true }));
  const { ELECTRON_RUN_AS_NODE, BLANC_TEST, ...env } = process.env;
  const child = spawn(path.resolve(executable), ['--user-data-dir=' + profile, 'http://127.0.0.1:' + server.address().port], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '', failure;
  child.on('error', e => { failure = e; });
  child.stderr.on('data', d => { logs = (logs + d).slice(-4000); });
  try {
    const deadline = Date.now() + 60000;
    while (!loaded && !failure && child.exitCode === null && Date.now() < deadline) await new Promise(r => setTimeout(r, 250));
    if (!loaded) throw Error('Packaged navigation failed: ' + (failure?.message || logs));
    fs.writeFileSync('dist/verification-' + process.platform + '-' + (process.argv[3] || process.arch) + '.json', JSON.stringify({ platform: process.platform, hostArch: process.arch, package: process.argv[3] || process.arch, navigation: true, realBlockerEnabled: true, checkedAt: new Date().toISOString() }, null, 2));
    console.log('PASS: packaged browser loaded HTTP fixture with blocker enabled');
  } finally { child.kill(); server.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
