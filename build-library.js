// Scan library/ + series/ and emit SPECTA-library.html (the full raw content showcase).
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const groups = [
  { dir:'library', title:'Hero & concept library', note:'product-heroes · studio concepts · model & UGC' },
  { dir:'series',  title:'Scene library',          note:'the product dropped into real scenes' },
];
const isImg = f => /\.(png|jpe?g)$/i.test(f) && !f.startsWith('.');
function cards(dir){
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return '';
  return fs.readdirSync(full).filter(isImg).sort().map(f =>
`      <figure><img loading="lazy" src="${dir}/${encodeURIComponent(f)}"><figcaption>${f}</figcaption></figure>`).join('\n');
}
let sections = '';
let total = 0;
for (const g of groups){
  const full = path.join(ROOT, g.dir);
  const n = fs.existsSync(full) ? fs.readdirSync(full).filter(isImg).length : 0;
  total += n;
  sections += `\n  <h2><span class="s">●</span> ${g.title} <small>${g.note} · ${n}</small></h2>\n  <div class="grid">\n${cards(g.dir)}\n  </div>\n`;
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SPECTA — Content Library (${total})</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Lora:ital@1&display=swap" rel="stylesheet">
<style>
:root{--ink:#0C0F12;--ink2:#15191E;--line:#252C34;--cream:#FEF7EA;--muted:#9FB0BD;--faint:#6c7a85;--coral:#FF5A4D;--sans:'Outfit',sans-serif;--serif:'Lora',Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--ink);color:var(--cream);font-family:var(--sans);background-image:radial-gradient(900px 600px at 82% -8%,rgba(255,90,77,.07),transparent 60%)}
a{color:inherit;text-decoration:none}img{display:block;width:100%;height:100%;object-fit:cover;background:#0a0d10}
.wrap{max-width:1280px;margin:0 auto;padding:44px 26px 80px}
.eyebrow{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--coral);font-weight:600;margin-bottom:12px}
h1{font-size:clamp(30px,5vw,52px);font-weight:900;letter-spacing:-.03em;margin:0}h1 em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--coral)}
.sub{color:var(--muted);max-width:72ch;margin:16px 0 4px;font-size:16px}
.back{display:inline-block;margin-bottom:22px;color:var(--muted);font-size:13px;border:1px solid var(--line);padding:7px 13px;border-radius:8px}
h2{font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:46px 0 16px;display:flex;align-items:center;gap:10px;border-top:1px solid var(--line);padding-top:24px}
h2 .s{color:var(--coral)}h2 small{color:var(--faint);font-weight:400;letter-spacing:0;text-transform:none;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:12px}
figure{background:var(--ink2);border:1px solid var(--line);border-radius:11px;overflow:hidden}
figure img{aspect-ratio:1/1}
figcaption{padding:7px 9px;font-family:ui-monospace,Menlo,monospace;font-size:10px;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
footer{color:var(--faint);font-size:13px;margin-top:42px;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}
</style></head><body><div class="wrap">
  <a class="back" href="SPECTA-LAUNCH-KIT.html">← Launch kit</a>
  <p class="eyebrow">${total} source images · all logo-accurate · 2K originals on file</p>
  <h1>SPECTA — <em>content library</em></h1>
  <p class="sub">Every shot behind the ads — cosmic, cyberpunk, flame, ice, exploded mechanism, urban, studio, lifestyle, model & UGC. Use any of these as a new ad: drop the filename into <code>ads/build.js</code>.</p>
${sections}
  <footer><span>SPECTA · content library · ${total} images</span><span>Simply Spectacular · shopspecta.com</span></footer>
</div></body></html>`;
fs.writeFileSync(path.join(ROOT,'SPECTA-library.html'), html);
console.log('wrote SPECTA-library.html ('+total+' images)');
