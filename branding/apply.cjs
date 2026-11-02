// Presentation-only overlay, shared by source builds and public installer packaging.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.argv[2]||'app');
const renderer=path.join(root,'src/renderer');
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js|css|json)$/.test(e.name)){let s=fs.readFileSync(p,'utf8');s=s.replace(/\bDARKBROWSER\b/g,'AgentOS').replace(/\bDark (AI|Wallet|Terminal|Discover)\b/g,'Agent $1').replaceAll('Your browser. Your chains.','Your internet. Your AgentOS.').replaceAll('Browse privately. Explore markets. Research with your own AI.','Your operating space for web context, model intelligence and onchain tools.').replaceAll('Browse the internet. Own the chain.','Internet for agents.').replaceAll('Preview 0.5.0-preview.2','Preview 0.6.0-preview.1');if(e.name.endsWith('.html')&&!s.includes('agentos.css')){const rel=path.relative(path.dirname(p),path.join(renderer,'agentos.css')).split(path.sep).join('/');s=s.replace('</head>','<link rel="stylesheet" href="'+rel+'"></head>');}fs.writeFileSync(p,s);}}}
walk(path.join(root,'src'));
// Preserve the existing installed profile before Electron creates any stores.
const main=path.join(root,'src/main/main.js');let source=fs.readFileSync(main,'utf8');
const marker="setWindowsAppUserModelId({ app });";
if(!source.includes('agentos-profile-compatibility')){if(!source.includes(marker))throw Error('Profile compatibility insertion point missing');source=source.replace(marker,marker+"\n// agentos-profile-compatibility: retain existing browsing and wallet data.\napp.setPath('userData', app.commandLine.getSwitchValue('user-data-dir') || path.join(app.getPath('appData'), 'DARKBROWSER'));");fs.writeFileSync(main,source);}
source=fs.readFileSync(main,'utf8').replace("app.setPath('userData', app.commandLine.getSwitchValue('user-data-dir') || path.join(app.getPath('appData'), 'AgentOS'));","app.setPath('userData', app.commandLine.getSwitchValue('user-data-dir') || path.join(app.getPath('appData'), 'DARKBROWSER'));");fs.writeFileSync(main,source);
fs.copyFileSync(path.join(__dirname,'agentos.css'),path.join(renderer,'agentos.css'));
fs.cpSync(path.join(__dirname,'fonts'),path.join(renderer,'fonts'),{recursive:true});
for(const name of ['icon.png','icon.ico','agentos.svg'])fs.copyFileSync(path.join(__dirname,name),path.join(renderer,'pages',name));
// Internal-tab favicons and Dock colorway selections must use the new mark too.
for(const name of fs.readdirSync(path.join(renderer,'pages'))){if(/^icon(?:-.*)?\.png$/.test(name)||name==='sunrise-favicon-mark.png')fs.copyFileSync(path.join(__dirname,'icon.png'),path.join(renderer,'pages',name));}
fs.copyFileSync(path.join(__dirname,'agentos.svg'),path.join(renderer,'pages/icon.svg'));
fs.mkdirSync(path.join(root,'build'),{recursive:true});
for(const name of ['icon.png','icon.ico'])fs.copyFileSync(path.join(__dirname,name),path.join(root,'build',name));
const pkgPath=path.join(root,'package.json');const pkg=JSON.parse(fs.readFileSync(pkgPath,'utf8'));
pkg.productName='AgentOS';pkg.version='0.6.0-preview.1';pkg.description='AgentOS — the internet for agents. Web context, connected models and onchain tools.';pkg.author='AgentOS contributors';
if(pkg.build)pkg.build.productName='AgentOS';
fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2)+'\n');
console.log('AgentOS identity, typography, icons and profile compatibility applied.');
