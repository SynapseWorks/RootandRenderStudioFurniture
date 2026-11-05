const state={pieces:[],filter:'all'};
const archiveGrid=document.querySelector('#archive-grid');
const workshopGrid=document.querySelector('#workshop-grid');
const pieceDialog=document.querySelector('#piece-dialog');
const reserveDialog=document.querySelector('#reserve-dialog');
const dialogContent=document.querySelector('#dialog-content');
const reservationPiece=document.querySelector('#reservation-piece');

const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
function formatPrice(value){return value!=null&&value!==''?new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(value):'Price on request';}
function lifecycle(piece){return piece.lifecycle||(piece.status==='in-workshop'?'in-workshop':'concept');}
function publicPieces(){return state.pieces.filter(p=>p.publication!=='unlisted');}
function imageStyle(url){return url?`background-image:url('${String(url).replace(/'/g,"%27")}')`:'';}
function themeClass(piece){return `theme-${(piece.theme||'object').toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;}
function cardTemplate(piece){
 const progress=Number.isFinite(Number(piece.progress))?Math.max(0,Math.min(100,Number(piece.progress))):0;
 return `<article class="piece-card ${themeClass(piece)}" role="button" aria-haspopup="dialog" aria-controls="piece-dialog" tabindex="0" data-piece="${escapeHtml(piece.id)}" aria-label="View ${escapeHtml(piece.title)}">
   ${piece.image ? `<div class="piece-image" style="${imageStyle(piece.image)}"></div>` : ""}
   <div class="piece-card-content">
     <div class="piece-meta"><span class="status">${escapeHtml(piece.statusLabel)}</span><span class="price">${piece.status==="available"?formatPrice(piece.price):""}</span></div>
     <h3>${escapeHtml(piece.title)}</h3><p>${escapeHtml(piece.summary)}</p>
     ${lifecycle(piece)==='in-workshop'&&progress>0?`<div class="progress-wrap" aria-label="${progress}% complete"><span style="width:${progress}%"></span></div>`:''}
     <span class="card-invitation">View project <b aria-hidden="true">↗</b></span>
   </div>
 </article>`;
}
function render(){
 const workshop=publicPieces().filter(p=>lifecycle(p)==='in-workshop');
 workshopGrid.innerHTML=workshop.length?workshop.map(cardTemplate).join(''):'<p class="empty-state">No pieces are currently in the workshop. The next rescue is still waiting to be found.</p>';
 const catalog=publicPieces();
 const collections={staffs:"The Staffmaker's Collection",furniture:"Furniture & Transformations",cosplay:"Cosplay, Creatures & Props",technology:"Creative Technology & Mobility",woodcraft:"Woodcraft & Decorative Arts",creatures:"Creatures & Curiosities",mechanisms:"Mechanical Experiments"};
 const matches=(piece,filter)=>{
   if(filter==='all')return true;
   if(collections[filter])return piece.collection===collections[filter];
   if(filter==='concept')return ['idea','concept','prototype'].includes(lifecycle(piece));
   if(filter==='in-workshop')return lifecycle(piece)==='in-workshop';
   return piece.status===filter;
 };
 const visible=catalog.filter(piece=>matches(piece,state.filter));
 document.querySelectorAll('.filter-button').forEach(button=>{
   const filter=button.dataset.filter;
   const count=catalog.filter(piece=>matches(piece,filter)).length;
   button.dataset.label ||= button.textContent.trim();
   button.textContent=button.dataset.label+' ('+count+')';
   button.hidden=['available','found-a-home'].includes(filter)&&count===0;
 });
 document.querySelector('#archive-results').textContent=visible.length===1?'1 project':visible.length+' projects';
 archiveGrid.innerHTML=visible.length?visible.map(cardTemplate).join(''):'<p class="empty-state">No pieces in this part of the archive yet.</p>';
 document.querySelector('#workshop-count').textContent=workshop.length?`${workshop.length} ${workshop.length===1?'build is':'builds are'} currently in progress.`:'No active builds have been recorded here yet.';
 bindCards();
}
function bindCards(){document.querySelectorAll('[data-piece]').forEach(card=>{const open=()=>showPiece(card.dataset.piece);card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});}
function timelineTemplate(piece){
 if(!Array.isArray(piece.timeline)||!piece.timeline.length)return '';
 return `<div class="story-timeline">${piece.timeline.map(step=>`<article><div><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></div></article>`).join('')}</div>`;
}
function beforeAfterTemplate(piece){if(!piece.beforeImage||!piece.image)return'';return `<div class="before-after" data-before-after><div class="compare-layer compare-after" style="${imageStyle(piece.image)}"></div><div class="compare-layer compare-before" style="${imageStyle(piece.beforeImage)}"><span>Before</span></div><span class="after-label">After</span><input type="range" min="0" max="100" value="50" aria-label="Compare before and after images"></div>`;}
function galleryTemplate(piece){const images=Array.isArray(piece.gallery)?piece.gallery.filter(Boolean):[];if(!images.length)return'';return `<div class="dialog-gallery">${images.map((image,index)=>`<button type="button" data-gallery-image="${escapeHtml(image)}" aria-label="View gallery image ${index+1}" style="${imageStyle(image)}"></button>`).join('')}</div>`;}
function showPiece(id){
 const piece=publicPieces().find(p=>p.id===id);if(!piece)return;
 dialogContent.innerHTML=`${piece.image || piece.gallery?.length ? `<div class="dialog-hero ${escapeHtml(piece.imageClass||'')} ${themeClass(piece)}" style="${imageStyle(piece.image)}"><span class="dialog-status">${escapeHtml(piece.statusLabel)}</span></div>` : ""}
 <div class="dialog-body"><p class="eyebrow">Piece ${escapeHtml(piece.id)} · ${escapeHtml(piece.theme)}</p><h2 id="piece-title">${escapeHtml(piece.title)}</h2><p class="dialog-story">${escapeHtml(piece.story)}</p>
 ${beforeAfterTemplate(piece)}${timelineTemplate(piece)}${galleryTemplate(piece)}
 <div class="dialog-details"><div><small>Status</small>${escapeHtml(piece.statusLabel)}</div><div><small>Dimensions</small>${escapeHtml(piece.dimensions||'To be measured')}</div>${piece.status==='available'?`<div><small>Price</small>${formatPrice(piece.price)}</div>`:''}</div>
 <p class="dialog-story"><strong>${lifecycle(piece)==='concept'?'Planned materials':'Materials'}:</strong> ${escapeHtml(piece.materials||'Materials to be confirmed')} </p>

 ${piece.armouryUrl?`<p class="dialog-story"><a href="${escapeHtml(piece.armouryUrl)}" target="_blank" rel="noopener noreferrer">View technical record in Armoury ↗</a></p>`:''}
 ${piece.status==='available'?`<button class="button button-primary reserve-button" data-reserve="${escapeHtml(piece.id)}">Reserve this piece</button>`:''}</div>`;
 pieceDialog.showModal();
 const range=dialogContent.querySelector('[data-before-after] input');if(range)range.addEventListener('input',event=>event.currentTarget.closest('[data-before-after]').style.setProperty('--position',`${event.currentTarget.value}%`));
 dialogContent.querySelectorAll('[data-gallery-image]').forEach(button=>button.addEventListener('click',()=>{const hero=dialogContent.querySelector('.dialog-hero');hero.style.backgroundImage=`url('${button.dataset.galleryImage.replace(/'/g,"%27")}')`;hero.scrollIntoView({behavior:'smooth',block:'start'});}));
 const reserveButton=dialogContent.querySelector('.reserve-button');if(reserveButton)reserveButton.addEventListener('click',()=>{pieceDialog.close();reservationPiece.value=`Piece ${piece.id}: ${piece.title}`;reserveDialog.showModal();});
}

document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());});
document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-pressed','false')});button.classList.add('is-active');button.setAttribute('aria-pressed','true');state.filter=button.dataset.filter;render();}));

document.querySelector('#finish-list').innerHTML=['Ocean Driftwood','Aurora After Dark','Forest Relic','Autumn Ember','Ancient Stone','Midnight Botanical'].map(name=>`<span class="finish-chip">${name}</span>`).join('');
document.querySelector('#year').textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));

fetch('/data/pieces.json').then(response=>{if(!response.ok)throw new Error('Could not load collection');return response.json();}).then(data=>{state.pieces=data.pieces||[];render();window.dispatchEvent(new CustomEvent('objects:ready',{detail:{projects:publicPieces().map(p=>({id:p.id,title:p.title}))}}));}).catch(error=>{console.error(error);archiveGrid.innerHTML='<p class="empty-state">The archive is resting for a moment. Please return soon.</p>';workshopGrid.innerHTML='<p class="empty-state">Workshop updates are temporarily unavailable.</p>';});