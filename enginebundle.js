// enginebundle.js - Injeção Raw Input
import { SensitivityEngine } from './engine.js';

const sensi = new SensitivityEngine();
let active = false;
let lastP = { x: 0, y: 0 };

const handleInput = (e) => {
  if (!active) return;
  const t = e.touches[0];
  
  // Captura o movimento bruto
  const dx = t.clientX - lastP.x;
  const dy = t.clientY - lastP.y;
  
  // Processa o Auxílio no Talo
  const out = sensi.apply(dx, dy);
  
  // Envia para o sistema visual do PWA
  window.dispatchEvent(new CustomEvent('aim_locked', { detail: out }));
  
  lastP = { x: t.clientX, y: t.clientY };
  if (e.cancelable) e.preventDefault();
};

window.addEventListener('touchstart', (e) => {
  active = true;
  lastP = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });

window.addEventListener('touchmove', handleInput, { passive: false });
window.addEventListener('touchend', () => active = false);