// Render concept posters (.art) to 2x PNGs.  Usage: node render-concepts.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIST = [
  ['blueprint.html','blueprint.png',1080,1920],
  ['swatches.html','swatches.png',1080,1350],
  ['thickness.html','thickness.png',1080,1920],
  ['boardingpass.html','boardingpass.png',1080,1350],
  ['slim.html','slim.png',1080,1920],
  ['hexcards.html','hexcards.png',1080,1080],
];
(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args:['--no-sandbox','--hide-scrollbars','--disable-gpu'] });
  for (const [html,out,w,h] of LIST) {
    const page = await browser.newPage();
    await page.setViewport({ width:w, height:h, deviceScaleFactor:2 });
    await page.goto('file://'+path.resolve(__dirname,html), { waitUntil:'networkidle0', timeout:60000 });
    await page.evaluate(async()=>{ if(document.fonts&&document.fonts.ready) await document.fonts.ready; });
    await new Promise(r=>setTimeout(r,500));
    const el = await page.$('.art');
    await el.screenshot({ path: path.resolve(__dirname,out) });
    await page.close(); console.log('wrote',out);
  }
  await browser.close(); console.log('DONE');
})().catch(e=>{console.error(e);process.exit(1)});
