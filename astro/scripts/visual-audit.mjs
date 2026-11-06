import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const targets = [
 {name:'desktop',width:1440,height:900},
 {name:'mobile',width:390,height:844},
];
const origins = [
 {name:'live',url:'https://uktradewebsites.co.uk/'},
 {name:'astro',url:'http://127.0.0.1:4321/'},
];
fs.mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
 for(const viewport of targets) {
  for(const site of origins) {
   const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
   await page.goto(site.url,{waitUntil:'domcontentloaded',timeout:60000});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(1200);
   const filename=site.name+'-'+viewport.name+'.jpg';
   const bytes=await page.screenshot({type:'jpeg',quality:70,fullPage:false});
   fs.writeFileSync(path.join('screenshots',filename),bytes);
   console.log('Screenshot saved: '+filename+' ('+bytes.length+' bytes)');
   const encoded=bytes.toString('base64');
   for(let i=0,n=0;i<encoded.length;i+=5000,n++){
    console.log('IMG|'+site.name+'-'+viewport.name+'|'+n+'|'+encoded.slice(i,i+5000));
   }
   await page.close();
  }
 }
} finally { await browser.close(); }
