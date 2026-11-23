// Ensure a fresh, real photograph is assigned to each published trade blog post.
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const dir='src/content/blog',photos=new Map();let count=0;
for(const file of readdirSync(dir).filter(f=>f.endsWith('.md'))){
 const body=readFileSync(join(dir,file),'utf8'),front=body.split('---')[1];
 if(!body.startsWith('---')||!front)throw new Error('Article frontmatter missing: '+file);
 const lines=front.split('\n');
 const field=key=>{const line=lines.find(l=>l.trimStart().startsWith(key+':'));if(!line)return '';return line.slice(line.indexOf(':')+1).trim().replace(/^["']|["']$/g,'');};
 const when=Date.parse(field('date'));
 if(!Number.isFinite(when))throw new Error('Article date missing: '+file);
 if(when>Date.now())continue;
 const cover=field('image'),alt=field('imageAlt');
 if(!cover||!alt)throw new Error('Published post missing photo and/or alt: '+file);
 if(!cover.startsWith('/'))throw new Error('Host photographed cover locally for '+file);
 const local='public'+cover;
 if(!existsSync(local)||statSync(local).size<8000)throw new Error('Missing locally hosted photograph: '+local);
 if(photos.has(cover))throw new Error('Repeated cover '+cover+' on '+photos.get(cover)+' and '+file);
 photos.set(cover,file);count++;
}
console.log('UK_TRADE_BLOG_PHOTOS passed '+count+' distinct local published article photographs');
