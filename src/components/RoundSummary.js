// RoundSummary: tabela ao fim de cada partida, usando o resumo de registrarPartida().
window.UI = window.UI || {};

UI.RoundSummary = class RoundSummary {
  constructor(janela, aoContinuar) {
    this.janela = janela;
    this.aoContinuar = aoContinuar;
    // A janela só fecha pelo botão, para o campeonato sempre continuar.
    janela.addEventListener("cancel", (evento) => evento.preventDefault());
    janela.addEventListener("click", (evento) => {
      if (!evento.target.closest(".rodada-continuar")) return;
      janela.close();
      this.aoContinuar();
    });
  }

  movimento(linha) {
    const v = linha.variacao;
    if (v === null) return { classe: "manteve", titulo: `Estreia em ${linha.posicao}º` };
    const casas = Math.abs(v) === 1 ? "posição" : "posições";
    if (v > 0) return { classe: "subiu", titulo: `Subiu ${v} ${casas}` };
    if (v < 0) return { classe: "desceu", titulo: `Caiu ${-v} ${casas}` };
    return { classe: "manteve", titulo: "Manteve a posição" };
  }

  seta(v) {
    if (v === null || v === 0) return `<span class="seta seta-igual" aria-label="Sem mudança">–</span>`;
    return v > 0
      ? `<span class="seta seta-sobe" aria-label="Subiu ${v}">▲${v}</span>`
      : `<span class="seta seta-desce" aria-label="Caiu ${-v}">▼${-v}</span>`;
  }

  blocoProximo(resumo, jogador) {
    const proximo = resumo.proximo;
    if (!proximo) {
      return `
        <h3>Fim do campeonato</h3>
        <p class="rodada-fim">Você terminou a última rodada em ${resumo.linhaJogador.posicao}º.</p>
        <button type="button" class="botao botao-verde rodada-continuar">Ver classificação final</button>`;
    }
    const mandante = UI.mandante(resumo.rodada + 1, jogador, proximo);
    return `
      <h3>Próximo desafiante</h3>
      <div class="desafiante">
        <canvas width="32" height="32" data-time="${proximo.nome}" aria-hidden="true"></canvas>
        <div>
          <strong>${Mascotes.rotulo(proximo.nome)}</strong>
          <span class="desafiante-mascote">${proximo.mascote}</span>
          <span>ATK <b>${proximo.atk}</b> · HP <b>${proximo.vida}</b></span>
          <span>${Cenarios.daCasa(mandante.nome).nome}</span>
        </div>
      </div>
      <button type="button" class="botao botao-verde rodada-continuar">Enfrentar ${proximo.mascote}</button>`;
  }

  mostrar(resumo, jogador) {
    const linhaJ = resumo.linhaJogador;
    const mov = this.movimento(linhaJ);
    const saldo = (n) => (n > 0 ? `+${n}` : `${n}`);

    const linhas = resumo.tabela.map((l) => `
      <tr class="${l.time === jogador ? "linha-jogador" : ""}">
        <td>${l.posicao}</td>
        <td>${this.seta(l.variacao)}</td>
        <td class="celula-time"><canvas width="32" height="32" data-time="${l.time.nome}" aria-hidden="true"></canvas><span>${Mascotes.rotulo(l.time.nome)}</span></td>
        <td>${l.vitorias}</td>
        <td class="col-opcional">${l.derrotas}</td>
        <td class="col-opcional">${saldo(l.saldo)}</td>
        <td><b>${l.pontos}</b></td>
      </tr>`).join("");

    this.janela.innerHTML = `
      <section class="rodada-mov mov-${mov.classe}">
        <span class="rodada-num">Rodada ${resumo.rodada} de ${resumo.totalRodadas}</span>
        <h2 id="rodada-titulo">${mov.titulo}</h2>
        <p><b>${linhaJ.posicao}º lugar</b> · ${linhaJ.pontos} pontos</p>
      </section>
      <section class="rodada-tabela" tabindex="0" aria-label="Classificação da rodada">
        <table>
          <thead><tr>
            <th scope="col">#</th>
            <th scope="col"><span class="sr">Variação</span>±</th>
            <th scope="col">Time</th>
            <th scope="col" title="Vitórias">V</th>
            <th scope="col" class="col-opcional" title="Derrotas">D</th>
            <th scope="col" class="col-opcional" title="Saldo de vida, critério de desempate">SV</th>
            <th scope="col">Pts</th>
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </section>
      <section class="rodada-prox">${this.blocoProximo(resumo, jogador)}</section>`;

    this.janela.querySelectorAll("canvas[data-time]").forEach((tela) => {
      Mascotes.desenhar(tela.getContext("2d"), tela.dataset.time);
    });
    this.janela.showModal();

    // Mostra a linha do jogador sem precisar rolar a tabela.
    const area = this.janela.querySelector(".rodada-tabela");
    const linha = area.querySelector(".linha-jogador");
    area.scrollTop = linha.offsetTop - area.clientHeight / 2 + linha.offsetHeight / 2;
    this.janela.querySelector(".rodada-continuar").focus({ preventScroll: true });
  }
};
