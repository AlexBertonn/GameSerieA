// BattleScene: desenha o cenário e mostra efeitos na arena.
window.UI = window.UI || {};

// Mando apenas visual: partidas ímpares na casa do jogador, pares na do rival.
UI.mandante = (numero, jogador, adversario) => (numero % 2 === 1 ? jogador : adversario);

UI.BattleScene = class BattleScene {
  constructor(arena) {
    this.arena = arena;
    this.fundo = arena.querySelector("#cenario-fundo");
    this.frente = arena.querySelector("#cenario-frente");
    this.faixa = arena.querySelector("#faixa");
    this.cenario = Cenarios[Cenarios.padrao];
    this.observador = new ResizeObserver(() => this.redesenhar());
    this.observador.observe(arena);
  }

  // A arena da partida é o estádio do time mandante.
  usarEstadio(mandante) {
    this.cenario = Cenarios.daCasa(mandante.nome);
    this.redesenhar(true);
    return this.cenario.nome;
  }

  redesenhar(forcar = false) {
    const { width, height } = this.arena.getBoundingClientRect();
    if (!width || !height) return;
    const altura = 180;
    const largura = Math.max(120, Math.round((altura * width) / height));
    if (!forcar && this.fundo.width === largura && this.fundo.height === altura) return;
    [this.fundo, this.frente].forEach((tela) => {
      tela.width = largura;
      tela.height = altura;
    });
    this.cenario.fundo(this.fundo.getContext("2d"), largura, altura);
    this.cenario.frente(this.frente.getContext("2d"), largura, altura);
  }

  mostrarFaixa(texto, tipo = "") {
    this.faixa.textContent = texto;
    this.faixa.className = `faixa ${tipo}`;
    this.faixa.hidden = false;
  }

  esconderFaixa() {
    this.faixa.hidden = true;
  }

  mostrarDano(lutador, valor, tipo) {
    const numero = document.createElement("span");
    numero.className = `numero-dano dano-${tipo}`;
    numero.textContent = `-${valor}`;
    numero.setAttribute("aria-hidden", "true");
    lutador.appendChild(numero);
    numero.addEventListener("animationend", () => numero.remove());
    setTimeout(() => numero.remove(), 1400);
  }
};
