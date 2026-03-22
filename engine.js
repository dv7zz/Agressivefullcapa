// engine.js - Configuração Auxílio no Talo (Sticky Aim)
export class SensitivityEngine {
  constructor() {
    // Trava de pixel agressiva para o "capa" não passar
    this.clampValue = 35;
    this.lastVelocity = { x: 0, y: 0 };
    // Filtro pesado para estabilidade total do iPhone 14
    this.filterWeight = 0.60;
    this.sensitivityScale = 1.9;
  }
  
  // Curva de Atração: Aumenta a precisão no final do arraste
  getStickyWeight(t) {
    // Esta fórmula cria um "imã" no topo do movimento
    return Math.sin(t * Math.PI / 2);
  }
  
  apply(dx, dy) {
    const filteredX = dx * this.filterWeight + this.lastVelocity.x * (1 - this.filterWeight);
    const filteredY = dy * this.filterWeight + this.lastVelocity.y * (1 - this.filterWeight);
    
    const magnitude = Math.sqrt(filteredX ** 2 + filteredY ** 2);
    
    // Aplica o peso de Sticky Aim (Magnetismo de Capa)
    let multiplier = this.getStickyWeight(Math.min(magnitude / this.clampValue, 1));
    
    let finalX = filteredX * multiplier * this.sensitivityScale;
    let finalY = filteredY * multiplier * this.sensitivityScale;
    
    // Trava Final: Se tentar subir muito rápido, a engine "segura" a mira
    if (magnitude > this.clampValue) {
      const scale = this.clampValue / magnitude;
      finalX *= scale;
      finalY *= scale;
    }
    
    this.lastVelocity = { x: finalX, y: finalY };
    return { x: finalX, y: finalY };
  }
}