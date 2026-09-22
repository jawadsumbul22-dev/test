import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from '@oai/artifact-tool';
import {root,project,finalPath,fullTitle,slides} from './final-content.mjs';
const p=await PresentationFile.importPptx(await FileBlob.load(root+'/template-starter.pptx'));
const red='#C00000',ink='#202020';
const shape=(slide,id)=>slide.shapes.items.find(x=>x.id===id);
function replaceAll(s,text){const old=String(s.text);if(old) s.text.replace(old,text); else s.text=text;}
function drop(slide,ids){for(const id of ids){if(slide.shapes.items.some(s=>s.id===id))slide.shapes.deleteById(id);else if(slide.images.items.some(s=>s.id===id))slide.images.deleteById(id);}}
function text(slide,txt,x,y,w,h,{size=18.67,bold=false,color=ink,align='left',box=false}={}){
 const s=slide.shapes.add({geometry:box?'rect':'textbox',name:'Commerce diagram: '+txt.replaceAll('\n',' '),position:{left:x,top:y,width:w,height:h},fill:box?'#FFF9F7':'none',line:{fill:box?red:'none',width:box?1.2:0}});
 s.text=txt;s.text.style={typeface:'Georgia',fontSize:size,bold,color,alignment:align,verticalAlignment:'middle',autoFit:'none',wrap:'square',insets:{left:6,right:6,top:3,bottom:3}};return s;
}
function arrow(slide,x,y,w,h,vertical=false){slide.shapes.add({geometry:vertical?'downArrow':'rightArrow',name:'Flow arrow',position:{left:x,top:y,width:w,height:h},fill:red,line:{fill:'none',width:0}});}
function leftArrow(slide,x,y,w,h){slide.shapes.add({geometry:'leftArrow',name:'Flow arrow',position:{left:x,top:y,width:w,height:h},fill:red,line:{fill:'none',width:0}});}
function line(slide,x,y,w,h){slide.shapes.add({geometry:'line',name:'Metric flow branch',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:red,width:1.3}});}
function chain(slide,labels){
 const x=43,w=167,gap=22,y=231,h=66;
 arrow(slide,x+w,y+24,gap,18);arrow(slide,x+2*w+gap,y+24,gap,18);
 labels.forEach((s,i)=>text(slide,s,x+i*(w+gap),y,w,h,{box:true,align:'center'}));
}
function diagram(slide,kind){
 if(kind==='architecture'){
  arrow(slide,196,224,32,18);arrow(slide,390,224,32,18);
  arrow(slide,295,262,18,53,true);
  line(slide,377,262,0,35);line(slide,377,297,131,0);arrow(slide,499,298,18,17,true);
  arrow(slide,496,382,18,48,true);
  text(slide,'React console',43,206,153,56,{box:true,align:'center'});
  text(slide,'FastAPI',228,206,162,56,{box:true,align:'center'});
  text(slide,'PostgreSQL',422,206,171,56,{box:true,align:'center'});
  text(slide,'Redis\nRate limiting',228,315,162,66,{box:true,align:'center'});
  text(slide,'Prometheus',422,315,171,66,{box:true,align:'center'});
  text(slide,'Grafana',422,430,171,55,{box:true,align:'center'});
  text(slide,'Docker Compose\nSix local services',43,349,169,83,{size:18.67,color:red});
  text(slide,'API metrics',414,272,179,24,{size:14.67});
  text(slide,'Forecasting runs\ninside FastAPI.\n\nPostgreSQL stores\nbusiness records.',625,194,255,135);
 }
 if(kind==='inventory'){
  text(slide,'120',48,248,145,55,{size:26.67,bold:true,align:'center'});
  text(slide,'−',194,248,43,55,{size:26.67,align:'center'});
  text(slide,'3',238,248,130,55,{size:26.67,bold:true,align:'center'});
  text(slide,'=',374,248,43,55,{size:26.67,align:'center'});
  text(slide,'117',430,248,155,55,{size:26.67,bold:true,color:red,align:'center'});
  text(slide,'On hand',48,311,145,45,{align:'center'});
  text(slide,'Reserved',238,311,130,45,{align:'center'});
  text(slide,'Available',430,311,155,45,{align:'center'});
  text(slide,'Illustrative stock balance',48,405,538,40,{size:14.67,align:'center'});
  text(slide,'Stock is tracked for\neach product and\nwarehouse.\n\nReservation is not\na physical shipment.',625,194,255,135);
 }
 if(kind==='order'){
  arrow(slide,207,242,24,18);arrow(slide,407,242,24,18);arrow(slide,508,298,18,77,true);
  leftArrow(slide,207,395,24,18);leftArrow(slide,407,395,24,18);
  text(slide,'1. Check request\nand repeat key',43,216,164,82,{box:true,align:'center'});
  text(slide,'2. Lock stock\nand reserve',231,216,176,82,{box:true,align:'center'});
  text(slide,'3. Calculate\nsimulated costs',431,216,161,82,{box:true,align:'center'});
  text(slide,'4. Order +\npayment +\nshipment',431,375,161,99,{box:true,align:'center'});
  text(slide,'6. Return\norder ID',43,375,164,82,{box:true,align:'center'});
  text(slide,'5. Commit\nall records',231,375,176,82,{box:true,align:'center'});
  text(slide,'Successful creation\ncommits together.\n\nAn error should\nroll back changes.',625,194,255,135);
 }
 if(kind==='forecast'){
  chain(slide,['Seed / imported\ndaily sales','Lag + rolling\nfeatures','Forest / weekly\nbaseline']);
  arrow(slide,491,297,18,56,true);
  text(slide,'Earlier 80%: train\nLater 20%: evaluate',43,356,291,87,{size:18.67});
  text(slide,'1–30 day\npredictions',420,353,172,87,{box:true,align:'center'});
  text(slide,'MAE / RMSE\nmeasure holdout error.\n\nIntervals are\nresidual-based,\nnot calibrated.',625,194,255,135);
 }
 if(kind==='replenish'){
  text(slide,'60 + 15 − 50 = 25',43,225,550,70,{size:26.67,bold:true,color:red,align:'center'});
  text(slide,'Demand + safety stock − available stock',43,306,550,55,{size:18.67,align:'center'});
  text(slide,'Suggested order: 25 units',43,382,550,45,{size:26.67,bold:true,align:'center'});
  text(slide,'Illustrative seven-day example; result cannot be below zero.',43,448,550,42,{size:14.67,align:'center'});
  text(slide,'A recommendation\nneeds review.\n\nSupplier lead times\nand purchasing are\nfuture extensions.',625,194,255,135);
 }
 if(kind==='monitoring'){
  chain(slide,['FastAPI\nmeasurements','Prometheus\ncollects / stores','Grafana\nvisualizes']);
  arrow(slide,310,297,18,62,true);
  text(slide,'Commerce console\nSelected monitoring summaries',157,359,335,94,{box:true,align:'center'});
  text(slide,'Business view:\norders and stock\n\nTechnical view:\ntraffic, latency\nand errors',625,194,255,135);
 }
}
// Intentional shared change: fill source prompts with project metadata, preserving all masters/layouts.
// Only inherited placeholder text is changed. Source decoration, geometry and theme remain untouched.
for(const l of [...p.masters.items,...p.layouts.items]) for(const s of l.shapes.items){
 if(s.hasPlaceholderMetadata || /Placeholder|Text Box/.test(s.name??'')){
  const proto=s.toProto(); const typ=proto.placeholderType;
  const value=typ==='dateTime'?'6 September 2026':typ==='slideNumber'?'GlobalCommerce':typ==='pic'?'Project illustration':typ==='footer'?'Jawad Ahmad · EduQual Level 6':typ==='title'?'GlobalCommerce':'Enterprise commerce project';
  s.text=value;
 }
}
const oldBullets=['Goal statement  ','Additional Benefits = increased Operations Maturity','Value of the Unified Integrated Management System framework','Operating as ONE'];
for(const [i,data] of slides.entries()){
 const s=p.slides.items[i];
 if(data.source===1){
  const t=shape(s,'3');
  for(const [a,b] of [['Cyber Security, Governance, Risk and Conformance','GlobalCommerce\nEnterprise Platform'],['Customer Centric','Cross-border commerce'],['Sales Focused','Inventory and logistics'],['Business Driven','Demand forecasting'],['Presenters:','Presented by:'],['Khalid Bin Waleed','Jawad Ahmad']])t.text.replace(a,b);
 }
 if(data.source===2){
  const t=shape(s,'3');replaceAll(t,data.title);t.position={...t.position,width:780};
  const body=shape(s,'4');for(let j=0;j<4;j++)body.text.replace(oldBullets[j],data.bullets[j]);
  const page=s.shapes.add({geometry:'textbox',name:'Page number',position:{left:744,top:500.5,width:216,height:28.83},fill:'none',line:{fill:'none',width:0}});
  page.text=String(i+1);page.text.style={typeface:'Calibri',fontSize:18,insets:{left:9.6,right:9.6,top:4.8,bottom:4.8}};
 }
 if(data.source===3){
  const t=shape(s,'5');replaceAll(t,data.title);t.position={...t.position,width:780};
  replaceAll(shape(s,'4'),data.intro);replaceAll(shape(s,'2'),data.callout);replaceAll(shape(s,'3'),String(i+1));
  drop(s,['20','21','22','15','19']);diagram(s,data.diagram);
 }
 if(data.source===4){
  replaceAll(shape(s,'5'),data.title);replaceAll(shape(s,'2'),'Local demonstration');replaceAll(shape(s,'3'),String(i+1));
  const caption=shape(s,'10');
  caption.position={left:690,top:267.16,width:247.77,height:80};
  caption.text=[{runs:[{run:'Stock by warehouse',textStyle:{typeface:'Georgia',fontSize:'14.67px'}}]},{runs:[{run:'On hand − reserved\n= available',textStyle:{typeface:'Georgia',fontSize:'14.67px'}}]}];
  drop(s,['4','7','8','9','11','13','14','15','16','17']);
  const img=s.images.items.find(x=>x.id==='26');img.replace({blob:await fs.readFile(root+'/inventory-screen.png'),contentType:'image/png',fit:'contain',alt:'Genuine local Inventory screen, captured 28 August 2026'});img.fit='contain';img.crop={left:0,right:0,top:0,bottom:0};
 }
 const refs=data.sources.map(x=>x.replace('order_service.py','orders.py').replace('forecast_service.py','forecasting.py')).map(x=>x==='Oral Presentation Exam Guide.pdf'?'C:/Users/HP/Downloads/'+x:x==='Exam topic PDF'?'C:/Users/HP/Downloads/Jawad Ahmad _Exam Topic for Oral Presentation_DAIOL6.pdf':x==='Sample Presentation EduQual Diplomas (1).pptx'?'C:/Users/HP/Downloads/'+x:x.startsWith('Local UI')?'http://localhost:3000 — '+x:project+'/'+x);
 for(const ref of refs.filter(r=>!r.startsWith('http'))) await fs.access(ref);
 const sources='[Sources]\n'+refs.join('\n')+'\nTemplate layout and retained illustration: C:/Users/HP/Downloads/Sample Presentation EduQual Diplomas (1).pptx\n[/Sources]';
 const notes=`SLIDE ${i+1}: ${data.title}\n\nSAY — suggested wording; adapt honestly:\n${data.say}\n\nSHOW / DO:\n${data.show}\n\nIF ASKED:\n${data.ask}\n\n${i===0?'FORMAL ASSIGNED TITLE:\n'+fullTitle+'\n\n':''}${sources}`;
 s.speakerNotes.textFrame.setText(notes);
}
await fs.mkdir(root+'/rendered',{recursive:true});await fs.mkdir(root+'/layout/final',{recursive:true});
for(const [i,s] of p.slides.items.entries()){
 const stem=`final-slide-${String(i+1).padStart(2,'0')}`;
 await fs.writeFile(root+`/rendered/${stem}.png`,new Uint8Array(await (await p.export({slide:s,format:'png',scale:1.5})).arrayBuffer()));
 await fs.writeFile(root+`/layout/final/${stem}.layout.json`,await(await s.export({format:'layout'})).text());
}
const candidatePath=root+'/final-candidate.pptx';
const out=await PresentationFile.exportPptx(p);await out.save(candidatePath);
const { finalizePresentation } = await import('file:///C:/Users/HP/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations/container_tools/artifact_tool_utils.mjs');
const skill='C:/Users/HP/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
await finalizePresentation({workspaceDir:root,candidatePath,finalPath,pythonExecutable:'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','9144000,5143500','--validate-bullet-geometry','--validate-heading-fit'],explicitTotalSlideCount:19,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:root+'/qa/final-validation.json'});
await fs.rename(finalPath+'.inspect.ndjson',root+'/export-inspect.ndjson').catch(()=>{});
await fs.writeFile(root+'/final-inspect.ndjson',(await p.inspect({kind:'slide,textbox,image,notes',maxChars:600000})).ndjson);
console.log('Created',finalPath,'with',slides.length,'slides and speaker notes.');
