// Live deployment diagnostic: never substitute an in-repo file check for a live HTTP check.
// Prints robots, sitemap and all reachable same-origin links, using GET rather than HEAD.
const origin = 'https://uktradewebsites.co.uk';
const maxRoutes = 100;
const timeoutMs = 12000;
const normalize = value => {
  try {
    const url = new URL(value, origin);
    if (!['uktradewebsites.co.uk','www.uktradewebsites.co.uk'].includes(url.hostname)) return null;
    if (!['http:','https:'].includes(url.protocol)) return null;
    if (url.pathname.startsWith('/wp-content/') || url.pathname.startsWith('/_astro/')) return null;
    url.hash='';
    return url.pathname + url.search;
  } catch { return null; }
};
async function retrieve(route) {
  const url = new URL(route,origin);
  try {
    const response = await fetch(url, {redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});
    return {path:route,status:response.status,type:response.headers.get('content-type')||'',url:response.url,body:await response.text()};
  } catch (error) {
    return {path:route,status:0,type:'',url:url.href,body:'',error:String(error)};
  }
}
const failures = [];
const robots = await retrieve('/robots.txt');
console.log('ROBOTS status='+robots.status+' type='+robots.type+' destination='+robots.url);
console.log(robots.body.slice(0,6500).replace(/\r/g,''));
if (robots.status!==200||!robots.type.includes('text/plain')||!/User-agent:\s*\*/i.test(robots.body)||!/Allow:\s*\//i.test(robots.body)||/^Disallow:\s*\/\s*$/im.test(robots.body))
  failures.push('robots.txt not served as a valid allow-all text file');
const sitemap = await retrieve('/sitemap-index.xml');
console.log('SITEMAP status='+sitemap.status+' type='+sitemap.type+' destination='+sitemap.url);
if(sitemap.status!==200||!sitemap.body.includes('<sitemapindex')) failures.push('Sitemap index not served as XML');
const pages = new Set(['/']);
if(sitemap.status===200) {
  for (const match of sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const child = await retrieve(match[1]);
    console.log('SITEMAP CHILD '+child.path+' status='+child.status);
    for (const entry of child.body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const path=normalize(entry[1]);if(path)pages.add(path);
    }
  }
}
const urlSources = new Map();
const add = (path,source) => {if(!path)return; if(!urlSources.has(path))urlSources.set(path,new Set());urlSources.get(path).add(source);};
for(const path of [...pages].slice(0,maxRoutes)) {
  const result=await retrieve(path);
  if (result.status>=400||!result.status) failures.push('Page '+path+' returned '+result.status+' '+(result.error||''));
  for(const hit of result.body.matchAll(/<a\b[^>]*\bhref=["']([^"'#]+(?:#[^"']*)?)["']/gi)) {
    const link=normalize(hit[1]);if(link)add(link,path);
  }
}
console.log('CRAWLED '+pages.size+' sitemap pages; testing '+urlSources.size+' unique same-origin link destinations');
for(const [target,sources] of [...urlSources.entries()].slice(0,maxRoutes)) {
  const result=await retrieve(target);
  if (result.status>=400||!result.status) failures.push('Broken link '+target+' from '+[...sources].join(', ')+' -> '+result.status+' '+(result.error||''));
}
if(failures.length) console.log('LIVE ISSUES ('+failures.length+'):\n'+failures.join('\n'));
else console.log('LIVE CHECKS CLEAR: robots text, sitemap index and checked internal links.');
// A separate diagnostic, not a deploy gate: WAF and rollout timing can affect live requests.
