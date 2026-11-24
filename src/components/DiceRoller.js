// DiceRoller: mostra o dado de 1 a 10. O valor real vem de executarTurno().
window.UI = window.UI || {};

UI.DiceRoller = class DiceRoller {
  static NOMES = { erro: "Na trave", fraco: "Fraco", normal: "Normal", forte: "Forte", critico: "Crítico" };

  constructor(elemento) {
    const faixa = (n) => (n <= 1 ? "erro" : n <= 4 ? "fraco" : n <= 7 ? "normal" : n <= 9 ? "forte" : "critico");
    const casas = Array.from({ length: 10 }, (_, i) =>
      `<span class="casa casa-${faixa(i + 1)}" data-valor="${i + 1}">${i + 1}</span>`).join("");

    elemento.innerHTML = `
      <div class="dado-area">
        <div class="dado" aria-hidden="true"><span class="dado-numero">?</span></div>
        <p class="dado-resultado" aria-live="polite">Sua sorte</p>
      </div>
      <div class="regua" aria-hidden="true">${casas}</div>`;
    this.dado = elemento.querySelector(".dado");
    this.numero = elemento.querySelector(".dado-numero");
    this.resultado = elemento.querySelector(".dado-resultado");
    this.casas = [...elemento.querySelectorAll(".casa")];
  }

  limpar() {
    this.numero.textContent = "?";
    this.dado.className = "dado";
    this.resultado.textContent = "Sua sorte";
    this.resultado.className = "dado-resultado";
    this.casas.forEach((casa) => casa.classList.remove("marcada"));
  }

  async rolar(turno) {
    this.limpar();
    this.resultado.textContent = "Rolando...";
    this.dado.classList.add("rolando");
    const passos = UI.movimentoReduzido() ? 1 : 11;
    for (let i = 0; i < passos; i++) {
      this.numero.textContent = 1 + Math.floor(Math.random() * 10);
      await UI.esperar(55 + i * 6);
    }
    this.dado.classList.remove("rolando");
    this.numero.textContent = turno.dado;
    this.dado.classList.add("parou", `dado-${turno.tipo}`);
    this.casas[turno.dado - 1].classList.add("marcada");
    this.resultado.textContent = turno.dano === 0
      ? `${DiceRoller.NOMES.erro} · sem dano`
      : `${DiceRoller.NOMES[turno.tipo]} · ${turno.dano} de dano`;
    this.resultado.classList.add(`texto-${turno.tipo}`);
    await UI.esperar(520);
  }
};
const DiceRoller = UI.DiceRoller;
