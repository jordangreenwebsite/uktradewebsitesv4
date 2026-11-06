import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const paths=['/','/about-us/','/contact-us/','/example-websites/','/our-process/',
 '/privacy-policy/','/thank-you/','/websites-for-plumbers/','/websites-for-electricians/',
 '/websites-for-window-cleaners/','/websites-for-painters/','/websites-for-floor-cleaners/',
 '/websites-for-roofers/','/websites-for-builders/','/websites-for-landscapers/',
 '/websites-for-plasterers/','/websites-for-driveway-cleaners/'];
const server=spawn('python3',['-m','http.server','4321','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
let browser;
const errors=[];
try{
 let ready=false;
 for(let i=0;i<40;i++){
  try{const r=await fetch('http://127.0.0.1:4321/');if(r.ok){ready=true;break}}catch{}
  await new Promise(r=>setTimeout(r,300));
 }
 if(!ready)throw new Error('Preview HTTP server failed to start');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  for(const path of paths){
   try{
    const response=await page.goto('http://127.0.0.1:4321'+path,{waitUntil:'domcontentloaded',timeout:30000});
    if(!response||response.status()!==200){errors.push(path+' HTTP '+response?.status());continue;}
    const facts=await page.evaluate(()=>{
     const h1s=document.querySelectorAll('main h1');
     let jsonLdValid=true;
     const schemaTypes=[];
     for(const script of document.querySelectorAll('script[type="application/ld+json"]')){
      try{const obj=JSON.parse(script.textContent||'');if(!obj['@graph'])jsonLdValid=false;
      else schemaTypes.push(...obj['@graph'].map(node=>node['@type']));
      }catch{jsonLdValid=false}
     }
     return {
      h1:h1s.length,title:document.title,
      meta:document.querySelector('meta[name="description"]')?.getAttribute('content')||'',
      canonical:document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      overflow:document.documentElement.scrollWidth-window.innerWidth,
      jsonLdValid,schemaTypes,
      desktopTrades:document.querySelectorAll('.desktop-trades-menu .trades-dropdown a').length,
      mobileTrades:document.querySelectorAll('.mobile-trades-menu .mobile-trades-list a').length,
     };
    });
    if(facts.h1!==1)errors.push(path+' '+width+'px contains '+facts.h1+' H1 headings');
    if(facts.meta.length<35)errors.push(path+' '+width+'px missing/short meta description');
    if(facts.canonical!=='https://uktradewebsites.co.uk'+path)errors.push(path+' canonical: '+facts.canonical);
    if(facts.overflow>2)errors.push(path+' '+width+'px has '+facts.overflow+'px horizontal overflow');
    if(!facts.jsonLdValid)errors.push(path+' invalid JSON-LD');
    if(facts.desktopTrades!==10||facts.mobileTrades!==10)errors.push(path+' trade navigation incomplete');
    if(path.startsWith('/websites-for-')){
     for(const type of ['Service','BreadcrumbList'])if(!facts.schemaTypes.includes(type))errors.push(path+' missing '+type+' schema');
    }
    if(width===390){
     // Force lazy images to load and check all retained source assets.
     const bad=await page.evaluate(async()=>{
      const images=[...document.querySelectorAll('img')];
      images.forEach(img=>img.loading='eager');
      await Promise.all(images.map(img=>img.decode().catch(()=>{})));
      return images.filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.getAttribute('src'));
     });
     for(const src of bad)errors.push(path+' missing image: '+src);
    }
   }catch(err){errors.push(path+' '+width+'px: '+err.message)}
  }
  if(width===390){
   await page.goto('http://127.0.0.1:4321/',{waitUntil:'domcontentloaded'});
   const menu=page.locator('details.mobile-menu');
   await menu.locator(':scope > summary').click();
   if(!(await menu.evaluate(el=>el.open)))errors.push('Mobile navigation did not open');
   const links=await menu.locator('nav a').count();
   if(links<15)errors.push('Mobile navigation links missing');
   const tradeSubmenu=menu.locator('details.mobile-trades-menu');
   await tradeSubmenu.locator('summary').click();
   if(!(await tradeSubmenu.evaluate(el=>el.open)))errors.push('Mobile trade submenu did not open');
   if((await tradeSubmenu.locator('a').count())!==10)errors.push('Mobile trade submenu has wrong link count');
   await page.goto('http://127.0.0.1:4321/contact-us/?package=Starter%20Website',{waitUntil:'domcontentloaded'});
   const pkg=await page.locator('form.contact-form [name="package"]').first().inputValue();
   if(pkg!=='Starter Website')errors.push('Package enquiry selection was not preserved');
   const action=await page.locator('form.contact-form').first().getAttribute('action');
   if(action!=='https://formspree.io/f/xpqjvloy')errors.push('Formspree endpoint mismatch');
   const redirect=await page.locator('form.contact-form [name="_redirect"]').first().inputValue();
   if(redirect!=='https://uktradewebsites.co.uk/thank-you/')errors.push('Form success destination incorrect');
  }
  await page.close();
 }
}finally{if(browser)await browser.close();server.kill()}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Browser QA passed: '+paths.length+' routes × 3 widths, SEO, media, mobile menu, form and pricing preselection.');
