import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const archive=path.resolve(process.cwd(),'..','wp-content','tinified.zip');
if(!fs.existsSync(archive)){console.log('Roofing case-study archive is not present.');process.exit(0)}
const py=`import zipfile,sys,os
with zipfile.ZipFile(sys.argv[1]) as archive:
 for member in archive.infolist():
  print("CASE-STUDY-ASSET",repr(member.filename),"bytes",member.file_size)
`;
const p=spawnSync('python3',['-c',py,archive],{encoding:'utf8'});
if(p.status!==0)throw Error('Could not inspect case-study archive: '+p.stderr);
console.log(p.stdout.trim());
