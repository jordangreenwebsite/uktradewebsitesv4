import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const paths=['/','/about-us/','/contact-us/','/our-work/','/our-work/residential-roofing-and-fascias/','/our-process/',
 '/pricing/','/privacy-policy/','/thank-you/','/websites-for-plumbers/','/websites-for-electricians/',
 '/websites-for-window-cleaners/','/websites-for-painters/','/websites-for-floor-cleaners/',
 '/websites-for-roofers/','/websites-for-builders/','/websites-for-landscapers/',
 '/websites-for-plasterers/','/websites-for-driveway-cleaners/','/websites-for-pressure-washers/'];
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
 for(const width of [390,768,1101,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  let contactFormReference=null;
  let marketingHeaderReference=null;
  for(const path of paths){
   try{
    const response=await page.goto('http://127.0.0.1:4321'+path,{waitUntil:'domcontentloaded',timeout:30000});
    if(!response||response.status()!==200){errors.push(path+' HTTP '+response?.status());continue;}
    // Our Work and its project pages must inherit the same header as About Us.
    if(path==='/about-us/'||path==='/our-work/'||path==='/our-work/residential-roofing-and-fascias/'){
      const headerStyle=await page.evaluate(()=>{
        const header=document.querySelector('.site-header');
        const inner=document.querySelector('.header-inner');
        const logo=document.querySelector('.site-header .brand img');
        const link=document.querySelector('.desktop-nav>a');
        const dropdown=document.querySelector('.desktop-trades-menu>summary');
        const mobile=document.querySelector('.mobile-menu');
        const cta=document.querySelector('.header-cta');
        return {
          marketing:document.body.classList.contains('marketing-page'),
          position:getComputedStyle(header).position,
          background:getComputedStyle(header).backgroundColor,
          innerHeight:getComputedStyle(inner).minHeight,
          innerDisplay:getComputedStyle(inner).display,
          logoWidth:getComputedStyle(logo).width,
          navFont:getComputedStyle(link).fontSize,
          navWeight:getComputedStyle(link).fontWeight,
          dropdownWeight:getComputedStyle(dropdown).fontWeight,
          mobileDisplay:getComputedStyle(mobile).display,
          ctaDisplay:getComputedStyle(cta).display
        };
      });
      if(!headerStyle.marketing)errors.push(path+' '+width+'px missing marketing header layout');
      if(path==='/about-us/')marketingHeaderReference=headerStyle;
      else if(marketingHeaderReference){
        for(const key of Object.keys(marketingHeaderReference)){
          if(headerStyle[key]!==marketingHeaderReference[key])
            errors.push(path+' '+width+'px header differs from About Us: '+key);
        }
      }
    }
    const signin=await page.evaluate(()=>{
      const desktop=document.querySelector('.site-header .header-signin');
      const mobile=document.querySelector('.site-header .mobile-client-signin');
      const nav=document.querySelector('.site-header .desktop-nav');
      const whatsapp=document.querySelector('.site-header .header-cta');
      const inner=document.querySelector('.site-header .header-inner');
      const rect=el=>el?.getBoundingClientRect();
      const intersects=(a,b)=>!!a&&!!b&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
      const a=rect(desktop),n=rect(nav),w=rect(whatsapp),i=rect(inner);
      return {
        href:desktop?.getAttribute('href'),mobileHref:mobile?.getAttribute('href'),
        mobileInMenu:!!mobile?.closest('nav[aria-label="Mobile navigation"]'),
        desktopVisible:desktop?getComputedStyle(desktop).display!=='none':false,
        overlapNav:intersects(a,n),
        overlapWhatsApp:intersects(a,w),
        onRight:!!a&&!!i&&Math.abs(a.right-i.right)<5
      };
    });
    if(signin.href!=='https://prunusmedia.com/client-login/'||
       signin.mobileHref!==signin.href||!signin.mobileInMenu)
      errors.push(path+' '+width+'px client Sign In link missing or inconsistent');
    if(width>1100&&(!signin.desktopVisible||!signin.onRight||signin.overlapNav||signin.overlapWhatsApp))
      errors.push(path+' '+width+'px Sign In must sit at far right without changing menu/WhatsApp layout');
    if(width<=1100&&signin.desktopVisible)
      errors.push(path+' '+width+'px duplicate desktop Sign In visible on mobile');
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
    if(path==='/'||path==='/contact-us/'||path==='/pricing/'||path.startsWith('/websites-for-')){
      const overlaps=await page.evaluate(()=>{
        const header=document.getElementById('site-header');
        const hero=document.querySelector('.hero, .legacy-hero');
        const form=hero?.querySelector('.contact-panel');
        const h1=hero?.querySelector('h1');
        const headerBottom=header?.getBoundingClientRect().bottom ?? 0;
        const contentTop=(form??h1)?.getBoundingClientRect().top ?? 0;
        return {headerBottom,contentTop,overlap:contentTop<headerBottom-10};
      });
      if(overlaps.overlap)errors.push(path+' '+width+'px hero content overlaps header ('+overlaps.contentTop+' vs '+overlaps.headerBottom+')');
    }
    if(path==='/'&&width===1440){
      const navFacts=await page.evaluate(()=>{
        const title=document.querySelector('.desktop-trades-menu>summary');
        const neighbour=document.querySelector('.desktop-nav>a');
        return {
         weight:title?getComputedStyle(title).fontWeight:'',
         neighbourWeight:neighbour?getComputedStyle(neighbour).fontWeight:'',
         hoverColour:title?getComputedStyle(title).color:'',
         count:document.querySelectorAll('.desktop-trades-menu a').length
        };
      });
      if(navFacts.weight!==navFacts.neighbourWeight)errors.push('Desktop Trade Websites menu weight differs from other links');
      if(navFacts.count!==12)errors.push('Desktop trade menu link count incorrect');
      const badLinks=await page.locator('a[href^="/contact-us/?package="]').count();
      if(badLinks)errors.push('Pricing navigation still uses duplicate query URLs');
    }
    if(facts.desktopTrades!==12||facts.mobileTrades!==12)errors.push(path+' trade navigation incomplete');
    if(path.startsWith('/websites-for-')){
     for(const type of ['Service','BreadcrumbList'])if(!facts.schemaTypes.includes(type))errors.push(path+' missing '+type+' schema');
     if(await page.locator('.legacy-trade-hero nav.breadcrumbs').count())errors.push(path+' still has visible breadcrumb trail');
    }
    if(path==='/contact-us/' || path==='/pricing/' || path.startsWith('/websites-for-') ||
      path==='/about-us/' || path==='/our-process/' || path==='/example-websites/'){
      const formInfo=await page.evaluate(()=>{
        const panel=document.querySelector('.legacy-contact .contact-panel, .bottom-contact .contact-panel');
        const heading=panel?.querySelector('h2');
        const input=panel?.querySelector('input[name="name"]');
        const button=panel?.querySelector('button[type="submit"]');
        const form=panel?.querySelector('form.contact-form');
        return {
          exists:!!form,
          heading:heading?.textContent?.trim()||'',
          fields:form?[...form.querySelectorAll('input[name], select[name], textarea[name]')].map(el=>el.getAttribute('name')).filter(Boolean):[],
          bg:panel?getComputedStyle(panel).backgroundColor:'',
          headingColor:heading?getComputedStyle(heading).color:'',
          fieldColor:input?getComputedStyle(input).backgroundColor:'',
          buttonColor:button?getComputedStyle(button).backgroundColor:''
        };
      });
      if(!formInfo.exists)errors.push(path+' shared contact form missing');
      if(formInfo.heading!=='Grow Your Business')errors.push(path+' contact form heading differs from homepage');
      for(const field of ['name','email','phone','business','service','message','package']){
        if(!formInfo.fields.includes(field))errors.push(path+' form field missing: '+field);
      }
      if(path==='/contact-us/')contactFormReference=formInfo;
      if(contactFormReference&&path!=='/contact-us/'){
        for(const key of ['bg','headingColor','fieldColor','buttonColor']){
          if(formInfo[key]!==contactFormReference[key])errors.push(path+' shared form style differs from contact page: '+key);
        }
      }
    }
    if(path==='/'){
      if(await page.locator('.hero .demo-feature').count())errors.push('Homepage must not contain the JEMOBA concept');
      if(await page.locator('.home-enquiry').count())errors.push('Homepage must not include the added enquiry section');
      if(!(await page.locator('.hero .contact-panel form.contact-form').count()))errors.push('Original homepage enquiry form must be restored in hero right column');
    }
    if(path==='/websites-for-driveway-cleaners/'){
      if(!(await page.locator('.pressure-hero-grid .demo-feature').count()))errors.push('Driveway cleaning hero second column missing JEMOBA demo');
      if(!(await page.locator('.pressure-faq details').count()))errors.push('Driveway cleaning FAQ section missing');
      if(!facts.schemaTypes.includes('FAQPage'))errors.push('Driveway cleaning FAQ schema missing');
      if(!(await page.locator('#driveway-site-features').count()))errors.push('Driveway cleaners editorial section missing');
    }
    if(path==='/websites-for-pressure-washers/'){
      if(!(await page.locator('.pressure-hero-grid .demo-feature').count()))errors.push('Pressure washing page has no featured demo');
      if(!(await page.locator('.pressure-faq details').count()))errors.push('Pressure washing FAQ section missing');
      if(!facts.schemaTypes.includes('FAQPage'))errors.push('Pressure washing FAQ schema missing');
    }
    if(path==='/our-work/'){
      const portfolioFacts=await page.evaluate(()=>({
        tabs:document.querySelectorAll('[data-project-tabs] [role="tab"]').length,
        panels:document.querySelectorAll('[data-project-tabs] [role="tabpanel"]').length,
        activeTabs:document.querySelectorAll('[data-project-tabs] [role="tab"][aria-selected="true"]').length,
        visiblePanels:[...document.querySelectorAll('[data-project-tabs] [role="tabpanel"]')].filter(node=>!node.hasAttribute('hidden')).length,
        firstProject:document.querySelector('[data-project-tabs] [role="tabpanel"]:not([hidden]) h3')?.textContent?.trim()
      }));
      if(portfolioFacts.tabs!==23||portfolioFacts.panels!==23)errors.push('Our Work should have 23 matched project tabs and panels');
      if(portfolioFacts.activeTabs!==1||portfolioFacts.visiblePanels!==1)errors.push('Our Work should show one selected project at a time');
      if(portfolioFacts.firstProject!=='J Piper Cleaning Services')errors.push('Our Work first portfolio project mismatch');
      const secondTab=page.locator('[data-project-tabs] [role="tab"]').nth(1);
      await secondTab.click();
      if((await secondTab.getAttribute('aria-selected'))!=='true')errors.push('Our Work clicked project tab did not activate');
      if(!(await page.locator('[data-project-tabs] [role="tabpanel"]').nth(1).isVisible()))errors.push('Our Work new project panel is not visible');
      if(await page.locator('[data-project-tabs] [role="tabpanel"]').first().isVisible())errors.push('Our Work previous project panel did not hide');
      const visualFacts=await page.evaluate(()=>{
        const panels=[...document.querySelectorAll('[data-project-tabs] [role="tabpanel"]')];
        const missing=panels.filter(panel=>!panel.querySelector('.work-project-preview img'));
        const bad=missing.filter(panel=>{
          const art=panel.querySelector('.work-project-noimage');
          const title=panel.querySelector('.work-project-art h4')?.textContent?.trim();
          const expected=panel.querySelector('.work-project-details h3')?.textContent?.trim();
          const status=[...art?.classList||[]].some(c=>/^work-project-noimage--(live|concept|archived|owned|portfolio)$/.test(c));
          return !art||!art.querySelector('.work-project-browser-top')||!art.querySelector('.work-project-art-status')||!status||!title||title!==expected||!getComputedStyle(art).backgroundImage.includes('linear-gradient');
        });
        return {missing:missing.length,bad:bad.length,legacyText:document.body.textContent?.includes('Project information and website link')||false};
      });
      if(visualFacts.missing===0)errors.push('Our Work should exercise at least one status gradient card');
      if(visualFacts.bad>0)errors.push('Our Work has '+visualFacts.bad+' incomplete gradient preview cards');
      if(visualFacts.legacyText)errors.push('Our Work still displays the old no-image placeholder wording');
      if(!(await page.locator('[data-project-tabs] [role="tabpanel"]').nth(1).locator('.work-project-noimage--live').count()))errors.push('Roofing project should show the live-work gradient card');

    }
    if(path==='/'||path==='/our-work/'||path==='/our-work/residential-roofing-and-fascias/'){
      const roofing=await page.evaluate(async()=>{
        const section=document.querySelector('.roofing-story');
        const panes=section?[...section.querySelectorAll('.roofing-screenshot-scroll')]:[];
        const images=section?[...section.querySelectorAll('img')]:[];
        images.forEach(img=>{img.loading='eager';});
        await Promise.race([
          Promise.all(images.map(img=>img.decode().catch(()=>{}))),
          new Promise(resolve=>setTimeout(resolve,6000))
        ]);
        const before=panes[0],after=panes[1];
        if(before)before.scrollTop=100;
        const independent=before?.scrollTop>0 && (after?.scrollTop||0)===0;
        return {panes:panes.length,images:images.map(img=>({src:img.getAttribute('src'),loaded:img.naturalWidth>0})),
          scrollable:panes.map(el=>el.scrollHeight>el.clientHeight+20),independent,
          hasMenu:!!section?.querySelector('.roofing-menu-shot img'),
          hasFifteen:!!section?.querySelector('.roofing-page-count strong')?.textContent?.includes('15')};
      });
      if(roofing.panes!==2||!roofing.independent||roofing.scrollable.some(v=>!v))errors.push(path+' roofing comparison not independently scrollable');
      if(roofing.images.length!==3||roofing.images.some(img=>!img.loaded))errors.push(path+' roofing comparison image failed to load');
      if(!roofing.hasMenu||!roofing.hasFifteen)errors.push(path+' roofing menu or page count missing');
    }
    if(path==='/pricing/'){
      const pricingFacts=await page.evaluate(()=>{
        const cards=[...document.querySelectorAll('.pricing-grid-three > .price-card')];
        const bounds=cards.map(card=>{const r=card.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,b:r.bottom}});
        const referral=document.querySelector('.prunus-referral');
        const referralBox=referral?.getBoundingClientRect();
        return {
          cards:cards.length,bounds,
          priceText:document.querySelector('.no-upfront-card .monthly')?.textContent||'',
          pricingLink:document.querySelector('.desktop-trades-menu a.pricing-dropdown-link')?.getAttribute('href'),
          referralTop:referralBox?.top??-1,
          logo:referral?.querySelector('img.prunus-logo')?.getAttribute('src'),
          referralLink:referral?.querySelector('a[href^="https://prunusmedia.com"]')?.getAttribute('href')
        };
      });
      if(pricingFacts.cards!==3)errors.push('Pricing must have exactly three trade website cards');
      if(!pricingFacts.priceText.includes('65'))errors.push('No-upfront rate should be £65/month');
      if(pricingFacts.pricingLink!=='/pricing/')errors.push('Pricing submenu link missing');
      if(!pricingFacts.logo?.includes('Prunus-Media-Left-orientation-300x300.png'))errors.push('Prunus referral logo missing');
      if(pricingFacts.referralLink!=='https://prunusmedia.com/')errors.push('Prunus referral link missing');
      if(pricingFacts.bounds.length===3){
        const b=pricingFacts.bounds;
        if(pricingFacts.referralTop<=Math.max(...b.map(card=>card.b))-2)errors.push('Prunus referral is not below all three price cards');
        if(width>950){
          if(b.some(card=>Math.abs(card.y-b[0].y)>3||Math.abs(card.w-b[0].w)>3))errors.push('Desktop pricing cards are not equal-sized and aligned');
          if(Math.abs((b[0].x+b[2].x+b[2].w)/2-width/2)>10)errors.push('Desktop pricing grid is off centre');
        }else if(!(b[0].y<b[1].y&&b[1].y<b[2].y))errors.push('Mobile pricing cards do not stack in offer order');
      }
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
   const menuBounds=await page.evaluate(()=>{
     const rect=document.querySelector('.mobile-menu > nav')?.getBoundingClientRect();
     return {left:rect?.left??-1000,right:rect?.right??1000,viewport:window.innerWidth,overflow:document.documentElement.scrollWidth-window.innerWidth};
   });
   if(menuBounds.left<0||menuBounds.right>menuBounds.viewport+1)errors.push('Mobile menu clips outside viewport: '+JSON.stringify(menuBounds));
   if(menuBounds.overflow>2)errors.push('Opening mobile menu causes horizontal overflow: '+menuBounds.overflow);
   const links=await menu.locator('nav a').count();
   if(links<15)errors.push('Mobile navigation links missing');
   const tradeSubmenu=menu.locator('details.mobile-trades-menu');
   await tradeSubmenu.locator('summary').click();
   if(!(await tradeSubmenu.evaluate(el=>el.open)))errors.push('Mobile trade submenu did not open');
   const nestedBounds=await page.evaluate(()=>{
     const rect=document.querySelector('.mobile-menu > nav')?.getBoundingClientRect();
     return {left:rect?.left??-1000,right:rect?.right??1000,viewport:window.innerWidth};
   });
   if(nestedBounds.left<0||nestedBounds.right>nestedBounds.viewport+1)errors.push('Expanded trade submenu clips outside viewport: '+JSON.stringify(nestedBounds));
   if((await tradeSubmenu.locator('a').count())!==12)errors.push('Mobile trade submenu has wrong link count');
   await page.goto('http://127.0.0.1:4321/contact-us/#package=Starter%20Website',{waitUntil:'domcontentloaded'});
   const pkg=await page.locator('form.contact-form [name="package"]').first().inputValue();
   if(pkg!=='Starter Website')errors.push('Hash-based package enquiry selection was not preserved');
   await page.goto('http://127.0.0.1:4321/contact-us/?package=Starter%20Website',{waitUntil:'domcontentloaded'});
   if((await page.locator('form.contact-form [name="package"]').first().inputValue())!=='Starter Website')errors.push('Legacy query-based package selection was not preserved');
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
