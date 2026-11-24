// Registro visual dos mascotes. A chave é o campo "nome" de cada time no jogo.js.
// Para trocar um mascote, altere a paleta ou a função "cabeca" da entrada dele.
window.Mascotes = (() => {
  const { Grade, TINTA } = window.Pixel;
  const BRANCO = "#fff3d1";
  const PELE = "#f2b98a";
  const PELE_MORENA = "#a8683f";
  const OURO = "#ffb93b";

  function olhos(g, y, pose, xE = 11, xD = 18) {
    [xE, xD].forEach((x) => {
      if (pose === "dano") {
        g.ponto(x, y, TINTA); g.ponto(x + 2, y, TINTA); g.ponto(x + 1, y + 1, TINTA);
        g.ponto(x, y + 2, TINTA); g.ponto(x + 2, y + 2, TINTA);
      } else if (pose === "vitoria") {
        g.ponto(x, y + 2, TINTA); g.ret(x + 1, y + 1, 1, 1, TINTA); g.ponto(x + 2, y + 2, TINTA);
      } else if (pose === "derrota") {
        g.ret(x, y + 2, 3, 1, TINTA);
      } else {
        // Olhar bravo: sobrancelhas descem em direção ao centro do rosto.
        const interno = x === xE;
        g.ret(x, y, 3, 4, BRANCO);
        g.ret(x + 1, y + 2, 2, 2, pose === "ataque" ? "#d8263c" : TINTA);
        for (let i = 0; i < 3; i++) {
          g.ret(interno ? x + i : x + 2 - i, y + i - 1, 1, 2, TINTA);
        }
      }
    });
  }

  // porte: 0 franzino, 1 atlético, 2 forte, 3 brutamontes.
  function corpo(g, p, pose, f, opcoes = {}, porte = 1) {
    const caido = pose === "derrota" ? 2 : 0;
    const meia = 5 + porte;
    const xT = 16 - meia;
    const grossura = 2 + porte;
    const xB = xT - grossura;
    const xD = 16 + meia;

    if (opcoes.umaPerna) {
      g.ret(13 - porte, 28, 6 + porte * 2, 2, p.pe);
      g.ret(14 - porte, 26, 4 + porte * 2, 2, p.perna || p.corpo);
    } else {
      g.par(xT, 28, 4 + porte, 2, p.pe);
      g.par(xT + 1, 26, 2 + porte, 2, p.perna || p.corpo);
    }
    g.par(xT, 19 + caido, meia, 8 - caido, p.corpo);
    g.par(xT + 2, 21 + caido, meia - 2, 5 - caido, p.barriga);

    const braco = p.braco || p.corpo;
    const mao = p.mao || braco;
    if (porte >= 2) {
      const linha = Pixel.misturar(p.barriga, TINTA, 0.42);
      g.par(xB, 18 + caido, grossura + 2, 3, braco);
      g.par(xT + 2, 23 + caido, meia - 2, 1, linha);
      g.par(15, 21 + caido, 1, 5 - caido, linha);
      if (porte === 3) g.par(xT + 3, 25, meia - 3, 1, linha);
    }

    if (pose === "ataque" && f === 0) {
      g.ret(xB, 21, grossura, 4, braco); g.ret(xB, 25, grossura, 2, mao);
      g.ret(xD, 13, grossura, 8, braco); g.ret(xD, 11, grossura, 2, mao);
    } else if (pose === "ataque") {
      g.ret(xB, 21, grossura, 4, braco); g.ret(xB, 25, grossura, 2, mao);
      g.ret(xD, 20, 28 - xD, 2 + porte, braco); g.ret(28, 19, 3, 4 + porte, mao);
    } else if (pose === "dano") {
      g.par(xB - 1, 18, grossura + 1, 3, braco); g.par(Math.max(0, xB - 3), 17, 2, 3, mao);
    } else if (pose === "vitoria") {
      g.par(xB, 12 + f, grossura, 9, braco); g.par(xB, 10 + f, grossura, 2, mao);
    } else if (pose === "derrota") {
      g.par(xB, 24, grossura, 3, braco); g.par(xB, 27, grossura, 1, mao);
    } else {
      g.par(xB, 20 + f, grossura, 5, braco); g.par(xB, 25 + f, grossura, 2, mao);
    }
  }

  // Boca brava: "presas" para animais e "carranca" para personagens.
  const BOCAS = {
    "athletico paranaense": ["presas", 15],
    cruzeiro: ["presas", 19],
    mirassol: ["presas", 18],
    remo: ["presas", 18],
    "vitória": ["presas", 18],
    palmeiras: ["presas", 19],
    "red bull bragantino": ["presas", 18],
    santos: ["presas", 16],
    botafogo: ["carranca", 17],
    chapecoense: ["carranca", 18],
    fluminense: ["carranca", 17],
    internacional: ["carranca", 17],
  };

  function boca(g, nome, y) {
    const dados = BOCAS[nome];
    if (!dados) return;
    const [tipo, linha] = dados;
    if (tipo === "presas") {
      g.ret(13, linha + y, 6, 1, TINTA);
      g.ponto(14, linha + y + 1, BRANCO);
      g.ponto(17, linha + y + 1, BRANCO);
    } else {
      g.ret(14, linha + y, 4, 1, TINTA);
      g.ponto(13, linha + y + 1, TINTA);
      g.ponto(18, linha + y + 1, TINTA);
    }
  }

  // O físico acompanha ATK e vida: os 5 mais fracos são porte 0, os 5 mais fortes, porte 3.
  let portes = null;
  function porteDe(nome) {
    if (!portes) {
      const times = SerieABattle.participantes;
      const maxAtk = Math.max(...times.map((t) => t.atk));
      const maxVida = Math.max(...times.map((t) => t.vida));
      const forca = (t) => t.atk / maxAtk + t.vida / maxVida;
      portes = {};
      times.slice()
        .sort((a, b) => forca(a) - forca(b) || a.nome.localeCompare(b.nome))
        .forEach((t, i) => { portes[t.nome] = Math.min(3, Math.floor(i / 5)); });
    }
    return portes[nome];
  }
  const ESCALAS = [0.86, 0.94, 1.03, 1.14];
  const escala = (nome) => ESCALAS[porteDe(nome)];

  const focinho = (g, y, cor) => {
    g.bola(12, y, 8, 5, cor);
    g.ret(15, y + 1, 2, 1, TINTA);
  };

  const leao = (extra) => (g, p, y, pose) => {
    g.par(6, 3 + y, 4, 4, p.juba);
    g.bola(5, 4 + y, 22, 19, p.juba);
    g.bola(9, 8 + y, 14, 12, p.cabeca);
    focinho(g, 14 + y, p.barriga);
    olhos(g, 10 + y, pose);
    if (extra) extra(g, p, y);
  };

  const rosto = (g, p, y) => g.bola(8, 7 + y, 16, 13, p.pele);

  const definicoes = {
    "athletico paranaense": {
      rotulo: "Athletico-PR",
      paleta: { corpo: "#d8263c", barriga: "#21183c", pe: "#21183c", perna: "#8f1c35" },
      cabeca(g, p, y, pose, f) {
        g.ret(5, 4 + y, 22, 3, "#d8263c");
        g.ret(7, 7 + y, 19, 3, "#3b2b55");
        g.ret(6, 10 + y, 20, 4, "#d8263c");
        g.ret(8, 14 + y, 17, 3, "#3b2b55");
        g.ret(10, 17 + y, 12, 3, "#d8263c");
        g.ret(f ? 2 : 27, 6 + y, 3, 1, "#d8263c");
        g.ret(f ? 27 : 2, 13 + y, 3, 1, "#d8263c");
        olhos(g, 9 + y, pose);
      },
    },
    "atletico mg": {
      rotulo: "Atlético-MG",
      paleta: { corpo: "#f4ecd8", barriga: "#3a3550", pe: OURO, braco: "#3a3550" },
      cabeca(g, p, y, pose) {
        g.ret(11, 1 + y, 3, 6, "#e23b4e"); g.ret(15, y, 3, 7, "#e23b4e"); g.ret(19, 2 + y, 2, 5, "#e23b4e");
        g.bola(8, 6 + y, 16, 14, "#f4ecd8");
        g.par(8, 15 + y, 3, 3, "#3a3550");
        g.ret(13, 15 + y, 7, 2, OURO); g.ret(15, 17 + y, 5, 1, "#d98a22");
        g.ret(15, 18 + y, 2, 3, "#e23b4e");
        olhos(g, 10 + y, pose);
      },
    },
    bahia: {
      rotulo: "Bahia",
      paleta: { corpo: "#2f6fd0", barriga: "#d9dfe8", pe: "#8e97a8", braco: "#b9c1cf", mao: "#e23b4e" },
      cabeca(g, p, y, pose) {
        g.ret(14, 1 + y, 4, 6, "#e23b4e");
        g.bola(7, 5 + y, 18, 15, "#b9c1cf");
        g.ret(9, 9 + y, 14, 7, "#2b2f55");
        g.ret(15, 5 + y, 2, 4, "#2f6fd0");
        g.ret(11, 17 + y, 10, 1, "#7f889b");
        olhos(g, 10 + y, pose);
      },
    },
    botafogo: {
      rotulo: "Botafogo",
      paleta: { corpo: "#f4ecd8", barriga: "#3a3550", pe: "#8d90a0", perna: "#b9bcc8", braco: "#b9bcc8" },
      cabeca(g, p, y, pose) {
        rosto(g, { pele: "#c7c9d3" }, y);
        g.bola(7, 3 + y, 18, 8, "#74778a");
        g.ret(7, 9 + y, 3, 4, "#74778a"); g.ret(22, 9 + y, 3, 4, "#74778a");
        g.ret(15, 1 + y, 2, 5, BRANCO); g.ret(13, 3 + y, 6, 1, BRANCO);
        g.ret(15, 17 + y, 3, 1, "#74778a");
        olhos(g, 11 + y, pose);
      },
    },
    chapecoense: {
      rotulo: "Chapecoense",
      paleta: { corpo: "#2c9c55", barriga: BRANCO, pe: "#7a4a2b", braco: PELE_MORENA, perna: PELE_MORENA },
      cabeca(g, p, y, pose) {
        [[4, 7], [7, 3], [11, 1], [15, 0]].forEach(([x, t], i) => {
          const cor = i % 2 ? OURO : "#2c9c55";
          g.par(x, t + y, 3, 8, cor);
        });
        g.ret(5, 8 + y, 22, 2, "#e23b4e");
        rosto(g, { pele: PELE_MORENA }, y + 1);
        g.bola(8, 7 + y, 16, 5, "#2b2240");
        g.par(9, 16 + y, 3, 1, "#e23b4e");
        olhos(g, 12 + y, pose);
      },
    },
    corinthians: {
      rotulo: "Corinthians",
      paleta: { corpo: "#3a3550", barriga: BRANCO, pe: OURO },
      cabeca(g, p, y, pose) {
        g.par(7, 3 + y, 4, 5, "#3a3550");
        g.bola(7, 6 + y, 18, 14, "#3a3550");
        g.par(9, 9 + y, 6, 7, BRANCO);
        g.ret(13, 15 + y, 7, 2, OURO); g.ret(16, 17 + y, 4, 2, OURO); g.ret(18, 19 + y, 2, 1, "#d98a22");
        olhos(g, 10 + y, pose);
      },
    },
    coritiba: {
      rotulo: "Coritiba",
      paleta: { corpo: "#2c9c55", barriga: BRANCO, pe: "#6d4930", mao: PELE, perna: "#f4ecd8" },
      cabeca(g, p, y, pose) {
        g.bola(6, 8 + y, 20, 8, BRANCO);
        rosto(g, { pele: PELE }, y);
        g.bola(8, 3 + y, 16, 7, "#2c9c55");
        g.ret(16, 8 + y, 12, 2, "#1d7641");
        g.bola(9, 15 + y, 14, 7, BRANCO);
        olhos(g, 11 + y, pose);
        g.ret(9, 10 + y, 15, 1, TINTA);
      },
    },
    cruzeiro: {
      rotulo: "Cruzeiro",
      paleta: { corpo: "#2558c9", barriga: BRANCO, pe: "#21306f" },
      cabeca(g, p, y, pose) {
        g.par(6, 2 + y, 5, 7, "#2558c9"); g.par(7, 4 + y, 3, 4, "#ffd7a8");
        g.bola(6, 7 + y, 20, 13, "#2558c9");
        g.par(6, 14 + y, 8, 5, BRANCO);
        g.bola(12, 15 + y, 8, 5, BRANCO);
        g.ret(15, 15 + y, 2, 2, TINTA);
        olhos(g, 10 + y, pose);
      },
    },
    flamengo: {
      rotulo: "Flamengo",
      paleta: { corpo: "#2d2840", barriga: "#d8263c", pe: "#c79a4b", braco: "#3d3757" },
      cabeca(g, p, y, pose) {
        g.ret(13, 2 + y, 2, 4, "#3d3757"); g.ret(17, 3 + y, 2, 3, "#3d3757");
        g.bola(8, 5 + y, 16, 15, "#3d3757");
        g.ret(10, 9 + y, 12, 5, "#d8263c");
        g.ret(13, 14 + y, 7, 3, "#d9c49a"); g.ret(16, 17 + y, 4, 2, "#a98c5c");
        olhos(g, 9 + y, pose);
      },
    },
    fluminense: {
      rotulo: "Fluminense",
      paleta: { corpo: "#8f1c45", barriga: "#2c9c55", pe: "#f4ecd8", mao: PELE, braco: "#8f1c45" },
      cabeca(g, p, y, pose) {
        g.ret(13, y, 6, 6, "#2c9c55");
        rosto(g, { pele: PELE }, y);
        g.bola(7, 4 + y, 18, 8, "#c9ced8");
        g.ret(15, 4 + y, 2, 8, "#8f1c45");
        g.par(7, 11 + y, 2, 6, "#c9ced8");
        g.ret(14, 17 + y, 4, 1, "#b87655");
        olhos(g, 12 + y, pose);
      },
    },
    "grêmio": {
      rotulo: "Grêmio",
      paleta: { corpo: "#2f8fd8", barriga: "#3a3550", pe: "#3a3550", mao: BRANCO, perna: BRANCO },
      cabeca(g, p, y, pose) {
        rosto(g, { pele: PELE }, y);
        g.bola(7, 3 + y, 18, 7, "#2d2840");
        g.ret(3, 8 + y, 26, 2, "#2d2840");
        g.ret(20, y, 3, 8, BRANCO); g.ret(23, 2 + y, 2, 4, "#2f8fd8");
        g.par(10, 16 + y, 6, 1, "#2d2840"); g.par(9, 17 + y, 3, 1, "#2d2840");
        olhos(g, 11 + y, pose);
      },
    },
    internacional: {
      rotulo: "Internacional",
      paleta: { corpo: "#d8263c", barriga: BRANCO, pe: "#2d2840", perna: PELE_MORENA, braco: PELE_MORENA },
      opcoes: { umaPerna: true },
      cabeca(g, p, y, pose) {
        rosto(g, { pele: PELE_MORENA }, y);
        g.ret(9, 5 + y, 14, 4, "#d8263c"); g.ret(11, 2 + y, 10, 3, "#d8263c");
        g.ret(17, y, 6, 2, "#d8263c"); g.ret(23, 1 + y, 3, 2, "#d8263c");
        g.ret(14, 17 + y, 4, 1, "#6e3f28");
        olhos(g, 11 + y, pose);
      },
    },
    mirassol: {
      rotulo: "Mirassol",
      paleta: { corpo: "#f2c230", barriga: "#2c9c55", pe: "#2c9c55", cabeca: "#f2c230", juba: "#b86f25" },
      cabeca: leao((g, p, y) => {
        g.ret(4, 5 + y, 24, 2, "#e8cf7e");
        g.ret(9, 1 + y, 14, 4, "#e8cf7e");
        g.ret(9, 4 + y, 14, 1, "#2c9c55");
      }),
    },
    palmeiras: {
      rotulo: "Palmeiras",
      paleta: { corpo: "#1f8a4c", barriga: BRANCO, pe: "#145f39", braco: "#f49aa4" },
      cabeca(g, p, y, pose) {
        g.par(6, 4 + y, 5, 5, "#e87f8e");
        g.bola(7, 6 + y, 18, 14, "#f49aa4");
        g.bola(11, 13 + y, 10, 6, "#e87f8e");
        g.par(13, 15 + y, 1, 2, TINTA);
        g.ret(7, 8 + y, 18, 2, "#1f8a4c");
        olhos(g, 10 + y, pose);
      },
    },
    "red bull bragantino": {
      rotulo: "Bragantino",
      paleta: { corpo: "#d8263c", barriga: BRANCO, pe: "#2d2840" },
      cabeca(g, p, y, pose) {
        g.par(3, 6 + y, 5, 2, "#f4ecd8"); g.par(2, 3 + y, 2, 4, "#f4ecd8");
        g.bola(7, 6 + y, 18, 14, "#d8263c");
        g.bola(10, 14 + y, 12, 6, "#f4d4b0");
        g.par(13, 16 + y, 1, 2, TINTA);
        g.ret(15, 19 + y, 2, 2, OURO);
        olhos(g, 9 + y, pose);
      },
    },
    remo: {
      rotulo: "Remo",
      paleta: { corpo: "#27409c", barriga: BRANCO, pe: "#17265f", cabeca: "#6f9bea", juba: "#27409c" },
      cabeca: leao(),
    },
    santos: {
      rotulo: "Santos",
      paleta: { corpo: "#3a3550", barriga: BRANCO, pe: "#2d2840" },
      cabeca(g, p, y, pose, f) {
        g.ret(15, 1 + y, 2, 3, "#7fd3ee"); g.ret(f ? 12 : 18, y, 2, 2, "#7fd3ee");
        g.bola(4, 5 + y, 24, 16, "#3a3550");
        g.bola(6, 13 + y, 20, 8, BRANCO);
        g.par(8, 8 + y, 3, 2, BRANCO);
        g.ret(11, 16 + y, 10, 1, "#3a3550");
        olhos(g, 9 + y, pose);
      },
    },
    "são paulo": {
      rotulo: "São Paulo",
      paleta: { corpo: BRANCO, barriga: "#d8263c", pe: "#7a4a2b", braco: "#d8263c", mao: PELE },
      cabeca(g, p, y, pose) {
        g.ret(10, y, 12, 1, OURO); g.par(8, 1 + y, 2, 2, OURO); g.ret(10, 3 + y, 12, 1, "#d98a22");
        rosto(g, { pele: PELE }, y);
        g.bola(8, 5 + y, 16, 5, "#6d4930");
        g.bola(10, 15 + y, 12, 7, "#e8e0cf");
        olhos(g, 11 + y, pose);
      },
    },
    "vasco da gama": {
      rotulo: "Vasco",
      paleta: { corpo: "#2d2840", barriga: BRANCO, pe: "#2d2840", braco: "#3a3550", mao: OURO },
      cabeca(g, p, y, pose) {
        rosto(g, { pele: PELE }, y);
        g.bola(6, 2 + y, 20, 7, BRANCO);
        g.ret(7, 8 + y, 18, 2, "#2d2840");
        g.ret(15, 3 + y, 2, 5, "#d8263c"); g.ret(13, 5 + y, 6, 1, "#d8263c");
        g.bola(9, 15 + y, 14, 6, "#574c68");
        olhos(g, 11 + y, pose);
      },
    },
    "vitória": {
      rotulo: "Vitória",
      paleta: { corpo: "#d8263c", barriga: "#2d2840", pe: "#2d2840", cabeca: "#f0b04a", juba: "#8f1c35" },
      cabeca: leao((g, p, y) => {
        g.par(6, 8 + y, 3, 8, "#2d2840");
      }),
    },
  };

  function desenhar(ctx, nome, pose = "parado", quadro = 0) {
    const def = definicoes[nome];
    const g = new Grade();
    const dy = pose === "derrota" ? 3 : pose === "parado" && quadro ? 1 : 0;
    corpo(g, def.paleta, pose, quadro, def.opcoes, porteDe(nome));
    def.cabeca(g, def.paleta, dy, pose, quadro);
    boca(g, nome, dy);
    g.acabar().pintar(ctx);
  }

  const rotulo = (nome) => definicoes[nome].rotulo;

  return { desenhar, rotulo, escala };
})();
