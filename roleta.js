// Substitua somente esta URL pelo checkout definitivo dos dois casos.
const checkoutDoisCasos = 'https://pay.kiwify.com.br/8L6KHYg';
const oferta = document.querySelector('#roleta-oferta');
const etapaGiro = oferta.querySelector('.etapa-giro');
const premio = oferta.querySelector('.resultado');
const girar = oferta.querySelector('.girar');
const combo = oferta.querySelector('.combo');
const relogio = oferta.querySelector('time');
const chavePrazo = 'arquivo-caso020-oferta-ate';
let prazo = 0;
try { prazo = Number(sessionStorage.getItem(chavePrazo)) || 0; } catch {}
let giro, intervalo;
function atualizarTempo() {
  const s = Math.max(0, Math.ceil((prazo - Date.now()) / 1000));
  relogio.textContent = String(Math.floor(s / 60)).padStart(2,'0') + ':' + String(s % 60).padStart(2,'0');
  if (!s) {
    clearInterval(intervalo);
    combo.hidden = true;
    oferta.querySelector('.prazo-label').textContent = 'Oferta encerrada';
  }
}
function revelar(celebrar) {
  etapaGiro.hidden = true;
  premio.hidden = false;
  oferta.setAttribute('aria-labelledby','titulo-fita');
  premio.querySelector('h2').focus();
  clearInterval(intervalo);
  intervalo = setInterval(atualizarTempo, 250);
  atualizarTempo();
  if (celebrar && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const festa = oferta.querySelector('.confetes');
    for (let i=0;i<30;i++) {
      const p = document.createElement('i');
      p.style.cssText = 'left:'+Math.random()*100+'%;background:'+['#56d89c','#f7cc73','#fff5d6'][i%3]+';animation-delay:'+Math.random()*.35+'s';
      festa.append(p);
    }
  }
}
combo.href = checkoutDoisCasos;
document.querySelectorAll('[data-checkout="kiwify"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    oferta.querySelector('.pular').href = link.href;
    oferta.showModal();
    if (prazo) revelar(false); else girar.focus();
  });
});
girar.onclick = () => {
  girar.disabled = true;
  girar.textContent = 'Girando…';
  oferta.querySelector('.disco').classList.add('rodando');
  giro = setTimeout(() => {
    prazo = Date.now() + 300000;
    try { sessionStorage.setItem(chavePrazo,String(prazo)); } catch {}
    revelar(true);
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 2500);
};
combo.addEventListener('click', e => { if (Date.now() >= prazo) {e.preventDefault(); atualizarTempo();} });
oferta.addEventListener('close', () => {
  clearTimeout(giro); clearInterval(intervalo);
  oferta.querySelector('.confetes').replaceChildren();
  if (!prazo) {
    girar.disabled = false; girar.textContent = 'Girar a roleta';
    oferta.querySelector('.disco').classList.remove('rodando');
  }
});
