// Render every ad in manifest.json to a crisp 2x PNG.
// Usage: node render-still.js   (run `node build.js` first to (re)generate HTML + manifest)
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu']
  });
  for (const m of manifest) {
    const page = await browser.newPage();
    await page.setViewport({ width: m.w, height: m.h, deviceScaleFactor: 2 });
    await page.goto('file://' + path.resolve(__dirname, m.file), { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(async () => { if (document.fonts && document.fonts.ready) await document.fonts.ready; });
    await new Promise(r => setTimeout(r, 450));
    const el = await page.$('.ad');
    await el.screenshot({ path: path.resolve(__dirname, m.out) });
    await page.close();
    console.log('wrote', m.out);
  }
  await browser.close();
  console.log('DONE ' + manifest.length);
})().catch(e => { console.error(e); process.exit(1); });
