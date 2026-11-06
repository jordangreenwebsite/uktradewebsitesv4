import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.cwd(),'dist');
const pages=['','about-us','contact-us','example-websites','our-process','privacy-policy','thank-you',
 'websites-for-plumbers','websites-for-electricians','websites-for-window-cleaners','websites-for-painters',
 'websites-for-floor-cleaners','websites-for-roofers','websites-for-builders','websites-for-landscapers',
 'websites-for-plasterers','websites-for-driveway-cleaners'];
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
   if(tradePages.includes(page)){
    for(const type of ['Service','BreadcrumbList'])if(!hasType(type))errors.push('Missing '+type+' schema: '+page);
   }
  }catch(err){errors.push('Invalid JSON-LD: '+page+': '+err.message)}
 }
 if(tradePages.includes(page)&&!html.includes('href="/'+page+'/"'))errors.push('Trade link missing from navigation: '+page);

 for(const hit of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const link=hit[1];
  if(link==='/'||link.endsWith('.css')||link.endsWith('.js'))continue;
  const local=path.join(root,link);
  if(!fs.existsSync(local)&&!fs.existsSync(path.join(local,'index.html')))errors.push('Broken internal reference on '+page+': '+link);
 }
}
const robotsPath=path.join(root,'robots.txt');
if(fs.existsSync(robotsPath)){
 const robots=fs.readFileSync(robotsPath,'utf8');
 if(!/User-agent:\s*\*/i.test(robots)||!/Allow:\s*\//i.test(robots))errors.push('robots.txt must explicitly allow crawling');
 if(/^Disallow:\s*\/\s*$/im.test(robots))errors.push('robots.txt blocks all crawling');
 if(!robots.includes('https://uktradewebsites.co.uk/sitemap-index.xml'))errors.push('robots.txt missing sitemap');
}
const redirects=fs.readFileSync(path.join(root,'_redirects'),'utf8');
if(!redirects.includes('/plumbers/ /websites-for-plumbers/ 301'))errors.push('Short trade URL redirect missing');
const indexHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(/href="\/contact-us\/\?package=/.test(indexHtml))errors.push('Pricing creates query-parameter duplicate pages');
if(!indexHtml.includes('/contact-us/#package='))errors.push('Clean pricing links missing');
if(/href="http:\/\//i.test(indexHtml))errors.push('Insecure HTTP external link on homepage');
for(const file of ['sitemap-index.xml','robots.txt','404.html']){
 // 404 is output as /404.html for Astro static; check only sitemap and robots
 if(file==='404.html')continue;
 if(!fs.existsSync(path.join(root,file)))errors.push('Missing site file: '+file);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('QA passed:',pages.length,'pages; unique SEO titles/descriptions, social tags, schema, canonical URLs, trade navigation and internal files.');
