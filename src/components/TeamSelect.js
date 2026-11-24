// TeamSelect: substitui o prompt de escolhaTime() na versão web.
window.UI = window.UI || {};

UI.TeamSelect = class TeamSelect {
  constructor(elemento, participantes, aoEscolher, aoPedirInfo) {
    this.elemento = elemento;
    const ordenados = participantes.slice().sort((a, b) =>
      Mascotes.rotulo(a.nome).localeCompare(Mascotes.rotulo(b.nome), "pt-BR"));

    ordenados.forEach((time) => {
      const rotulo = Mascotes.rotulo(time.nome);
      const carta = document.createElement("div");
      carta.className = "carta";
      carta.innerHTML = `
        <button type="button" class="carta-time" aria-label="Jogar com ${rotulo}, mascote ${time.mascote}, ataque ${time.atk}, vida ${time.vida}">
          <canvas width="32" height="32" aria-hidden="true"></canvas>
          <strong>${rotulo}</strong>
          <span class="carta-mascote">${time.mascote}</span>
          <span class="carta-atributos"><span>ATK <b>${time.atk}</b></span><span>HP <b>${time.vida}</b></span></span>
        </button>
        <button type="button" class="carta-info" aria-label="Ver informações de ${rotulo}" title="Ver informações">i</button>`;
      Mascotes.desenhar(carta.querySelector("canvas").getContext("2d"), time.nome);
      carta.querySelector(".carta-time").addEventListener("click", () => aoEscolher(time));
      carta.querySelector(".carta-info").addEventListener("click", () => aoPedirInfo(time));
      elemento.appendChild(carta);
    });
  }
};
