import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.cwd(),'dist');
const pages=['','about-us','contact-us','our-work','our-work/residential-roofing-and-fascias','our-process','pricing','privacy-policy','thank-you',
 'websites-for-plumbers','websites-for-electricians','websites-for-window-cleaners','websites-for-painters',
 'websites-for-floor-cleaners','websites-for-roofers','websites-for-builders','websites-for-landscapers',
 'websites-for-plasterers','websites-for-driveway-cleaners','websites-for-pressure-washers'];
const errors=[];
const titles=new Map();
const descriptions=new Map();
const tradePages=pages.filter(page=>page.startsWith('websites-for-'));
for(const page of pages){
 const target=path.join(root,page,'index.html');
 if(!fs.existsSync(target)){errors.push('Missing page: /'+page+'/');continue;}
 const html=fs.readFileSync(target,'utf8');
 const canonical='https://uktradewebsites.co.uk/'+(page?page+'/':'');
 if(!html.includes('href="'+canonical+'"'))errors.push('Canonical missing: '+page);
 if(html.includes('uktradewebsites.local'))errors.push('Local test domain leaked: '+page);
 if(/wp-content\/plugins\/breakdance|breakdance-utils\.js|post-\d+\.css/i.test(html))errors.push('Legacy Breakdance dependency: '+page);
 if(/href="https:\/\/uktradewebsites\.com/i.test(html)||html.includes('value="https://uktradewebsites.com'))errors.push('Old .com destination: '+page);
 if(!/<h1[\s>]/i.test(html))errors.push('Missing H1: '+page);
 if(!/<meta name="description"/i.test(html))errors.push('Missing meta description: '+page);
 if(page==='thank-you'&&!html.includes('noindex'))errors.push('Thank-you page must be noindexed');
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
 const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim();
 if(!title||title.length<16)errors.push('Missing/short title: '+page);
 if(!description||description.length<(page==='thank-you'?35:60))errors.push('Missing/short meta description: '+page);
 if(title&&titles.has(title))errors.push('Duplicate page title: '+page+' and '+titles.get(title));
 if(description&&descriptions.has(description))errors.push('Duplicate meta description: '+page+' and '+descriptions.get(description));
 if(title)titles.set(title,page);
 if(description)descriptions.set(description,page);
 if(page!=='thank-you'&&/name="robots" content="noindex/i.test(html))errors.push('Public page noindexed: '+page);
 for(const tag of ['og:title','og:description','og:url','og:image']){
  if(!html.includes('property="'+tag+'"'))errors.push('Missing social meta '+tag+': '+page);
 }
 const ld=html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
 if(!ld)errors.push('Missing JSON-LD: '+page);
 else{
  try{
   const schema=JSON.parse(ld[1]);
   const nodes=schema['@graph']||[];
   const hasType=type=>nodes.some(node=>node['@type']===type);
   for(const type of ['Organization','WebSite','WebPage'])if(!hasType(type))errors.push('Missing '+type+' schema: '+page);
   const organization=nodes.find(node=>node['@type']==='Organization');
   if(!organization?.areaServed||!organization?.contactPoint?.length)errors.push('Organization missing truthful service area/contact: '+page);
   const contact=organization?.contactPoint?.[0];
   const hours=contact?.hoursAvailable;
   if(!hours||hours['@type']!=='OpeningHoursSpecification'||hours.opens!=='09:00'||hours.closes!=='17:30'||hours.dayOfWeek?.length!==5)
     errors.push('Approved UK contact hours missing from schema: '+page);
   if(organization?.sameAs&&!Array.isArray(organization.sameAs))errors.push('sameAs must be a verified profile list: '+page);
   const generalService=nodes.find(node=>node['@id']==='https://uktradewebsites.co.uk/#trade-website-design');
   if(!generalService||generalService['@type']!=='Service')errors.push('Trade website service schema missing: '+page);
   if(!html.includes('Enquiry hours: Monday'))errors.push('Published UK enquiry hours missing in footer: '+page);
   if(tradePages.includes(page)){
    for(const type of ['Service','BreadcrumbList'])if(!hasType(type))errors.push('Missing '+type+' schema: '+page);
   }
  }catch(err){errors.push('Invalid JSON-LD: '+page+': '+err.message)}
 }
 if(/[↗⬇➡⬆↖↘↙⤴⤵]/u.test(html))errors.push('Emoji-style arrow remains on page: '+page);
 if(tradePages.includes(page)&&!html.includes('href="/'+page+'/"'))errors.push('Trade link missing from navigation: '+page);

 for(const hit of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const link=hit[1];
  if(link==='/'||link.endsWith('.css')||link.endsWith('.js'))continue;
  const local=path.join(root,link);
  if(!fs.existsSync(local)&&!fs.existsSync(path.join(local,'index.html')))errors.push('Broken internal reference on '+page+': '+link);
 }
}
// Roofing case study uses actual images extracted from the user-uploaded ZIP.
for(const asset of ['before.jpg','after.jpg','after-menu.png']){
 const assetPath=path.join(root,'case-studies','roofing',asset);
 if(!fs.existsSync(assetPath)||fs.statSync(assetPath).size<1000)errors.push('Missing real roofing case study image: '+asset);
}
for(const page of ['','our-work','our-work/residential-roofing-and-fascias']){
 const html=fs.readFileSync(path.join(root,page,'index.html'),'utf8');
 for(const asset of ['/case-studies/roofing/before.jpg','/case-studies/roofing/after.jpg','/case-studies/roofing/after-menu.png']){
  if(!html.includes(asset))errors.push('Roofing comparison missing '+asset+' on '+page);
 }
 if(!html.includes('roofing-screenshot-scroll'))errors.push('Independent scrollable roofing screenshots missing on '+page);
 if(!html.includes('15</strong>'))errors.push('15 additional roofing pages must be clearly described on '+page);
}
const robotsPath=path.join(root,'robots.txt');
if(fs.existsSync(robotsPath)){
 const robots=fs.readFileSync(robotsPath,'utf8');
 if(!/User-agent:\s*\*/i.test(robots)||!/Allow:\s*\//i.test(robots))errors.push('robots.txt must explicitly allow crawling');
 if(/^Disallow:\s*\/\s*$/im.test(robots))errors.push('robots.txt blocks all crawling');
 if(!robots.includes('https://uktradewebsites.co.uk/sitemap-index.xml'))errors.push('robots.txt missing sitemap');
}
const headers=fs.readFileSync(path.join(root,'_headers'),'utf8');
if(!/\/robots\.txt\s*\n\s*Content-Type:\s*text\/plain/i.test(headers))errors.push('Cloudflare robots.txt response header should use text/plain');
const redirects=fs.readFileSync(path.join(root,'_redirects'),'utf8');
if(!redirects.includes('/plumbers/ /websites-for-plumbers/ 301'))errors.push('Short trade URL redirect missing');
const indexHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(/href="\/contact-us\/\?package=/.test(indexHtml))errors.push('Pricing creates query-parameter duplicate pages');
if(!indexHtml.includes('/contact-us/#package='))errors.push('Clean pricing links missing');
if(!indexHtml.includes('<!--email_off-->')||!indexHtml.includes('<!--/email_off-->'))errors.push('Footer email needs Cloudflare email_off markers to prevent broken /cdn-cgi/l/email-protection link');
if(!indexHtml.includes('mailto:uktradewebsites@gmail.com'))errors.push('Footer needs a working mailto link');
const privacyHtml=fs.readFileSync(path.join(root,'privacy-policy','index.html'),'utf8');
if(!privacyHtml.includes('<!--email_off-->')||!privacyHtml.includes('<!--/email_off-->'))errors.push('Privacy policy email must be protected from Cloudflare rewriting');

const ourWorkHtml=fs.readFileSync(path.join(root,'our-work','index.html'),'utf8');
if(!ourWorkHtml.includes('role="tablist"'))errors.push('Our Work project tabs missing');
if((ourWorkHtml.match(/<button\b[^>]*role="tab"/g)||[]).length!==23)errors.push('Our Work must contain 23 project tabs');
for(const name of ['J Piper Cleaning Services','Residential Roofing &amp; Fascias','PP Power Detailing','Caring Companions Pet Care','Katie’s Flower Hut','Prunus Certificates','My Sweet Pea Flowers','Hush Bake']){
 if(!ourWorkHtml.includes(name))errors.push('Our Work project missing: '+name);
}
if(!ourWorkHtml.includes('https://prunusmedia.com/our-work/'))errors.push('Portfolio project details links missing');
if(indexHtml.includes('href="/example-websites/"'))errors.push('Homepage still links to retired examples page');
if(!indexHtml.includes('href="/our-work/"'))errors.push('Homepage does not link to Our Work');
if(!redirects.includes('/example-websites/ /our-work/ 301'))errors.push('Old Example Websites URL must redirect to Our Work');
const pressurePagePath=path.join(root,'websites-for-pressure-washers','index.html');
if(fs.existsSync(pressurePagePath)){
 const pressureHtml=fs.readFileSync(pressurePagePath,'utf8');
 if(!pressureHtml.includes('JEMOBA'))errors.push('Pressure washing page missing demo showcase');
 if(!pressureHtml.includes('FAQPage'))errors.push('Pressure washing page missing FAQ schema');
 if(!pressureHtml.includes('/websites-for-driveway-cleaners/'))errors.push('Pressure washing page missing driveway-cleaning internal link');
}
if(!indexHtml.includes('Explore the website demo'))errors.push('Homepage JEMOBA hero showcase missing');
if(!indexHtml.includes('id="get-a-website"'))errors.push('Homepage enquiry section missing after featured demo');
const demoPath=path.join(root,'demos','jemoba','index.html');
if(!fs.existsSync(demoPath))errors.push('JEMOBA concept demo page missing');
else{
 const demo=fs.readFileSync(demoPath,'utf8');
 if(demo.split('images.pexels.com/photos/').length-1<8)errors.push('JEMOBA concept photos missing');
 if(!demo.includes('noindex,nofollow'))errors.push('JEMOBA demo must remain noindex');
 if(!demo.includes('illustrative Pexels photographs'))errors.push('JEMOBA stock photo disclosure missing');
 if(!demo.includes('Prepared by UK Trades &amp; Prunus Media'))errors.push('Demo attribution must credit both brands');
}
const pricingHtml=fs.readFileSync(path.join(root,'pricing','index.html'),'utf8');
for(const expected of ['Starter Website','Trade Growth Website','No Upfront Website','£<strong>65','£39','<strong>£149','<strong>£249','1–5 pages','5–9 pages']){
 if(!pricingHtml.includes(expected))errors.push('Pricing page missing: '+expected);
}
if((pricingHtml.match(/class="price-card/g)||[]).length!==3)errors.push('Pricing page must have three trade cards');
if(!pricingHtml.includes('prunus-logo')||!pricingHtml.includes('Prunus-Media-Left-orientation-300x300.png'))errors.push('Real Prunus logo missing from referral panel');
if(!pricingHtml.includes('https://prunusmedia.com/'))errors.push('Prunus Media referral link missing');
if(pricingHtml.includes('Lead Generation Website'))errors.push('Retired lead-generation package still offered');
if(!pricingHtml.includes('hosting is included'))errors.push('Pricing page omits SEO-inclusive hosting');
if(!pricingHtml.includes('£195 a month'))errors.push('Pricing page missing £195/month SEO offer');
if(!pricingHtml.includes('<del>£39/month</del>'))errors.push('Pricing SEO box missing crossed-out £39/month hosting');
if(!pricingHtml.includes('Free hosting'))errors.push('Pricing SEO box missing free hosting statement');
if(!indexHtml.includes('href="/pricing/"'))errors.push('Homepage missing pricing link');

if(/href="http:\/\//i.test(indexHtml))errors.push('Insecure HTTP external link on homepage');
for(const file of ['sitemap-index.xml','robots.txt','404.html']){
 // 404 is output as /404.html for Astro static; check only sitemap and robots
 if(file==='404.html')continue;
 if(!fs.existsSync(path.join(root,file)))errors.push('Missing site file: '+file);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('QA passed:',pages.length,'pages; unique SEO titles/descriptions, social tags, schema, canonical URLs, trade navigation and internal files.');
