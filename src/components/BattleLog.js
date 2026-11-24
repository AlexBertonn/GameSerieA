// BattleLog: caixa de mensagens do combate.
window.UI = window.UI || {};

UI.BattleLog = class BattleLog {
  constructor(elemento) {
    this.elemento = elemento;
  }

  limpar() {
    this.elemento.replaceChildren();
  }

  escrever(texto, tipo = "") {
    this.elemento.querySelector(".atual")?.classList.remove("atual");
    const linha = document.createElement("p");
    linha.className = `linha atual ${tipo}`;
    linha.textContent = texto;
    this.elemento.appendChild(linha);
    this.elemento.scrollTop = this.elemento.scrollHeight;
  }
};
