const state={pieces:[],filter:'all'};
const archiveGrid=document.querySelector('#archive-grid');
const workshopGrid=document.querySelector('#workshop-grid');
const pieceDialog=document.querySelector('#piece-dialog');
const reserveDialog=document.querySelector('#reserve-dialog');
const dialogContent=document.querySelector('#dialog-content');
const reservationPiece=document.querySelector('#reservation-piece');

function formatPrice(value){return value?new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(value):'Price coming soon';}
function imageStyle(piece){return piece.image?`background-image:url('${piece.image}')`:'';}
function cardTemplate(piece){return `<article class="piece-card" tabindex="0" data-piece="${piece.id}" aria-label="View ${piece.title}"><div class="piece-image ${piece.imageClass||''}" style="${imageStyle(piece)}"></div><div class="piece-card-content"><div class="piece-meta"><span class="status">Piece ${piece.id} · ${piece.statusLabel}</span><span class="price">${formatPrice(piece.price)}</span></div><h3>${piece.title}</h3><p>${piece.summary}</p></div></article>`;}
function render(){
 const workshop=state.pieces.filter(p=>['in-workshop','planned'].includes(p.status));
 workshopGrid.innerHTML=workshop.length?workshop.map(cardTemplate).join(''):'<p>No pieces are currently in the workshop.</p>';
 const visible=state.filter==='all'?state.pieces:state.pieces.filter(p=>p.status===state.filter);
 archiveGrid.innerHTML=visible.length?visible.map(cardTemplate).join(''):'<p>No pieces in this part of the archive yet.</p>';
 document.querySelector('#workshop-count').textContent=`${workshop.length} ${workshop.length===1?'object is':'objects are'} currently awakening in the workshop.`;
 bindCards();
}
function bindCards(){document.querySelectorAll('[data-piece]').forEach(card=>{const open=()=>showPiece(card.dataset.piece);card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});}
function showPiece(id){const piece=state.pieces.find(p=>p.id===id);if(!piece)return;dialogContent.innerHTML=`<div class="dialog-hero ${piece.imageClass||''}" style="${imageStyle(piece)}"></div><div class="dialog-body"><p class="eyebrow">Piece ${piece.id} · ${piece.theme}</p><h2>${piece.title}</h2><p class="dialog-story">${piece.story}</p><div class="dialog-details"><div><small>Status</small>${piece.statusLabel}</div><div><small>Dimensions</small>${piece.dimensions}</div><div><small>Price</small>${formatPrice(piece.price)}</div></div><p class="dialog-story"><strong>Materials:</strong> ${piece.materials}</p>${piece.status==='available'?`<button class="button button-primary reserve-button" data-reserve="${piece.id}">Reserve this piece</button>`:''}</div>`;pieceDialog.showModal();const reserveButton=dialogContent.querySelector('.reserve-button');if(reserveButton)reserveButton.addEventListener('click',()=>{pieceDialog.close();reservationPiece.value=`Piece ${piece.id}: ${piece.title}`;reserveDialog.showModal();});}

document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();}));
document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(b=>b.classList.remove('is-active'));button.classList.add('is-active');state.filter=button.dataset.filter;render();}));

document.querySelector('#finish-list').innerHTML=['Ocean Driftwood','Aurora','Forest Relic','Autumn Ember','Ancient Stone','Midnight Botanical'].map(name=>`<span class="finish-chip">${name}</span>`).join('');
document.querySelector('#year').textContent=new Date().getFullYear();

fetch('/data/pieces.json').then(response=>{if(!response.ok)throw new Error('Could not load collection');return response.json();}).then(data=>{state.pieces=data.pieces||[];render();}).catch(error=>{console.error(error);archiveGrid.innerHTML='<p>The archive is resting for a moment. Please return soon.</p>';workshopGrid.innerHTML='<p>Workshop updates are temporarily unavailable.</p>';});