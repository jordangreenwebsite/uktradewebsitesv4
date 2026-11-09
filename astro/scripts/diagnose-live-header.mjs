/**
 * Diagnose the actual Cloudflare production header, not the repository build.
 * Diagnostic-only: a slow rollout or WAF must not fail a successful build.
 */
import {chromium} from 'playwright';

const origin='https://uktradewebsites.co.uk';
const routes=['/','/about-us/','/our-work/','/our-work/residential-roofing-and-fascias/'];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
for(const path of routes){
 try{
  const response=await page.goto(origin+path,{waitUntil:'domcontentloaded',timeout:15000});
  const result=await page.evaluate(()=>{
   const header=document.querySelector('.site-header');
   const logo=header?.querySelector('.brand img');
   const cta=header?.querySelector('.header-cta');
   const firstNav=header?.querySelector('.desktop-nav > a');
   const body=document.body;
   const hero=document.querySelector('main > section');
   const computed=element=>element?getComputedStyle(element):null;
   return {
    bodyClass:body.className,
    headerPosition:computed(header)?.position??null,
    headerBg:computed(header)?.backgroundColor??null,
    headerBottom:Math.round(header?.getBoundingClientRect().bottom??0),
    firstSectionTop:Math.round(hero?.getBoundingClientRect().top??-1),
    logoWidth:computed(logo)?.width??null,
    whatsappBg:computed(cta)?.backgroundColor??null,
    navWeight:computed(firstNav)?.fontWeight??null,
    cssLinks:[...document.querySelectorAll('link[rel="stylesheet"]')].map(a=>a.getAttribute('href'))
   };
  });
  console.log('LIVE_HEADER_PRODUCTION '+JSON.stringify({path,httpStatus:response?.status()??0,...result}));
 }catch(err){
  console.log('LIVE_HEADER_PRODUCTION '+JSON.stringify({path,error:String(err).slice(0,350)}));
 }
}
await browser.close();
