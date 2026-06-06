// Render TikTok frames (1080x1920) to PNG. cap-pop.png is transparent (for video overlay).
const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIST = [
  ['tk1-pov-pocket.html','tk1-pov-pocket.png',false],
  ['tk2-tmbi.html','tk2-tmbi.png',false],
  ['tk3-comment.html','tk3-comment.png',false],
  ['tk4-rate.html','tk4-rate.png',false],
  ['tk5-makesense.html','tk5-makesense.png',false],
  ['tk6-meme.html','tk6-meme.png',false],
  ['tk7-waitforit.html','tk7-waitforit.png',false],
  ['cap-pop.html','cap-pop.png',true],
];
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless:'new', args:['--no-sandbox','--hide-scrollbars','--disable-gpu'] });
  for (const [html,out,transparent] of LIST) {
    const p = await b.newPage();
    await p.setViewport({ width:1080, height:1920, deviceScaleFactor:1 });
    await p.goto('file://'+path.resolve(__dirname,html), { waitUntil:'networkidle0', timeout:60000 });
    await p.evaluate(async()=>{ if(document.fonts&&document.fonts.ready) await document.fonts.ready; });
    await new Promise(r=>setTimeout(r,450));
    const el = await p.$('.tk');
    await el.screenshot({ path: path.resolve(__dirname,out), omitBackground: transparent });
    await p.close(); console.log('wrote', out);
  }
  await b.close(); console.log('DONE');
})().catch(e=>{console.error(e);process.exit(1)});
