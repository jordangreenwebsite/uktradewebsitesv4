/**
 * Unpack only the three user-supplied, tinified comparison screenshots.
 * They stay in the uploaded ZIP at wp-content/tinified.zip; no invented
 * website imagery or third-party remote assets are needed.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const archive=path.resolve(process.cwd(),'..','wp-content','tinified.zip');
const output=path.resolve(process.cwd(),'public','case-studies','roofing');
if(!fs.existsSync(archive)) throw new Error('Missing user-supplied before/after archive: '+archive);
fs.mkdirSync(output,{recursive:true});
const py=`import sys,os,zipfile
archive,dest=sys.argv[1:3]
images={'Before, full.JPG':'before.jpg','After full.JPG':'after.jpg','After - menu.PNG':'after-menu.png'}
with zipfile.ZipFile(archive) as zip:
 for source,filename in images.items():
  meta=zip.getinfo(source)
  if not 1000 < meta.file_size < 20000000:
   raise ValueError('Unexpected roofing image size: '+source)
  content=zip.read(meta)
  with open(os.path.join(dest,filename),'wb') as file:
   file.write(content)
  print('Roofing comparison:',filename,len(content),'bytes')
`;
const result=spawnSync('python3',['-c',py,archive,output],{encoding:'utf8'});
if(result.status!==0)throw new Error('Failed to unpack roofing comparison: '+result.stderr);
console.log(result.stdout.trim());
