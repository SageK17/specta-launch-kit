// SPECTA ad generator — one config -> N artboard HTMLs + manifest.json
// Edit ADS below, then:  node build.js   (then: node render-still.js)
const fs = require('fs');
const path = require('path');

const DIMS = { '45': [1080, 1350], '916': [1080, 1920], '11': [1080, 1080] };
const TAG = { '45': '4:5', '916': '9:16', '11': '1:1' };

// ---- THE CAMPAIGN ---------------------------------------------------------
// pos: 'bl' bottom-left | 'tl' top-left | 'tc' top-center | 'bc' bottom-center
// head markup: '|'=<br>  {coral}..{/coral}  {thin}..{/thin}  {serif}..{/serif}
const ADS = [
  { id:'ad01-goeswhereyougo', img:'trunk-single-cognac-4x5.jpg', fmt:'45', theme:'dark', pos:'bl',
    serif:'Simply Spectacular.', head:'It goes|where|you go.', size:104, cta:['coral','shopspecta.com'],
    label:'It goes where you go.' },
  { id:'ad02-phonecase', img:'bodega-black-9x16-A.jpg', fmt:'916', theme:'dark', pos:'tl',
    head:'Your phone|case is {coral}not{/coral}|a wallet.', size:100,
    footSub:'Slim saffiano. Cards pop up. Phone stays a phone.', footCta:['coral','shopspecta.com'],
    label:'Your phone case is not a wallet.' },
  { id:'ad03-fourfinishes', img:'float-4col-9x16-v2.jpg', fmt:'916', theme:'light', pos:'tc',
    head:'Four finishes.', size:92, footHead:'One {coral}obsession.{/coral}', footChips:true, footCta:['coral','shopspecta.com'],
    label:'Four finishes. One obsession.' },
  { id:'ad04-sharp', img:'red-drama-black-9x16.jpg', fmt:'916', theme:'dark', pos:'bl',
    reticle:{d:430,x:325,y:560,label:'PRECISION CARRY'}, eyebrow:'Sharp · always in sight',
    head:'Locked|on {coral}you.{/coral}', size:108, cta:['ghost','Simply Spectacular →'],
    label:'Locked on you.' },
  { id:'ad05-summersorted', img:'carhood-cognac-A.png', fmt:'45', theme:'dark', pos:'bl',
    mast:{t:'EST.|2026', css:'top:120px;right:54px;font-size:150px;text-align:right'},
    eyebrow:'Summer drop', head:'Summer,|{coral}sorted.{/coral}', size:120,
    sub:'The pop-up cardholder that rides shotgun all season.', cta:['coral','shopspecta.com'],
    label:'Summer, sorted.' },
  { id:'ad06-onepress', img:'pocket-pull-cognac-9x16-v2.png', fmt:'916', theme:'dark', pos:'tl',
    eyebrow:'The mechanism', head:'One press.|{coral}Cards up.{/coral}', size:112,
    footSub:'Push the slider — your cards fan up, ready in one move.', footCta:['coral','shopspecta.com'],
    label:'One press. Cards up.' },
  { id:'ad07-details', img:'books-navy-4x5.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Deep navy', head:'Dress the|{coral}details.{/coral}', size:104,
    sub:'Quiet leather. Loud engineering.', cta:['ghost','shopspecta.com →'],
    label:'Dress the details.' },
  { id:'ad08-walletsareback', img:'reflective-navy-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    mast:{t:'’26', css:"top:300px;left:50%;transform:translateX(-50%);font-size:300px"},
    eyebrow:'The slim card wallet, reimagined', head:'Wallets|are {coral}back.{/coral}', size:128, cta:['coral','shopspecta.com'],
    label:'Wallets are back.' },
  { id:'ad09-sketchstatement', img:'carhood-cognac-B.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'The process', head:'From sketch|to {coral}statement.{/coral}', size:96, cta:['ghost','Discover our process →'],
    label:'From sketch to statement.' },
  { id:'ad10-dailyjourney', img:'dashboard-cognac-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Modern classics', head:'For the|{coral}daily journey.{/coral}', size:96, cta:['coral','shopspecta.com'],
    label:'For the daily journey.' },
  { id:'ad11-everyday', img:'pedestal-A.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Four finishes', head:'Designed for|the {coral}everyday.{/coral}', size:90, footChips:false, chips:true, cta:['coral','shopspecta.com'],
    label:'Designed for the everyday.' },
  { id:'ad12-onestandard', img:'catalog-stack-4col.png', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'The collection', head:'Four colours.|One {coral}standard.{/coral}', size:84,
    sub:'Saffiano · RFID-safe · €60', chips:true, cta:['ghost','Shop collection →'],
    label:'Four colours. One standard.' },
  { id:'ad13-edc', img:'edc-flatlay-navy.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Everyday carry', head:'Everything|you carry.|{coral}Sorted.{/coral}', size:84, cta:['coral','shopspecta.com'],
    label:'Everything you carry. Sorted.' },
  { id:'ad14-alwaysinsight', img:'terracotta-cognac-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Sharp and|always in {coral}sight.{/coral}', size:96, cta:['coral','shopspecta.com'],
    label:'Sharp and always in sight.' },
  { id:'ad15-goeswhereyougo-v', img:'trunk-hero-9x16-A.png', fmt:'916', theme:'dark', pos:'bl',
    serif:'Simply Spectacular.', head:'It goes|where {coral}you go.{/coral}', size:100, cta:['coral','shopspecta.com'],
    label:'It goes where you go (9:16).' },
  { id:'ad16-frontpocket', img:'demo-reflective-cognac-A.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Front-pocket slim', head:'Slim enough|for your|front {coral}pocket.{/coral}', size:78,
    sub:'Sharp enough to make a statement.', cta:['ghost','shopspecta.com →'],
    label:'Slim enough for your front pocket.' },
  { id:'ad17-presspopgo', img:'amber-spotlight-black-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Meet Specta', head:'Press.|Pop.|{coral}Go.{/coral}', size:120, cta:['coral','shopspecta.com'],
    label:'Press. Pop. Go.' },
  { id:'ad18-pickyourfinish', img:'trunk-lineup-9x16-A.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'The line-up', head:'Pick your|{coral}finish.{/coral}', size:108, chips:true,
    sub:'Black · Steel Grey · Deep Navy · Cognac', cta:['coral','shopspecta.com'],
    label:'Pick your finish.' },
  { id:'ad19-nobrick', img:'bodega-black-9x16-B.jpg', fmt:'916', theme:'dark', pos:'tl',
    eyebrow:'Carry smarter', head:'No back-|pocket {coral}brick.{/coral}', size:104,
    footSub:'Slim. RFID-safe. Always in sight.', footCta:['coral','shopspecta.com'],
    label:'No back-pocket brick.' },
  { id:'ad20-feeling', img:'demo-reflective-cognac-B.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Est. 2026', head:'{serif}Every great brand|starts with a feeling.{/serif}', size:60,
    cta:['ghost','Discover our process →'], label:'Every great brand starts with a feeling.' },
  { id:'ad21-everyday-stool', img:'stool-cognac-4x5.jpg', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'New', head:'Designed for|the {coral}everyday.{/coral}', size:88, cta:['coral','shopspecta.com'],
    label:'Designed for the everyday (stool).' },
  { id:'ad22-thewholeset', img:'trunk-lineup-4col-A.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'All four', head:'The whole|{coral}set.{/coral}', size:104, chips:true, cta:['coral','shopspecta.com'],
    label:'The whole set.' },
  { id:'ad23-quietlysharp', img:'terracotta-grey.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Steel grey', head:'Quietly|{coral}sharp.{/coral}', size:104, cta:['ghost','shopspecta.com →'],
    label:'Quietly sharp.' },
  { id:'ad24-fourfinishes-45', img:'float-4col-A.jpg', fmt:'45', theme:'light', pos:'tc',
    head:'Four|{coral}finishes.{/coral}', size:92, footChips:true, footCta:['coral','shopspecta.com'],
    label:'Four finishes (4:5).' },
  { id:'ad25-grabandgo', img:'marble-flatlay-cognac-4x5.png', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'Morning, sorted', head:'Grab|and {coral}go.{/coral}', size:100, cta:['coral','shopspecta.com'],
    label:'Grab and go.' },
  { id:'ad26-slimyourcarry', img:'frontpocket-slim-black-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Front-pocket slim', head:'Slim your|{coral}carry.{/coral}', size:104,
    sub:'Slim enough for your front pocket, sharp enough to make a statement.', cta:['coral','shopspecta.com'],
    label:'Slim your carry.' },
  { id:'ad27-precision', img:'macro-mechanism-black-9x16.jpg', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Engineered', head:'Precision,|in the {coral}palm.{/coral}', size:90, cta:['ghost','shopspecta.com →'],
    label:'Precision in the palm.' },
  { id:'ad28-cafejourney', img:'cafe-table-cognac-4x5.png', fmt:'45', theme:'dark', pos:'bl',
    serif:'Modern classics.', head:'For the|daily {coral}journey.{/coral}', size:84, cta:['coral','shopspecta.com'],
    label:'For the daily journey (café).' },
  { id:'ad29-everyday-stool4', img:'stool-all4-4x5.png', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'The collection', head:'One for|{coral}every day.{/coral}', size:86, chips:true, cta:['coral','shopspecta.com'],
    label:'One for every day.' },
  { id:'ad30-summer', img:'beach-summer-cognac-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Summer drop', head:'Pocket-sized.|{coral}Sun-ready.{/coral}', size:96, cta:['coral','shopspecta.com'],
    label:'Pocket-sized. Sun-ready.' },
  { id:'ad31-thegift', img:'giftbox-navy-4x5.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'The gift', head:'Always in|{coral}sight.{/coral}', size:100,
    sub:'The everyday gift that gets used every day.', cta:['coral','shopspecta.com'],
    label:'The gift.' },
  { id:'ad32-onpurpose', img:'desk-sketch-cognac-4x5.jpg', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'From sketch to statement', head:'Made on|{coral}purpose.{/coral}', size:96, cta:['ghost','Discover our process →'],
    label:'Made on purpose.' },
  { id:'ad33-catchcarry', img:'toss-black-1x1.png', fmt:'11', theme:'dark', pos:'bc',
    head:'Catch.|{coral}Carry.{/coral}', size:104, cta:['coral','shopspecta.com'],
    label:'Catch. Carry.' },
  { id:'ad34-dressedup', img:'coat-pocket-navy-9x16.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Tailored carry', head:'Dressed|{coral}up.{/coral}', size:108, cta:['coral','shopspecta.com'],
    label:'Dressed up.' },

  // ===== BOLD library ads (product-heroes / nomodel / model-heroes / UGC) =====
  { id:'ad35-cosmic', img:'../library/crazy-black-cosmic.jpeg', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Out of the everyday', head:'Built|{coral}different.{/coral}', size:116, cta:['coral','shopspecta.com'], label:'Built different.' },
  { id:'ad36-cyberpunk', img:'../library/crazy-navy-cyberpunk.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'After dark', head:'City-{coral}proof.{/coral}', size:118, cta:['coral','shopspecta.com'], label:'City-proof.' },
  { id:'ad37-brutalist', img:'../library/crazy-grey-brutalist.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Engineered to last', head:'Solid|{coral}ground.{/coral}', size:112, cta:['ghost','shopspecta.com →'], label:'Solid ground.' },
  { id:'ad38-monolith', img:'../library/crazy-black-monolith.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'One-piece carry', head:'One|{coral}piece.{/coral}', size:130, cta:['coral','shopspecta.com'], label:'One piece.' },
  { id:'ad39-flame', img:'../library/flame.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'RFID-safe', head:'Bring the|{coral}heat.{/coral}', size:116, cta:['coral','shopspecta.com'], label:'Bring the heat.' },
  { id:'ad40-exploded', img:'../library/exploded.png', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'Every part, on purpose', head:'Engineered|to {coral}pop.{/coral}', size:90,
    sub:'Push the slider. Cards rise. RFID-safe.', cta:['coral','shopspecta.com'], label:'Engineered to pop.' },
  { id:'ad41-ice', img:'../library/ice-frozen.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Cool under pressure', head:'Stays|{coral}sharp.{/coral}', size:110, cta:['coral','shopspecta.com'], label:'Stays sharp.' },
  { id:'ad42-glass', img:'../library/glass.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Nothing|{coral}breaks{/coral}|your stride.', size:90, cta:['coral','shopspecta.com'], label:'Nothing breaks your stride.' },
  { id:'ad43-chrome', img:'../library/chrome-splash.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Liquid metal', head:'Make a|{coral}splash.{/coral}', size:112, cta:['coral','shopspecta.com'], label:'Make a splash.' },
  { id:'ad44-macro', img:'../library/macro-texture.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Saffiano, up close', head:'Feel the|{coral}detail.{/coral}', size:104, cta:['ghost','shopspecta.com →'], label:'Feel the detail.' },
  { id:'ad45-piano', img:'../library/refl-pianoblack.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Steel grey', head:'Reflect|{coral}well.{/coral}', size:116, cta:['coral','shopspecta.com'], label:'Reflect well.' },
  { id:'ad46-lighttrails', img:'../library/urban-lighttrails.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Always moving', head:'Keep|{coral}up.{/coral}', size:126, cta:['coral','shopspecta.com'], label:'Keep up.' },
  { id:'ad47-billboard', img:'../library/urban-billboard.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Made for|the {coral}city.{/coral}', size:104, cta:['coral','shopspecta.com'], label:'Made for the city.' },
  { id:'ad48-carhood-urban', img:'../library/urban-carhood.png', fmt:'45', theme:'dark', pos:'bl',
    head:'Ride|{coral}ready.{/coral}', size:116, cta:['coral','shopspecta.com'], label:'Ride ready.' },
  { id:'ad49-sand', img:'../library/sand.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Take it anywhere', head:'Off the|{coral}grid.{/coral}', size:112, cta:['coral','shopspecta.com'], label:'Off the grid.' },
  { id:'ad50-floating', img:'../library/floating-1.png', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'Featherlight carry', head:'Drop the|{coral}bulk.{/coral}', size:100, cta:['coral','shopspecta.com'], label:'Drop the bulk.' },
  { id:'ad51-driftwood', img:'../library/driftwood-1.png', fmt:'45', theme:'dark', pos:'bl',
    head:'Naturally|{coral}sharp.{/coral}', size:104, cta:['ghost','shopspecta.com →'], label:'Naturally sharp.' },
  { id:'ad52-cascade', img:'../library/cards-cascade.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Cards,|{coral}handled.{/coral}', size:116, cta:['coral','shopspecta.com'], label:'Cards, handled.' },
  { id:'ad53-stackyourway', img:'../library/colourway-stack.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Four finishes', head:'Stack your|{coral}way.{/coral}', size:90, chips:true, cta:['coral','shopspecta.com'], label:'Stack your way.' },
  { id:'ad54-skyline', img:'../library/urban-multi-skyline.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Own the|{coral}skyline.{/coral}', size:100, chips:true, cta:['coral','shopspecta.com'], label:'Own the skyline.' },
  { id:'ad55-smoke', img:'../library/crazy-brown-smoke.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Cognac', head:'Smooth|{coral}operator.{/coral}', size:104, cta:['coral','shopspecta.com'], label:'Smooth operator.' },
  { id:'ad56-powder', img:'../library/crazy-black-powder.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Drop|{coral}everything.{/coral}', size:110, cta:['coral','shopspecta.com'], label:'Drop everything.' },
  { id:'ad57-waves', img:'../library/crazy-navy-splash.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Make|{coral}waves.{/coral}', size:122, cta:['coral','shopspecta.com'], label:'Make waves.' },
  { id:'ad58-grip', img:'../library/gloved-navy.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'In hand', head:'Grip|{coral}it.{/coral}', size:116, cta:['coral','shopspecta.com'], label:'Grip it.' },
  { id:'ad59-stone', img:'../library/marble-pedestal.png', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'A cut above', head:'Set in|{coral}stone.{/coral}', size:96, cta:['coral','shopspecta.com'], label:'Set in stone.' },
  { id:'ad60-anyone', img:'../library/model-woman-emerald.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'For everyone', head:'Sharp on|{coral}anyone.{/coral}', size:92, cta:['coral','shopspecta.com'], label:'Sharp on anyone.' },
  { id:'ad61-everywhere', img:'../library/model-dark-cobalt-fashion.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Wear it|{coral}everywhere.{/coral}', size:92, cta:['coral','shopspecta.com'], label:'Wear it everywhere.' },
  { id:'ad62-streetwear', img:'../library/model-editorial-dark-streetwear.png', fmt:'45', theme:'dark', pos:'bl',
    serif:'Modern classics.', head:'Pocket.|{coral}Sorted.{/coral}', size:96, cta:['coral','shopspecta.com'], label:'Pocket. Sorted.' },
  { id:'ad63-standout', img:'../library/model-twists-neon-1.png', fmt:'916', theme:'dark', pos:'bl',
    head:'Stand|{coral}out.{/coral}', size:124, cta:['coral','shopspecta.com'], label:'Stand out.' },
  { id:'ad64-afterhours', img:'../library/model-woman-series-noir.png', fmt:'45', theme:'dark', pos:'bl',
    eyebrow:'Noir', head:'After|{coral}hours.{/coral}', size:108, cta:['ghost','shopspecta.com →'], label:'After hours.' },
  { id:'ad65-inthewild', img:'../library/ugc-1.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'Real carry', head:'In the|{coral}wild.{/coral}', size:112, cta:['coral','shopspecta.com'], label:'In the wild (UGC).' },

  // ===== CLEAN TEMPLATES (duplicate one, swap image + text, re-run) =====
  { id:'tpl01-916-dark', img:'../library/refl-pianoblack.png', fmt:'916', theme:'dark', pos:'bl',
    eyebrow:'TEMPLATE · 9:16 · dark', head:'[ Your|headline ]', size:104, cta:['coral','shopspecta.com'], label:'TEMPLATE — 9:16 dark' },
  { id:'tpl02-45-light', img:'stool-cognac-4x5.jpg', fmt:'45', theme:'light', pos:'bl',
    eyebrow:'TEMPLATE · 4:5 · light', head:'[ Your|headline ]', size:100, cta:['coral','shopspecta.com'], label:'TEMPLATE — 4:5 light' },
  { id:'tpl03-11-dark', img:'../library/crazystudio-multi.png', fmt:'11', theme:'dark', pos:'bc',
    eyebrow:'TEMPLATE · 1:1 · dark', head:'[ Your|headline ]', size:96, cta:['coral','shopspecta.com'], label:'TEMPLATE — 1:1 dark' },
];

// ---- template -------------------------------------------------------------
function fhead(s){ return (s||'').replace(/\|/g,'<br>')
  .replace(/\{coral\}/g,'<span class="coral">').replace(/\{\/coral\}/g,'</span>')
  .replace(/\{thin\}/g,'<span class="thin">').replace(/\{\/thin\}/g,'</span>')
  .replace(/\{serif\}/g,'<span class="serif">').replace(/\{\/serif\}/g,'</span>'); }

function cta(c){ if(!c) return ''; const [style,txt]=c;
  return style==='coral'
    ? `<div class="cta"><span class="dot"></span>${txt}</div>`
    : `<div class="cta ghost">${txt}</div>`; }
const CHIPS = `<div class="chips"><i class="c-blk"></i><i class="c-gry"></i><i class="c-nvy"></i><i class="c-cog"></i></div>`;

function block(a, where){
  const center = (a.pos==='tc'||a.pos==='bc');
  const ta = center ? 'text-align:center' : '';
  if(where==='main'){
    const top = a.pos[0]==='t';
    const yCss = a.fmt==='45'
      ? (top?'top:120px':'bottom:74px')
      : a.fmt==='11' ? (top?'top:96px':'bottom:64px')
      : (top?'top:196px':'bottom:150px');
    let h='';
    if(a.eyebrow) h+=`<div class="eyebrow">${a.eyebrow}</div>`;
    if(a.serif) h+=`<div class="head serif" style="font-size:${Math.round(a.size*0.56)}px;text-transform:none;font-weight:500;color:var(--coral);margin-bottom:14px">${a.serif}</div>`;
    if(a.head) h+=`<div class="head" style="font-size:${a.size}px">${fhead(a.head)}</div>`;
    // bottom-anchored ads carry sub/cta/chips in the main block
    if(a.pos[0]==='b'){
      if(a.sub) h+=`<div class="sub">${a.sub}</div>`;
      if(a.chips) h+= (center?`<div style="display:flex;justify-content:center">${CHIPS}</div>`:CHIPS);
      if(a.cta) h+= (center?`<div style="display:flex;justify-content:center">${cta(a.cta)}</div>`:cta(a.cta));
    }
    return `<div class="c" style="left:64px;right:64px;${yCss};${ta}">${h}</div>`;
  } else { // foot (only for top-anchored)
    const yb = a.fmt==='916'?'bottom:150px':'bottom:74px';
    let h='';
    if(a.footHead) h+=`<div class="head" style="font-size:${a.size}px">${fhead(a.footHead)}</div>`;
    if(a.footSub) h+=`<div class="sub" style="margin:0 0 22px">${a.footSub}</div>`;
    if(a.footChips) h+= (center?`<div style="display:flex;justify-content:center">${CHIPS}</div>`:CHIPS);
    if(a.footCta) h+= (center?`<div style="display:flex;justify-content:center">${cta(a.footCta)}</div>`:cta(a.footCta));
    if(!h) return '';
    return `<div class="c" style="left:64px;right:64px;${yb};${ta}">${h}</div>`;
  }
}

function render(a){
  const [w,h]=DIMS[a.fmt];
  const logo = a.theme==='light' ? '../brand/logo-black-trim.png' : '../brand/logo-05-trim.png';
  const bg = a.img.includes('/') ? a.img : '../series/'+a.img;
  const lockY = a.fmt==='45' ? 'top:54px;left:60px' : 'top:60px;left:64px';
  const scr = (a.fmt==='45') ? '<div class="scrim sb"></div><div class="scrim st" style="opacity:.55"></div>'
            : (a.pos[0]==='t') ? '<div class="scrim st"></div><div class="scrim sb"></div>'
            : '<div class="scrim st" style="opacity:.5"></div><div class="scrim sb"></div>';
  const mast = a.mast ? `<div class="mast" style="${a.mast.css}">${fhead(a.mast.t)}</div>` : '';
  const ret = a.reticle ? `<div class="reticle" style="width:${a.reticle.d}px;height:${a.reticle.d}px;left:${a.reticle.x}px;top:${a.reticle.y}px"></div>`+
    (a.reticle.label?`<div class="tick" style="top:${a.reticle.y-22}px;left:50%;transform:translateX(-50%)">${a.reticle.label}</div>`:'') : '';
  const footHtml = (a.pos[0]==='t') ? block(a,'foot') : '';
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="ad.css"></head>
<body>
<div class="ad r${a.fmt} theme-${a.theme}">
  <img class="bg" src="${bg}">
  ${scr}
  ${mast}${ret}
  <div class="lock" style="${lockY}"><img class="logo" src="${logo}"></div>
  ${block(a,'main')}
  ${footHtml}
</div>
</body></html>`;
}

const manifest=[];
for(const a of ADS){
  fs.writeFileSync(path.join(__dirname, a.id+'.html'), render(a));
  const [w,h]=DIMS[a.fmt];
  manifest.push({ file:a.id+'.html', out:a.id+'.png', w, h, label:a.label, tag:TAG[a.fmt], img:a.img });
}
fs.writeFileSync(path.join(__dirname,'manifest.json'), JSON.stringify(manifest,null,2));

// ---- auto-build the gallery from the manifest ----
const cards = manifest.map(m =>
`      <a class="card" href="${m.file}" title="${m.label}"><span class="tag">${m.tag}</span><img loading="lazy" src="${m.out}"><div class="l"><b>${m.label}</b><small>${m.out}</small></div></a>`).join('\n');
const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SPECTA — Flagship Ads (${manifest.length})</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Lora:ital@1&display=swap" rel="stylesheet">
<style>
:root{--ink:#0C0F12;--ink2:#15191E;--line:#252C34;--cream:#FEF7EA;--muted:#9FB0BD;--faint:#6c7a85;--coral:#FF5A4D;--sans:'Outfit',sans-serif;--serif:'Lora',Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--ink);color:var(--cream);font-family:var(--sans);background-image:radial-gradient(900px 600px at 82% -8%,rgba(255,90,77,.07),transparent 60%)}
a{color:inherit;text-decoration:none}img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid var(--line)}
.wrap{max-width:1240px;margin:0 auto;padding:44px 26px 80px}.eyebrow{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--coral);font-weight:600;margin-bottom:12px}
h1{font-size:clamp(30px,5vw,52px);font-weight:900;letter-spacing:-.03em;margin:0}h1 em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--coral)}
.sub{color:var(--muted);max-width:70ch;margin:16px 0 6px;font-size:16px}.note{color:var(--faint);font-size:13px}
.back{display:inline-block;margin-bottom:22px;color:var(--muted);font-size:13px;border:1px solid var(--line);padding:7px 13px;border-radius:8px}
.grid{columns:4;column-gap:16px;margin-top:30px}@media(max-width:1100px){.grid{columns:3}}@media(max-width:780px){.grid{columns:2}}@media(max-width:520px){.grid{columns:1}}
.card{break-inside:avoid;margin:0 0 16px;position:relative;display:block}.card .l{padding:9px 2px 2px}.card .l b{font-weight:600;font-size:13.5px}
.card .l small{display:block;color:var(--faint);font-size:11px;margin-top:2px;font-family:ui-monospace,Menlo,monospace}
.tag{position:absolute;top:9px;right:9px;background:rgba(12,15,18,.8);color:var(--cream);font-size:10px;font-weight:600;letter-spacing:.06em;padding:3px 7px;border-radius:6px;border:1px solid var(--line)}
footer{color:var(--faint);font-size:13px;margin-top:42px;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}
</style></head><body><div class="wrap">
  <a class="back" href="../SPECTA-LAUNCH-KIT.html">← Launch kit</a>
  <p class="eyebrow">${manifest.length} ads · 4:5 · 9:16 · 1:1 · 2× PNG · logo-locked</p>
  <h1>SPECTA — <em>flagship ads</em></h1>
  <p class="sub">Every ad is an artboard generated from <code>build.js</code> over the scene library. Click any ad to open its source HTML. To change copy/layout, edit <code>build.js</code> and run <code>node build.js &amp;&amp; node render-still.js</code>.</p>
  <p class="note">Tap a tile to open the editable artboard. PNG filename shown under each.</p>
  <div class="grid">
${cards}
  </div>
  <footer><span>SPECTA · ${manifest.length} flagship ads · generated ${new Date ? '' : ''}from manifest.json</span><span>Simply Spectacular · shopspecta.com</span></footer>
</div></body></html>`;
fs.writeFileSync(path.join(__dirname,'SPECTA-flagship-ads.html'), gallery);
console.log('built '+ADS.length+' ads -> manifest.json + SPECTA-flagship-ads.html');
