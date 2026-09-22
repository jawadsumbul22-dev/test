import fs from 'node:fs/promises';
import {root,slides,project} from './content.mjs';
const map={outputSlides:[],omittedSourceSlides:[{sourceSlide:5,reason:'Dense GRC wheel is unrelated to commerce.'},{sourceSlide:6,reason:'Dense GRC roadmap is unrelated to commerce.'},{sourceSlide:7,reason:'Duplicate dense roadmap.'},{sourceSlide:8,reason:'Use a content-based conclusion instead of repeating the cover illustration.'}]};
const inventory=[];
for(let i=1;i<=8;i++){
 const l=JSON.parse(await fs.readFile(root+`/template-inspect/layouts/source-slide-${String(i).padStart(2,'0')}.layout.json`));
 inventory.push(JSON.stringify({slide:i,elements:l.elements,inheritedLayers:l.inheritedLayers}));
}
await fs.appendFile(root+'/template-inspect/template-inspect.ndjson','\n'+inventory.join('\n'));
for(const [index,s] of slides.entries()){
 const l=JSON.parse(await fs.readFile(root+`/template-inspect/layouts/source-slide-${String(s.source).padStart(2,'0')}.layout.json`));
 const targets=[];
 for(const e of l.elements){
  let action='keep',reason='Preserve template styling and composition.';
  const id=e.id;
  if(s.source===1 && id==='3') {action='rewrite';reason='Replace title and presenter within inherited styled runs.';}
  if(s.source===2 && ['3','4'].includes(id)) {action=id==='3'?'rewrite-and-reposition':'rewrite';reason='Rewrite title and four source bullets; widen title only to prevent wrapping. Keep exact font sizes.';}
  if(s.source===3){
   if(['3','5','4','2'].includes(id)) {action=id==='5'?'rewrite-and-reposition':'rewrite';reason='Rewrite heading, intro, takeaway and slide number in inherited shapes.';}
   if(['20','21','22','15','19'].includes(id)){action='delete';reason='Remove original GRC images and stray overlays; use explicit diagram zone.';}
  }
  if(s.source===4){
   if(['2','3','5','10'].includes(id)){action=id==='10'?'rewrite-and-reposition':'rewrite';reason='Replace caption, title and footer text. Move caption right to separate it from the screenshot frame.';}
   else if(id==='26'){action='replace';reason='Replace source diagram image with genuine Inventory screenshot, contain fit in inherited frame.';}
   else if(!['24','25'].includes(id)){action='delete';reason='Remove obsolete year labels, blank overlays and off-slide duplicate page marker.';}
  }
  targets.push({sourceElementId:e.aid,shapeId:id,action,reason});
 }
 for(const layer of l.inheritedLayers??[]) for(const e of layer.elements??[]){
  if(/Placeholder|Text Box/.test(e.name??'') || /Click to edit|Drag picture|Committee/.test(e.text??'')) targets.push({shapeId:e.id,scope:layer.scope,layoutId:layer.id,action:'fill-placeholder',reason:'Fill inherited prompt with authored project metadata; do not alter hierarchy or styling.'});
 }
 if(s.source===3) targets.push({action:'add',newPrimitiveAllowed:true,mustNotOverlapInherited:true,zone:{left:34,top:185,width:565,height:310},reason:'Native diagram replaces the removed source diagram inside its inherited media region. Short labels use Georgia and the source red/black palette.'});
 if(s.source===3) targets.push({action:'add',newPrimitiveAllowed:true,mustNotOverlapInherited:true,zone:{left:625,top:195,width:255,height:135},reason:'Concise diagram key replaces unsupported WMF asset in its original media region.'});
 if(s.source===2) targets.push({action:'add',newPrimitiveAllowed:true,mustNotOverlapInherited:true,zone:{left:744,top:500.5,width:216,height:28.83},reason:'Consistent page numbering using the source slide 3 footer typography and position; source slide 2 lacks a slide-level page field.'});
 map.outputSlides.push({outputSlide:index+1,sourceSlide:s.source,narrativeRole:s.role,reuseMode:'duplicate-slide',editTargets:targets});
}
await fs.writeFile(root+'/template-frame-map.json',JSON.stringify(map,null,2));
await fs.writeFile(root+'/slide-plan.txt','Purpose: Jawad Ahmad explains his EduQual Level 6 project in simple English. Main story: problem, scope, design, one order, forecast, monitoring, evidence, demo, limitations, conclusion. 17 main slides, 2 viva appendices. Approximate rehearsal target: 12–15 minutes speaking plus 5 minutes demo, subject to the official allotted time. Source deck: duplicated cover, text, diagram and screenshot layouts. Preserve Georgia/red theme and inherited typography; never shrink inherited type. No GitHub upload. No production or forecast accuracy guarantees. All speaker notes are coaching text to be adapted honestly.\n'+slides.map((s,i)=>`${i+1}: ${s.title} [source ${s.source}]`).join('\n'));
await fs.writeFile(root+'/source-notes.txt',`User-supplied sample PPTX: C:/Users/HP/Downloads/Sample Presentation EduQual Diplomas (1).pptx. All retained cover graphics come from that source; no inferred ownership or endorsement. Exam guide and topic PDFs in Downloads. Actual project source: ${project}. Source inspection and guide extracts in work/exam-review. Inventory screenshot captured with Browser skill from localhost:3000 on 28 August 2026, no business records mutated. Forecast/stock diagram examples are explicitly illustrative. No external web claims, production performance, certified security or measured business impact stated. Current code limitations override optimistic older documents. Theme parts must remain exact.`);
console.log('Mapped',slides.length,'slides');
