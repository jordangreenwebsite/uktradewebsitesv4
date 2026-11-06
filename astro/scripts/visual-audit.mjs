import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
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
const server=spawn('python3',['-m','http.server','4321','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let ready=false;
for(let attempt=0;attempt<40;attempt++){
 try{
  const response=await fetch('http://127.0.0.1:4321/');
  if(response.ok){ready=true;break;}
 }catch{}
 await new Promise(resolve=>setTimeout(resolve,500));
}
if(!ready){server.kill();throw new Error('Astro static HTTP server did not become ready.');}
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
 // Audit the non-homepage layouts as well, on desktop.
 for (const route of ['about-us','our-process','contact-us','example-websites']) {
  for (const viewport of targets) {
   for (const site of origins) {
    const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
    await page.goto(site.url+route+'/',{waitUntil:'domcontentloaded',timeout:60000});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(700);
    const name=site.name+'-'+route+'-'+viewport.name;
    const bytes=await page.screenshot({type:'jpeg',quality:65,fullPage:false});
    fs.writeFileSync(path.join('screenshots',name+'.jpg'),bytes);
    console.log('Screenshot saved: '+name+' ('+bytes.length+' bytes)');
    const encoded=bytes.toString('base64');
    for(let i=0,n=0;i<encoded.length;i+=5000,n++){
     console.log('IMG|'+name+'|'+n+'|'+encoded.slice(i,i+5000));
    }
    if(site.name==='astro' && viewport.name==='mobile'){
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
     if(overflow) throw new Error('Horizontal mobile overflow on '+route);
    }
    await page.close();
   }
  }
 }
 // Compare the pricing section without depending on identical scroll positions.
 for (const site of origins) {
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  await page.goto(site.url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  await page.getByText('Starter Website',{exact:true}).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const name=site.name+'-pricing-desktop';
  const bytes=await page.screenshot({type:'jpeg',quality:65,fullPage:false});
  fs.writeFileSync(path.join('screenshots',name+'.jpg'),bytes);
  console.log('Screenshot saved: '+name+' ('+bytes.length+' bytes)');
  const encoded=bytes.toString('base64');
  for(let i=0,n=0;i<encoded.length;i+=5000,n++){
    console.log('IMG|'+name+'|'+n+'|'+encoded.slice(i,i+5000));
  }
  await page.close();
 }
} finally { await browser.close();server.kill(); }
