// PlayerStatus e EnemyStatus: mostram nome, mascote, vida, ataque e pontos.
window.UI = window.UI || {};

class StatusPanel {
  constructor(elemento, papel) {
    this.elemento = elemento;
    elemento.innerHTML = `
      <div class="status-topo">
        <strong class="status-nome"></strong>
        <span class="status-papel">${papel}</span>
      </div>
      <span class="status-mascote"></span>
      <div class="vida" role="progressbar" aria-valuemin="0">
        <span class="vida-rotulo">HP</span>
        <span class="vida-trilho"><span class="vida-barra"></span></span>
      </div>
      <div class="status-numeros">
        <span class="vida-texto"></span>
        <span>ATK <b class="status-atk"></b></span>
        <span>PTS <b class="status-pontos"></b></span>
      </div>`;
    this.textoPapel = papel;
    this.papel = elemento.querySelector(".status-papel");
    this.vida = elemento.querySelector(".vida");
    this.barra = elemento.querySelector(".vida-barra");
    this.vidaTexto = elemento.querySelector(".vida-texto");
    this.pontos = elemento.querySelector(".status-pontos");
  }

  definir(time) {
    this.time = time;
    this.elemento.querySelector(".status-nome").textContent = Mascotes.rotulo(time.nome);
    this.elemento.querySelector(".status-mascote").textContent = time.mascote;
    this.elemento.querySelector(".status-atk").textContent = time.atk;
    this.vida.setAttribute("aria-valuemax", time.vida);
    this.vida.setAttribute("aria-label", `Vida de ${time.mascote}`);
    this.atualizar(time.vida);
  }

  // A lógica pode terminar com vida negativa; na tela o mínimo é 0.
  atualizar(vidaAtual) {
    const vida = Math.max(0, vidaAtual);
    const proporcao = vida / this.time.vida;
    this.barra.style.width = `${proporcao * 100}%`;
    this.barra.dataset.nivel = proporcao > 0.5 ? "alta" : proporcao > 0.22 ? "media" : "baixa";
    this.vida.setAttribute("aria-valuenow", vida);
    this.vidaTexto.innerHTML = `<b>${vida}</b>/${this.time.vida}`;
    this.pontos.textContent = this.time.pontos;

    // Mesmo limite usado por calcularDano() no jogo.js.
    const camisa = vida > 0 && proporcao <= SerieABattle.LIMITE_CAMISA;
    this.papel.textContent = camisa ? "Camisa pesada" : this.textoPapel;
    this.papel.classList.toggle("camisa-ativa", camisa);
  }

  marcarVez(ativo) {
    this.elemento.classList.toggle("na-vez", ativo);
  }
}

UI.PlayerStatus = class PlayerStatus extends StatusPanel {
  constructor(elemento) { super(elemento, "Você"); }
};
UI.EnemyStatus = class EnemyStatus extends StatusPanel {
  constructor(elemento) { super(elemento, "Rival"); }
};
