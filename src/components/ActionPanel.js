// ActionPanel: comando disponível para o jogador em cada momento da batalha.
window.UI = window.UI || {};

UI.ActionPanel = class ActionPanel {
  constructor(elemento, aoClicar) {
    elemento.innerHTML = `<button type="button" class="botao botao-acao"></button>`;
    this.botao = elemento.querySelector("button");
    this.acao = null;
    this.botao.addEventListener("click", () => {
      if (this.acao) aoClicar(this.acao);
    });
  }

  // Ação habilitada: "rolar", "proxima" ou "tabela".
  habilitar(acao, texto) {
    this.acao = acao;
    this.botao.textContent = texto;
    this.botao.disabled = false;
    this.botao.dataset.acao = acao;
    if (matchMedia("(hover: hover)").matches) this.botao.focus({ preventScroll: true });
  }

  bloquear(texto) {
    this.acao = null;
    this.botao.textContent = texto;
    this.botao.disabled = true;
    delete this.botao.dataset.acao;
  }
};
