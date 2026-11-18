// Generate site-hosted social cards without modifying the original concept design.
// Never require remote images to build: embedded/local assets first, then a bounded
// fetch of existing licensed stock assets. A unique typographic card is the fallback.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=path.resolve('dist');
const origin='https://uktradewebsites.co.uk';
const names={
 'absolute-shine-window-cleaning':'Absolute Shine Window Cleaning',
 'all-round-garden-property-maintenance':'All Round Garden & Property Maintenance',
 'argon-window-cleaning':'Argon Window Cleaning','bark-and-sparkle':'Bark & Sparkle',
 'beautyology-by-renata':'Beautyology by Renata','breeze-electrical-solutions':'Breeze Electrical Solutions',
 'chandler-brown-carpentry-property-services':'Chandler-Brown Carpentry & Property Services',
 'clean-cymru':'Clean Cymru','drop-the-mop':'Drop the Mop','eco-plumbing-north-east':'Eco Plumbing North East',
 'emjay-interior-creations':'Emjay Interior Creations','evans-build':'Evans Build','flash-window-cleaning':'Flash Window Cleaning',
 'foot-health-by-emma':'Foot Health by Emma','gpps-gloucestershire-paint-polish':'GPPS Gloucestershire Paint & Polish',
 'hooves-paws-helping-hands':'Hooves, Paws & Helping Hands','jse-window-cleaning':'JSE Window Cleaning Service',
 'nailed-it-home-solutions':'Nailed It Home Solutions','rennco':'Rennco','rgd-plumbing-and-heating':'RGD Plumbing & Heating',
 's-burnell-accountancy-bookkeeping':'S Burnell Accountancy & Bookkeeping','samson-chimney-sweep':'Samson Chimney Sweep',
 'shanna-beauty':'Shanna Beauty','studio-3':'Studio 3','studio-mabbs':'Studio Mabbs','the-beauty-room-swansea':'The Beauty Room Swansea',
 'timber-doors':'Timber Doors','tree-and-outdoor-services':'Tree & Outdoor Services','weathershield-roofing-services':'Weathershield Roofing Services',
 'williams-detailing':'Williams Detailing','winchcomb-electrical':'Winchcombe Electrical','jemoba':'JEMOBA'
};
const decode=s=>String(s||'').replace(/&(?:amp|quot|apos|lt|gt|nbsp|#39|#8217|#8211|#8212);/g,m=>({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' ','&#39;':"'",'&#8217;':"’",'&#8211;':'–','&#8212;':'—'}[m]||m));
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>decode(String(s||'').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const attr=(tag,key)=>decode(tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(["\\\'])([\\s\\S]*?)\\1','i'))?.[2]||'');
const headOf=html=>html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0]||'';
const slugName=slug=>slug.split('-').map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(' ');
const allowedHost=new Set(['images.pexels.com','images.unsplash.com','cleancymru.com']);
function stockUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&['images.pexels.com','images.unsplash.com'].includes(u.hostname)&&!u.username&&!u.password;}catch{return false}}
async function asset(src,dir,remote=false){
 if(!src)return null;
 try{
  const embedded=src.match(/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,([a-z0-9+/=\s]+)$/i);
  if(embedded){if(embedded[1].length>12_000_000)return null;return Buffer.from(embedded[1],'base64');}
  if(!/^https?:/i.test(src)&&!src.startsWith('//')&&!src.startsWith('data:')){
   const local=src.startsWith('/')?path.resolve(root,'.'+src):path.resolve(dir,src);
   if(!local.startsWith(root+path.sep))return null;
   const stat=await fs.stat(local);if(stat.size>8_000_000)return null;return await fs.readFile(local);
  }
  if(!remote)return null;
  const u=new URL(src);if(u.protocol!=='https:'||!allowedHost.has(u.hostname)||u.username||u.password||u.port)return null;
  if(u.hostname==='cleancymru.com'&&u.pathname!=='/wp-content/uploads/2025/05/ext-custom-logo-1748267190361.webp')return null;
  if(u.hostname!=='cleancymru.com')u.searchParams.set('w','850');
  const res=await fetch(u,{signal:AbortSignal.timeout(4000),redirect:'error',headers:{'User-Agent':'UKTradeWebsites Concept Preview Builder'}});
  if(!res.ok||!/^image\//i.test(res.headers.get('content-type')||''))return null;
  if(Number(res.headers.get('content-length'))>8_000_000)return null;
  const chunks=[];let size=0;for await(const chunk of res.body){size+=chunk.length;if(size>8_000_000)return null;chunks.push(chunk)}return Buffer.concat(chunks);
 }catch{return null}
}
async function prepare(src,dir,width,height,fit,remote=false){
 try{const bytes=await asset(src,dir,remote);if(!bytes)return null;return await sharp(bytes,{limitInputPixels:30_000_000,animated:false}).rotate().resize(width,height,{fit,background:{r:255,g:255,b:255,alpha:1},position:'centre'}).png().toBuffer();}catch{return null}
}
function colour(html){
 const rootCss=html.match(/:root\s*\{([^}]+)\}/i)?.[1]||'';
 const c=rootCss.match(/--(?:accent|blue|green|gold|brand|copper|bright|primary)\s*:\s*(#[0-9a-f]{6})\b/i)?.[1]||rootCss.match(/--(?:navy|deep|ink|black)\s*:\s*(#[0-9a-f]{6})\b/i)?.[1]||'#527080';
 return c;
}
function lines(text,max=24){
 const out=[];let row='';for(const word of text.split(/\s+/)){if(row&&(row+' '+word).length>max){out.push(row);row=word}else row+=(row?' ':'')+word;}if(row)out.push(row);return out;
}
async function walk(dir){let a=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())a.push(...await walk(p));else if(e.name==='index.html')a.push(p)}return a}
function metadata(html,url,title,description,image,alt){
 const h=headOf(html);if(!h)throw Error('Concept is missing head: '+url);
 const clean=h.replace(/<meta\b[^>]*>/gi,tag=>{const key=(attr(tag,'property')||attr(tag,'name')).toLowerCase();return key.startsWith('og:')||key.startsWith('twitter:')?'':tag});
 const entries=[['property','og:type','website'],['property','og:locale','en_GB'],['property','og:title',title],['property','og:description',description],['property','og:url',url],['property','og:site_name','UK Trade Websites & Prunus Media'],['property','og:image',image],['property','og:image:secure_url',image],['property','og:image:type','image/jpeg'],['property','og:image:width','1200'],['property','og:image:height','630'],['property','og:image:alt',alt],['name','twitter:card','summary_large_image'],['name','twitter:title',title],['name','twitter:description',description],['name','twitter:image',image],['name','twitter:image:alt',alt]];
 const tags=entries.map(([a,k,v])=>'<meta '+a+'="'+esc(k)+'" content="'+esc(v)+'">').join('\n');
 return html.replace(h,()=>clean.replace(/<\/head>/i,()=>'\n'+tags+'\n</head>'));
}
async function concept(dir,slug){
 const file=path.join(dir,'index.html'),html=await fs.readFile(file,'utf8'),name=names[slug]||slugName(slug);
 const title=name+' | Your New Website Concept';
 const description='A website concept prepared especially for '+name+' by UK Trade Websites and Prunus Media. See what your new website could look like.';
 const alt='Personalised website concept preview for '+name+' (not the official business website)';
 const imageName='share-preview.jpg';
 const preview=path.join(dir,imageName);
 let source='branded card',custom=false;
 try{const bytes=await fs.readFile(path.join(dir,'share.jpg'));const m=await sharp(bytes).metadata();if(m.width===1200&&m.height===630){await sharp(bytes).jpeg({quality:86,mozjpeg:true}).toFile(preview);source='supplied share image';custom=true}}catch{}
 if(!custom){
  const images=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>({src:attr(m[0],'src'),alt:attr(m[0],'alt'),class:attr(m[0],'class'),hero:/fetchpriority\s*=\s*["']high/i.test(m[0])}));
  const logos=images.filter(x=>/\blogo\b|wordmark/i.test(x.alt+' '+x.class+' '+x.src.slice(0,120)));
  const logoSrc=logos[0]?.src||(slug==='clean-cymru'?images[0]?.src:'');
  const logo=await prepare(logoSrc,dir,320,132,'contain',slug==='clean-cymru');
  const hero=images.filter(x=>x.src&&x.src!==logoSrc&&!/\blogo\b|wordmark/i.test(x.alt+' '+x.class)).sort((a,b)=>Number(b.hero)-Number(a.hero));
  // CSS hero backgrounds are often used on these static concepts.
  const cssPhotos=[...html.matchAll(/url\(\s*["']?(https:\/\/images\.(?:pexels|unsplash)\.com\/[^)"'\s]+)["']?\s*\)/gi)].map(m=>decode(m[1]));
  const candidates=[...new Set([...hero.map(x=>x.src),...cssPhotos])].filter(x=>!!x&&(!/^https?:/i.test(x)||stockUrl(x)));
  let photo=null;
  if(candidates.length)photo=await prepare(candidates[0],dir,496,428,'cover',stockUrl(candidates[0]));
  // Keep the card legible and distinct even when no stock host is reachable.
  const accent=colour(html),business=lines(name,20).slice(0,4),brandFont=business.length>=4?42:business.length===3?50:59,brandStep=brandFont*1.14;
  const yStart=logo?238:180;
  const heading=business.map((l,i)=>'<text x="64" y="'+(yStart+i*brandStep)+'" font-size="'+brandFont+'" font-family="DejaVu Sans,Arial,sans-serif" font-weight="700" fill="#17262b">'+esc(l)+'</text>').join('');
  const teaserY=Math.max(432,yStart+(business.length-1)*brandStep+73);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f8f6f0"/><rect x="0" y="0" width="1200" height="12" fill="'+accent+'"/><rect x="630" y="0" width="570" height="630" fill="'+accent+'"/><circle cx="1150" cy="35" r="210" fill="#fff" opacity=".10"/><circle cx="674" cy="600" r="200" fill="#15232a" opacity=".08"/><text x="64" y="70" font-family="DejaVu Sans,Arial,sans-serif" font-size="19" font-weight="700" letter-spacing="3" fill="#4d6060">DESIGNED ESPECIALLY FOR</text>'+heading+'<text x="64" y="'+teaserY+'" font-family="DejaVu Sans,Arial,sans-serif" font-size="26" fill="#394b50">Your new website concept</text><rect x="64" y="505" width="440" height="1" fill="#c9ceca"/><text x="64" y="550" font-family="DejaVu Sans,Arial,sans-serif" font-size="18" font-weight="700" fill="#394b50">UK Trade Websites + Prunus Media</text><text x="64" y="581" font-family="DejaVu Sans,Arial,sans-serif" font-size="15" fill="#52686b">Design proposal · Not the official website</text><rect x="660" y="85" width="496" height="472" rx="16" fill="#ffffff"/><circle cx="681" cy="109" r="4" fill="#c6ccc8"/><circle cx="695" cy="109" r="4" fill="#c6ccc8"/><circle cx="709" cy="109" r="4" fill="#c6ccc8"/><rect x="728" y="102" width="352" height="14" rx="7" fill="#eeefeb"/><rect x="660" y="129" width="496" height="428" fill="#e3e9e6"/><rect x="683" y="156" width="79" height="8" rx="4" fill="'+accent+'"/><rect x="1005" y="156" width="38" height="7" rx="3" fill="#b0beb9"/><rect x="1053" y="156" width="77" height="7" rx="3" fill="#b0beb9"/><rect x="683" y="199" width="425" height="204" rx="6" fill="'+accent+'"/><rect x="702" y="242" width="190" height="14" rx="4" fill="#fff" opacity=".93"/><rect x="702" y="269" width="270" height="12" rx="4" fill="#fff" opacity=".75"/><rect x="702" y="297" width="135" height="26" rx="4" fill="#fff" opacity=".9"/><rect x="683" y="426" width="200" height="104" rx="5" fill="#fff"/><rect x="901" y="426" width="230" height="104" rx="5" fill="#fff"/></svg>';
  const layers=[];
  if(logo){layers.push({input:logo,left:64,top:86});source='embedded/local logo card'}
  if(photo){layers.push({input:photo,left:660,top:129});source=logo?'logo and concept imagery':'concept imagery'}
  await sharp(Buffer.from(svg)).composite(layers).jpeg({quality:85,mozjpeg:true}).toFile(preview);
 }
 const meta=await sharp(preview).metadata();if(meta.width!==1200||meta.height!==630||meta.format!=='jpeg')throw Error('Invalid share image '+slug);
 const relative='/'+path.relative(root,dir).split(path.sep).join('/')+'/';
 const url=origin+relative,image=origin+relative+imageName;
 const routes=await walk(dir);
 for(const route of routes){const body=await fs.readFile(route,'utf8');const routeUrl=origin+'/'+path.relative(root,path.dirname(route)).split(path.sep).join('/')+'/';const withMeta=metadata(body,routeUrl,title,description,image,alt);if(!/noindex/i.test(headOf(withMeta)))throw Error('Missing existing concept noindex: '+route);await fs.writeFile(route,withMeta)}
 console.log('Concept share preview:',slug,source,'(',routes.length,'routes)');
}
const entries=(await fs.readdir(path.join(root,'concept-websites'),{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>[path.join(root,'concept-websites',e.name),e.name]);
try{await fs.access(path.join(root,'demos','jemoba','index.html'));entries.push([path.join(root,'demos','jemoba'),'jemoba'])}catch{}
let cursor=0;await Promise.all(Array.from({length:Math.min(8,entries.length)},async()=>{while(cursor<entries.length){const [dir,slug]=entries[cursor++];await concept(dir,slug)}}));
console.log('Generated '+entries.length+' personalised 1200 × 630 sharing images.');
