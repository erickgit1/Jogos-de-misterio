const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let bump=false,selectedCases=[false,false],sample=0,offerReviewed=false;
const samples=[['capa','O dossiê','O ponto de partida da investigação.'],['suspeitos','Os suspeitos','Quatro pessoas. Quatro versões da mesma noite.'],['planta','A planta da rádio','Reconstrua os caminhos de cada personagem.'],['acusacao','Sua acusação','Reúna as provas antes de abrir a solução.']];
const money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function totals(){
 const factor=1;
 $$('.bump-row').forEach(e=>e.hidden=!bump);
 $('#case-018-row').hidden=!selectedCases[0];
 $('#case-019-row').hidden=!selectedCases[1];
 $('#checkout-total').textContent=money(factor*(29.90+(bump?9.99:0))+selectedCases.filter(Boolean).length*11.99);
 if($('#upsell-modal').open)previewExtras();
 $$('[data-price]').forEach(e=>e.textContent=money(Number(e.dataset.price)*factor));
 $('.bump').classList.toggle('selected',bump);

}
totals();
$('#bump').addEventListener('change',e=>{bump=e.target.checked;totals()});
const upsellModal=$('#upsell-modal');
const caseInputs=[$('#case-018'),$('#case-019')];
function previewExtras(){
 const extra=caseInputs.filter(input=>input.checked).length*11.99;
 $('#extras-total').textContent=money(extra);
 $('#offer-order-total').textContent=money((29.90+(bump?9.99:0))+extra);
 caseInputs.forEach(input=>input.closest('article').classList.toggle('chosen',input.checked));
}
function finishOffer(apply){
 if(apply)selectedCases=caseInputs.map(input=>input.checked);
 offerReviewed=true;totals();upsellModal.close();
 $('#payment-ready').hidden=false;
 $('#continue-payment').textContent='Rever seleção antes do pagamento';
 $('#payment-ready').focus({preventScroll:true});
 $('#payment-ready').scrollIntoView({behavior:'smooth',block:'center'});
}
$('#continue-payment').addEventListener('click',()=>{
 caseInputs.forEach((input,index)=>input.checked=selectedCases[index]);
 previewExtras();upsellModal.showModal();$('#decline-upsell').focus();
});
caseInputs.forEach(input=>input.addEventListener('change',previewExtras));
$('#accept-upsell').addEventListener('click',()=>finishOffer(true));
$('#decline-upsell').addEventListener('click',()=>finishOffer(false));
$('#close-upsell').addEventListener('click',()=>upsellModal.close());
upsellModal.addEventListener('click',e=>{if(e.target===upsellModal){const r=upsellModal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)upsellModal.close();}});
$$('[data-remove-case]').forEach(button=>button.addEventListener('click',()=>{
 selectedCases[Number(button.dataset.removeCase)]=false;totals();
 $('#continue-payment').focus({preventScroll:true});
}));
$$('[data-sample]').forEach(el=>el.addEventListener('click',()=>{sample=Number(el.dataset.sample);const s=samples[sample];$('#sample-img').src='images/'+s[0]+'.png';$('#sample-img').alt=s[1]+'; página real do PDF';$('#sample-caption').textContent=s[2];$$('[data-sample]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)))}));
const modal=$('#modal');$('#zoom').addEventListener('click',()=>{const s=samples[sample];modal.classList.add('sample-modal');$('#modal-content').innerHTML='<h2>'+s[1]+'</h2><img src="images/'+s[0]+'.png" alt="Amostra ampliada: '+s[1]+'">';modal.showModal()});
const texts={legal:['Antes do lançamento','O produto principal está em revisão. Os preços exibidos são fixos; a cobrança ainda depende da integração. Antes de abrir vendas, serão definidos o fornecedor responsável, contato de suporte, condições de compra, política de reembolso, tributos, meio de pagamento e entrega automática.'],privacy:['Privacidade nesta prévia','Esta prévia não solicita dados pessoais ou de pagamento. As opções do carrinho ficam apenas na memória da página. Não há cronômetro alterando os preços. Esses dados não são enviados por este site. A hospedagem pode manter registros técnicos de acesso. A política final será definida conforme a plataforma de checkout escolhida.']};
$$('[data-modal]').forEach(b=>b.addEventListener('click',()=>{const t=texts[b.dataset.modal];modal.classList.remove('sample-modal');$('#modal-content').innerHTML='<h2>'+t[0]+'</h2><p>'+t[1]+'</p>';modal.showModal()}));$('#close-modal').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
