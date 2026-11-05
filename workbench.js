/* Browser-only workshop desk: does not transmit notes or inventory. */
(()=>{
'use strict';
const STORAGE_KEY='root-render:workbench:v1';
const $=selector=>document.querySelector(selector);
const inventoryForm=$('#inventory-form'),journalForm=$('#journal-form');
if(!inventoryForm||!journalForm)return;
const empty=()=>({version:1,inventory:[],journal:[]});
let store;
try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');store=valid(value)?value:empty();}catch{store=empty();}
const projects=[{id:'general',title:'General workshop'}];
const listInventory=$('#inventory-list'),listJournal=$('#journal-list');
const status=$('#workbench-status');
function valid(data){return data&&data.version===1&&Array.isArray(data.inventory)&&Array.isArray(data.journal)&&data.inventory.length<=10000&&data.journal.length<=10000;}
function clean(value,max=5000){return String(value??'').slice(0,max);}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(store));setStatus('Saved in this browser only.');}catch{setStatus('Browser storage unavailable. Please export a backup.');}}
function setStatus(message){status.textContent=message;}
function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
function makeEntry(title,details,onDelete){const article=el('article',undefined,'workbench-entry');const content=el('div');content.append(el('strong',title),el('p',details));const button=el('button','Delete');button.type='button';button.setAttribute('aria-label','Delete '+title);button.addEventListener('click',onDelete);article.append(content,button);return article;}
function renderInventory(){
 listInventory.replaceChildren();
 if(!store.inventory.length){listInventory.append(el('p','Nothing in your inventory yet. Add materials as you discover them.'));return;}
 for(const item of store.inventory.slice().reverse()){const desc=[item.owned?'On hand':'To buy',item.category,item.quantity,item.location&&'Stored: '+item.location].filter(Boolean).join(' · ');
  listInventory.append(makeEntry(item.name,desc,()=>{store.inventory=store.inventory.filter(x=>x.id!==item.id);persist();renderInventory();}));}
}
function renderJournal(){
 listJournal.replaceChildren();
 if(!store.journal.length){listJournal.append(el('p','No journal entries yet. Record your first experiment or lesson.'));return;}
 for(const item of store.journal.slice().reverse()){
  const label=projects.find(p=>p.id===item.project)?.title||item.project;
  const entry=makeEntry(item.kind+' · '+label,item.date,()=>{store.journal=store.journal.filter(x=>x.id!==item.id);persist();renderJournal();});
  const content=entry.querySelector('div');content.append(el('p',item.note));
  listJournal.append(entry);
 }
}
function renderProjects(){
 const select=$('#journal-project');const selected=select.value;
 select.replaceChildren();for(const item of projects){const option=el('option',item.title);option.value=item.id;select.append(option);}
 if(projects.some(x=>x.id===selected))select.value=selected;
}
window.addEventListener('objects:ready',event=>{const provided=event.detail?.projects||[];const seen=new Set(projects.map(x=>x.id));for(const p of provided){if(typeof p.id!=='string'||typeof p.title!=='string'||seen.has(p.id))continue;projects.push({id:clean(p.id,80),title:clean(p.title,160)});seen.add(p.id);}renderProjects();renderJournal();});
inventoryForm.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(inventoryForm);const name=clean(f.get('name'),120).trim();if(!name)return;store.inventory.push({id:crypto.randomUUID(),name,category:clean(f.get('category'),80),quantity:clean(f.get('quantity'),80),location:clean(f.get('location'),100),owned:f.has('owned')});persist();inventoryForm.reset();renderInventory();});
journalForm.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(journalForm);const note=clean(f.get('note')).trim();if(!note)return;store.journal.push({id:crypto.randomUUID(),project:clean(f.get('project'),80)||'general',kind:clean(f.get('kind'),50),date:new Date().toISOString(),note});persist();journalForm.reset();renderJournal();});
$('#export-workbench').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download='root-render-workshop-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Backup exported. Store it somewhere safe.');
});
$('#import-workbench').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>1500000){setStatus('Backup file is too large.');e.target.value='';return;}
 try{const next=JSON.parse(await file.text());if(!valid(next))throw Error('Invalid backup format');
 const safe={version:1,inventory:next.inventory.map(x=>({id:clean(x.id,80),name:clean(x.name,120),category:clean(x.category,80),quantity:clean(x.quantity,80),location:clean(x.location,100),owned:!!x.owned})),journal:next.journal.map(x=>({id:clean(x.id,80),project:clean(x.project,80),kind:clean(x.kind,50),date:clean(x.date,50),note:clean(x.note)}))};
 if(!window.confirm('Replace your current browser-only inventory and journal with this backup? Export first if you need to preserve current entries.'))return;
 store=safe;persist();renderInventory();renderJournal();setStatus('Backup imported in this browser.');
 }catch{setStatus('Could not import this file. Use a valid Root & Render workshop backup.');}finally{e.target.value='';}
});
renderProjects();renderInventory();renderJournal();
})();