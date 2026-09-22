import fs from 'node:fs/promises';
const root='C:/Users/HP/Documents/Codex/2026-08-16/i';
let source=await fs.readFile(root+'/work/slides-build/exam-v2.mjs','utf8');
source=source.replace("const build=workspace+'/work/slides-build/exam-v2';", "const build=workspace+'/work/slides-build/closing-edit';");
const start=source.indexOf("s=slide('Appendix: evidence and assessment references');");
const end=source.indexOf("await fs.writeFile(build+'/speaker-notes.txt'",start);
source=source.slice(0,start)+`
s=slide('Conclusion and next steps');
text(s,'GlobalCommerce connects orders, stock and delivery records in one local platform.',64,164,1120,100,31,ink,true);
text(s,'Next steps',64,295,1120,55,30,ink,true);
text(s,'Connect real payment and carrier services.\\nEvaluate forecasting with representative sales data.\\nStrengthen security and test performance before production.',64,362,1120,145,28);
text(s,'Thank you',64,555,800,65,44,accent,true);
text(s,'I welcome your questions.',64,626,1000,38,26,muted);
notes(s,'20. Closing and next steps','30 seconds','To conclude, GlobalCommerce connects orders, inventory and delivery records in one local platform. Forecasting supports stock planning. The next stage is to connect real payment and carrier services, evaluate forecasts with representative sales data, and strengthen security and performance before production. Thank you for your time. I welcome your questions.','Use this as the final screen. Slide 19 is optional supporting material for design questions.','Distinguish the working local prototype from future production work. Do not claim that simulated integrations are live services.',['docs/project-report.md','docs/completion-checklist.md']);
`+source.slice(end);
source=source.slice(0,source.indexOf('for(let i=0;i<p.slides.items.length;i++)'))+`
const last=p.slides.items[19];
await fs.writeFile(build+'/slide-20.png',new Uint8Array(await(await p.export({slide:last,format:'png',scale:1})).arrayBuffer()));
console.log('Closing slide exported');
`;
await import('data:text/javascript;base64,'+Buffer.from(source.replace("from '@oai/artifact-tool'", "from 'file:///C:/Users/HP/Documents/Codex/2026-08-16/i/work/slides-build/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs'" )).toString('base64'));
