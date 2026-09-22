import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from '@oai/artifact-tool';
import {root,finalPath,slides} from './content.mjs';
const p=await PresentationFile.importPptx(await FileBlob.load(finalPath));
const issues=[];
for(const [i,s] of p.slides.items.entries()){
 const l=JSON.parse(await(await s.export({format:'layout'})).text());
 await fs.writeFile(root+`/layout/final/final-slide-${String(i+1).padStart(2,'0')}.layout.json`,JSON.stringify(l,null,2));
 await fs.writeFile(root+`/rendered/final-slide-${String(i+1).padStart(2,'0')}.png`,new Uint8Array(await(await p.export({slide:s,format:'png',scale:1.5})).arrayBuffer()));
 for(const e of l.elements){
  const [x,y,w,h]=e.bbox??[0,0,0,0];
  if(x<-.8||y<-.8||x+w>960.8||y+h>540.8)issues.push({slide:i+1,kind:'bounds',id:e.id,name:e.name,bbox:e.bbox});
  if(/Khalid|Goal statement|XaaS|commodity|Click to |Committee Name/.test(e.text??''))issues.push({slide:i+1,kind:'sample text',text:e.text});
 }
}
const inspect=await p.inspect({kind:'slide,textbox,image,notes',maxChars:600000});await fs.writeFile(root+'/final-inspect.ndjson',inspect.ndjson);
await fs.writeFile(root+'/qa/structural-audit.json',JSON.stringify({slideCount:p.slides.items.length,expected:slides.length,issues},null,2));
console.log(JSON.stringify({slideCount:p.slides.items.length,issues},null,2));
