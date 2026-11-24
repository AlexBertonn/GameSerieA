// PlayerCharacter e EnemyCharacter: representam jogador e adversario na arena.
window.UI = window.UI || {};

UI.movimentoReduzido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
UI.esperar = (ms) => new Promise((resolve) => setTimeout(resolve, UI.movimentoReduzido() ? Math.min(ms, 180) : ms));

class Character {
  constructor(elemento) {
    this.elemento = elemento;
    this.tela = elemento.querySelector("canvas");
    this.ctx = this.tela.getContext("2d");
    this.pose = "parado";
    this.quadro = 0;
    setInterval(() => this.animar(), 420);
  }

  definir(time) {
    this.nome = time.nome;
    this.elemento.style.setProperty("--escala", Mascotes.escala(time.nome));
    this.tela.setAttribute("aria-label", `Mascote ${time.mascote}`);
    this.mudarPose("parado");
  }

  animar() {
    if (!this.nome || UI.movimentoReduzido()) return;
    if (this.pose === "parado" || this.pose === "vitoria") {
      this.quadro = this.quadro ? 0 : 1;
      this.desenhar();
    }
  }

  desenhar() {
    Mascotes.desenhar(this.ctx, this.nome, this.pose, this.quadro);
  }

  mudarPose(pose, quadro = 0) {
    this.pose = pose;
    this.quadro = quadro;
    this.elemento.classList.remove("anima-ataque", "anima-dano", "anima-vitoria", "anima-derrota");
    this.desenhar();
  }

  async atacar() {
    this.mudarPose("ataque", 0);
    await UI.esperar(170);
    this.mudarPose("ataque", 1);
    this.elemento.classList.add("anima-ataque");
    await UI.esperar(360);
    this.mudarPose("parado");
  }

  async sofrerDano() {
    this.mudarPose("dano");
    this.elemento.classList.add("anima-dano");
    await UI.esperar(480);
    this.mudarPose("parado");
  }

  vencer() {
    this.mudarPose("vitoria");
    this.elemento.classList.add("anima-vitoria");
  }

  perder() {
    this.mudarPose("derrota");
    this.elemento.classList.add("anima-derrota");
  }
}

UI.PlayerCharacter = class PlayerCharacter extends Character {};
UI.EnemyCharacter = class EnemyCharacter extends Character {};
