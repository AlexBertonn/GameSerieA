// StandingsTable: mostra a classificação produzida por tabelaFinal().
window.UI = window.UI || {};

UI.StandingsTable = class StandingsTable {
  constructor(elemento, aoReiniciar) {
    this.elemento = elemento;
    this.aoReiniciar = aoReiniciar;
  }

  mostrar(tabela, jogador, historico) {
    const posicao = tabela.indexOf(jogador) + 1;
    const vitorias = historico.filter((b) => b.vencedor === jogador.nome).length;
    const titulo = posicao === 1 ? "Campeão!" : `Você terminou em ${posicao}º`;

    const linhas = tabela.map((time, i) => `
      <tr class="${time === jogador ? "linha-jogador" : ""}">
        <td>${i + 1}</td>
        <td class="celula-time"><canvas width="32" height="32" data-time="${time.nome}" aria-hidden="true"></canvas><span>${Mascotes.rotulo(time.nome)}</span></td>
        <td>${time.pontos}</td>
      </tr>`).join("");

    this.elemento.innerHTML = `
      <header class="tabela-topo">
        <canvas class="tabela-mascote" width="32" height="32" role="img" aria-label="Mascote ${jogador.mascote}"></canvas>
        <div>
          <h2 id="titulo-tabela">${titulo}</h2>
          <p>${Mascotes.rotulo(jogador.nome)} · ${vitorias} vitórias · ${historico.length - vitorias} derrotas · ${jogador.pontos} pontos</p>
        </div>
      </header>
      <div class="tabela-rolagem" tabindex="0">
        <table>
          <thead><tr><th scope="col">#</th><th scope="col">Time</th><th scope="col">Pts</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
      <button type="button" class="botao botao-reiniciar">Jogar novamente</button>`;

    this.elemento.querySelectorAll("canvas[data-time]").forEach((tela) => {
      Mascotes.desenhar(tela.getContext("2d"), tela.dataset.time);
    });
    const destaque = this.elemento.querySelector(".tabela-mascote");
    Mascotes.desenhar(destaque.getContext("2d"), jogador.nome, posicao <= 10 ? "vitoria" : "derrota");
    this.elemento.querySelector(".botao-reiniciar").addEventListener("click", this.aoReiniciar);
  }
};
