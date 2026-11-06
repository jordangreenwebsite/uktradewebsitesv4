import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.cwd(),'dist');
const pages=['','about-us','contact-us','example-websites','our-process','privacy-policy','thank-you',
 'websites-for-plumbers','websites-for-electricians','websites-for-window-cleaners','websites-for-painters',
 'websites-for-floor-cleaners','websites-for-roofers','websites-for-builders','websites-for-landscapers',
 'websites-for-plasterers','websites-for-driveway-cleaners'];
const errors=[];
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
 for(const hit of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const link=hit[1];
  if(link==='/'||link.endsWith('.css')||link.endsWith('.js'))continue;
  const local=path.join(root,link);
  if(!fs.existsSync(local)&&!fs.existsSync(path.join(local,'index.html')))errors.push('Broken internal reference on '+page+': '+link);
 }
}
for(const file of ['sitemap-index.xml','robots.txt','404.html']){
 // 404 is output as /404.html for Astro static; check only sitemap and robots
 if(file==='404.html')continue;
 if(!fs.existsSync(path.join(root,file)))errors.push('Missing site file: '+file);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('QA passed:',pages.length,'pages, internal files, canonical URLs, SEO metadata and no Breakdance dependencies.');
