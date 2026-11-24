// TeamInfo: janela do botão "i", com os dados que formam os atributos do time.
window.UI = window.UI || {};

UI.TeamInfo = class TeamInfo {
  constructor(janela, aoEscolher) {
    this.janela = janela;
    this.aoEscolher = aoEscolher;
    janela.addEventListener("click", (evento) => {
      if (evento.target === janela || evento.target.closest(".janela-fechar")) janela.close();
      if (evento.target.closest(".info-jogar")) {
        janela.close();
        this.aoEscolher(this.time);
      }
    });
  }

  // Perfil calculado pelas próprias notas do time.
  perfil(time) {
    if (time.trajetoria >= 85) return "Time de decisão";
    if (time.historia >= 75 && time.fase >= 65) return "Gigante em alta";
    if (time.historia >= 75 && time.fase < 50) return "Gigante em má fase";
    if (time.historia >= 75) return "Gigante em reconstrução";
    if (time.historia < 50 && time.fase >= 45) return "Surpresa da temporada";
    if (time.historia < 50) return "Azarão";
    return "Time competitivo";
  }

  medidor(nome, valor, descricao) {
    return `
      <div class="medidor">
        <div class="medidor-topo"><span>${nome}</span><b>${valor}</b></div>
        <span class="medidor-trilho"><span style="width:${valor}%"></span></span>
        <p>${descricao}</p>
      </div>`;
  }

  golpes(time) {
    const nomes = { erro: "Na trave", fraco: "Fraco", normal: "Normal", forte: "Forte", critico: "Crítico" };
    let inicio = 1;
    return SerieABattle.FAIXAS_DANO.map((faixa) => {
      const dado = inicio === faixa.ate ? `${inicio}` : `${inicio}-${faixa.ate}`;
      inicio = faixa.ate + 1;
      return `<li class="golpe-${faixa.tipo}"><span>${dado}</span><b>${nomes[faixa.tipo]}</b><em>${Math.round(time.atk * faixa.multiplicador)}</em></li>`;
    }).join("");
  }

  abrir(time) {
    this.time = time;
    const rotulo = Mascotes.rotulo(time.nome);
    const c = time.campanha;
    const saldo = c.golsPro - c.golsContra;
    const t = time.titulos;
    const outros = t.sulAmericana + t.recopa + t.supercopa + t.conmebol + t.mercosul;
    const limite = Math.floor(time.vida * SerieABattle.LIMITE_CAMISA);
    const bonus = Math.round(SerieABattle.bonusCamisa(time) * 100);

    this.janela.innerHTML = `
      <header class="info-topo">
        <canvas width="32" height="32" aria-hidden="true"></canvas>
        <div class="info-titulo">
          <span class="info-perfil">${this.perfil(time)}</span>
          <h2 id="info-nome">${rotulo}</h2>
          <p>${time.mascote} · ${Cenarios.daCasa(time.nome).nome}</p>
        </div>
        <button type="button" class="janela-fechar" aria-label="Fechar informações">X</button>
      </header>

      <div class="info-corpo" tabindex="0">
        <section class="info-atributos" aria-label="Atributos">
          <div><span>ATK</span><b>${time.atk}</b></div>
          <div><span>HP</span><b>${time.vida}</b></div>
          <div><span>Camisa</span><b>+${bonus}%</b></div>
        </section>

        <section class="info-bloco">
          <h3>O que forma este time</h3>
          ${this.medidor("História", time.historia, "Títulos e legado do clube. É o que mais pesa no ATK e define a camisa.")}
          ${this.medidor("Trajetória", time.trajetoria, "Longevidade e finais recentes. Aumenta o HP.")}
          ${this.medidor("Fase atual", time.fase, "Campanha no Brasileirão. Influencia ATK e HP.")}
        </section>

        <section class="info-bloco info-camisa">
          <h3>Camisa pesada</h3>
          <p>Com <b>${limite} de HP ou menos</b>, ${time.mascote} reage e causa <b>+${bonus}% de dano</b> em cada golpe.</p>
        </section>

        <section class="info-bloco">
          <h3>Dano por resultado do dado</h3>
          <ul class="info-golpes">${this.golpes(time)}</ul>
        </section>

        <section class="info-bloco">
          <h3>Títulos</h3>
          <dl class="info-campanha">
            <div><dt>Mundial</dt><dd>${t.mundial}</dd></div>
            <div><dt>Liberta</dt><dd>${t.libertadores}</dd></div>
            <div><dt>Série A</dt><dd>${t.brasileirao}</dd></div>
            <div><dt>Copa BR</dt><dd>${t.copaDoBrasil}</dd></div>
          </dl>
          <p class="info-nota">Outros títulos continentais: ${outros}.</p>
        </section>

        <section class="info-bloco">
          <h3>Brasileirão 2026</h3>
          <dl class="info-campanha">
            <div><dt>Posição</dt><dd>${c.posicao}º</dd></div>
            <div><dt>Pontos</dt><dd>${c.pontos}</dd></div>
            <div><dt>Jogos</dt><dd>${c.jogos}</dd></div>
            <div><dt>Saldo</dt><dd>${saldo > 0 ? "+" : ""}${saldo}</dd></div>
          </dl>
          <p class="info-nota">Dados até a 36ª rodada. História e trajetória são notas do jogo.</p>
        </section>
      </div>

      <footer class="info-rodape">
        <button type="button" class="botao info-jogar">Jogar com ${rotulo}</button>
      </footer>`;

    Mascotes.desenhar(this.janela.querySelector("canvas").getContext("2d"), time.nome);
    this.janela.showModal();
    this.janela.querySelector(".info-corpo").scrollTop = 0;
  }
};
