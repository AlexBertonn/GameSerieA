// Registro de cenários. Para criar outro, adicione uma entrada com "fundo" e "frente".
window.Cenarios = (() => {
  const sorteador = (semente) => () => (semente = (semente * 16807) % 2147483647) / 2147483647;
  const ret = (c, x, y, l, a, cor) => {
    c.fillStyle = cor;
    c.fillRect(Math.round(x), Math.round(y), Math.round(l), Math.round(a));
  };
  const elipse = (c, cx, cy, rx, ry, cor) => {
    c.fillStyle = cor;
    for (let y = -ry; y <= ry; y++) {
      const m = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
      c.fillRect(Math.round(cx - m), Math.round(cy + y), m * 2, 1);
    }
  };

  function palmeira(c, x, base, altura, escuro, claro) {
    for (let i = 0; i < altura; i++) {
      const curva = Math.round(Math.sin(i / altura * 1.6) * 5);
      ret(c, x + curva, base - i, 3, 1, i % 4 < 2 ? "#6a4256" : "#513350");
    }
    const tx = x + Math.round(Math.sin(1.6) * 5) + 1;
    const ty = base - altura;
    [[-1, -0.25], [1, -0.25], [-1, 0.35], [1, 0.35], [-0.55, -0.8], [0.55, -0.8]].forEach(([dx, dy], f) => {
      for (let i = 0; i < 17; i++) {
        const px = tx + dx * i;
        const py = ty + dy * i + (i * i) / 24;
        ret(c, px, py, 2, Math.max(1, 3 - i / 7), f % 2 ? escuro : claro);
      }
    });
  }

  function trave(c, x, y, lado) {
    const cor = "#fff3d1";
    ret(c, x, y - 18, 2, 19, cor);
    ret(c, x + lado * 11, y - 13, 2, 16, cor);
    for (let i = 0; i <= 11; i++) ret(c, x + lado * i, y - 18 + Math.round(i * 5 / 11), 2, 1, cor);
    c.fillStyle = "rgba(255,243,209,.3)";
    for (let i = 2; i < 11; i += 2) c.fillRect(x + lado * i, y - 15, 1, 16);
    for (let j = -12; j < 1; j += 3) c.fillRect(Math.min(x, x + lado * 11), y + j, 12, 1);
  }

  const varzea = {
    nome: "Várzea ao entardecer",
    posicoes: { jogador: 0.26, adversario: 0.74, chaoJogador: 0.87, chaoAdversario: 0.74 },

    fundo(c, l, a) {
      const r = sorteador(4817);
      const horizonte = Math.round(a * 0.54);
      const faixas = ["#312a6e", "#4f3488", "#84407f", "#c94f70", "#f0766a", "#ffb05a"];
      const altura = Math.ceil(horizonte / faixas.length);
      faixas.forEach((cor, i) => {
        ret(c, 0, i * altura, l, altura, cor);
        if (faixas[i + 1]) {
          c.fillStyle = faixas[i + 1];
          for (let x = 0; x < l; x += 2) {
            c.fillRect(x, (i + 1) * altura - 1, 1, 1);
            c.fillRect(x + 1, (i + 1) * altura - 3, 1, 1);
          }
        }
      });

      for (let i = 0; i < l / 7; i++) ret(c, r() * l, r() * horizonte * 0.42, 1, 1, r() > 0.5 ? "#fff3d1" : "#b7a6e0");

      elipse(c, l * 0.5, horizonte - 8, 25, 25, "#ffe08a");
      [0, 5, 10].forEach((d, i) => ret(c, 0, horizonte - 13 + d, l, 1 + i, "#ffb05a"));

      [[0.14, 24, 24], [0.68, 15, 34], [0.9, 34, 18]].forEach(([p, y, t]) => {
        ret(c, l * p, y, t, 3, "#f79a7e");
        ret(c, l * p + 5, y - 2, t * 0.55, 2, "#ffc08f");
      });

      for (let x = 0; x < l; x++) {
        const y1 = horizonte - 16 - Math.sin(x / 31) * 8 - Math.sin(x / 13 + 2) * 3;
        ret(c, x, y1, 1, horizonte - y1, "#6b3f86");
      }
      for (let x = 0; x < l; x++) {
        const y2 = horizonte - 7 - Math.abs(Math.sin(x / 9)) * 5 - Math.sin(x / 41) * 3;
        ret(c, x, y2, 1, horizonte - y2 + 2, "#285a63");
      }

      for (let x = -4; x < l; x += 8) {
        ret(c, x + 3, horizonte - 6, 1, 8, "#7c4f55");
        ret(c, x, horizonte - 3, 9, 1, "#94645f");
      }

      palmeira(c, l * 0.08, horizonte + 3, 40, "#1d6e55", "#2c9c63");
      palmeira(c, l * 0.91, horizonte + 3, 33, "#1d6e55", "#2c9c63");

      const faixasCampo = a - horizonte;
      let y = horizonte;
      let h = 4;
      let par = true;
      while (y < a) {
        ret(c, 0, y, l, h, par ? "#38a853" : "#2f9649");
        y += h;
        h = Math.min(h + 2, Math.ceil(faixasCampo / 3));
        par = !par;
      }

      ret(c, 0, horizonte + 2, l, 1, "#fff3d1");
      c.strokeStyle = "transparent";
      for (let i = horizonte + 3; i < a; i += 2) ret(c, l / 2, i, 1, 1, "#d8efb0");
      const cy = horizonte + (a - horizonte) * 0.52;
      for (let t = 0; t < 360; t += 3) {
        const rad = (t * Math.PI) / 180;
        ret(c, l / 2 + Math.cos(rad) * Math.min(l * 0.14, 42), cy + Math.sin(rad) * 13, 1, 1, "#d8efb0");
      }

      trave(c, 6, horizonte + 13, 1);
      trave(c, l - 8, horizonte + 13, -1);

      for (let i = 0; i < l / 2; i++) {
        ret(c, r() * l, horizonte + 4 + r() * (a - horizonte), 1, 2, r() > 0.5 ? "#55bd5f" : "#26804a");
      }

      [[this.posicoes.jogador, this.posicoes.chaoJogador], [this.posicoes.adversario, this.posicoes.chaoAdversario]].forEach(([px, py]) => {
        const cx = l * px;
        const cyp = a * py;
        const rx = Math.min(l * 0.2, a * 0.26);
        elipse(c, cx, cyp + 2, rx, 8, "#6a4a3e");
        elipse(c, cx, cyp, rx, 7, "#c98f58");
        elipse(c, cx - 2, cyp - 1, rx * 0.72, 4, "#dcaa6c");
        for (let i = 0; i < 12; i++) ret(c, cx - rx * 0.7 + r() * rx * 1.4, cyp - 3 + r() * 6, 2, 1, "#a87046");
      });
    },

    frente(c, l, a) {
      const r = sorteador(9931);
      for (let x = -2; x < l; x += 3) {
        const borda = x < l * 0.14 || x > l * 0.86 ? 13 : 5;
        const h = 2 + Math.floor(r() * borda);
        ret(c, x, a - h, 2, h, r() > 0.5 ? "#1d6e55" : "#26804a");
        ret(c, x + 1, a - h - 1, 1, 2, "#55bd5f");
      }
      [[0.02, 15], [0.97, 18]].forEach(([p, t]) => {
        const x = l * p;
        elipse(c, x, a - 3, t, 8, "#4a4265");
        elipse(c, x - 2, a - 5, t * 0.72, 5, "#6e6690");
        ret(c, x - 5, a - 8, 5, 1, "#958dad");
      });
    },
  };

  // ESTÁDIOS: releituras em pixel art, montadas a partir de uma configuração.
  const CEUS = {
    noite: ["#141238", "#1c1a4a", "#272463", "#352e78", "#4a3a8a", "#6b4a96"],
    tarde: ["#312a6e", "#4f3488", "#84407f", "#c94f70", "#f0766a", "#ffb05a"],
    dourado: ["#6d3f86", "#a24d7d", "#d9646c", "#f28f5f", "#ffbe63", "#ffe08e"],
    manha: ["#3f7fd6", "#559ae0", "#74b3e8", "#98cbee", "#bfe0ef", "#e4f0e4"],
  };

  function pintarCeu(c, l, h, tipo, r) {
    const cores = CEUS[tipo];
    const altura = Math.ceil(h / cores.length);
    cores.forEach((cor, i) => {
      ret(c, 0, i * altura, l, altura, cor);
      if (!cores[i + 1]) return;
      c.fillStyle = cores[i + 1];
      for (let x = 0; x < l; x += 2) {
        c.fillRect(x, (i + 1) * altura - 1, 1, 1);
        c.fillRect(x + 1, (i + 1) * altura - 3, 1, 1);
      }
    });
    if (tipo === "noite") {
      for (let i = 0; i < l / 5; i++) ret(c, r() * l, r() * h * 0.5, 1, 1, r() > 0.5 ? "#fff3d1" : "#b7a6e0");
      elipse(c, l * 0.82, 20, 8, 8, "#fff3d1");
      elipse(c, l * 0.82 + 3, 18, 7, 7, cores[0]);
    } else {
      elipse(c, l * 0.2, h * 0.34, 11, 11, tipo === "manha" ? "#fff6c9" : "#ffe08a");
      [[0.42, 15, 32], [0.72, 27, 24]].forEach(([p, y, t]) => {
        ret(c, l * p, y, t, 3, "#fff3d1");
        ret(c, l * p + 5, y - 2, t * 0.55, 2, "#fff3d1");
      });
    }
  }

  const PAISAGENS = {
    cristo(c, l, h) {
      for (let x = 0; x < l; x++) {
        const y = h - 34 - Math.max(0, 34 - Math.abs(x - l * 0.72) * 0.75);
        ret(c, x, y, 1, h - y, "#2a4a63");
      }
      const x = Math.round(l * 0.72);
      ret(c, x - 1, h - 80, 3, 13, "#fff3d1");
      ret(c, x - 8, h - 77, 17, 2, "#fff3d1");
      ret(c, x, h - 82, 1, 2, "#fff3d1");
    },
    predios(c, l, h, r) {
      for (let x = -4; x < l;) {
        const largura = 9 + Math.floor(r() * 12);
        const altura = 46 + Math.floor(r() * 30);
        ret(c, x, h - altura, largura, altura, "#3a3768");
        for (let j = h - altura + 3; j < h - 30; j += 4) {
          for (let i = x + 2; i < x + largura - 2; i += 3) if (r() > 0.45) ret(c, i, j, 1, 2, "#ffcf70");
        }
        x += largura + 1;
      }
    },
    morros(c, l, h) {
      for (let x = 0; x < l; x++) {
        const y = h - 50 - Math.sin(x / 29) * 11 - Math.sin(x / 11 + 1) * 3;
        ret(c, x, y, 1, h - y, "#3f6a68");
      }
    },
    mata(c, l, h, r) {
      for (let x = -6; x < l; x += 7) elipse(c, x, h - 40 - r() * 12, 8 + r() * 4, 10, r() > 0.5 ? "#1d6e55" : "#2c8a5c");
    },
    agua(c, l, h) {
      ret(c, 0, h - 42, l, 42, "#3f9ccf");
      for (let y = h - 40; y < h; y += 4) for (let x = y % 8; x < l; x += 16) ret(c, x, y, 6, 1, "#a8e0ef");
    },
    palmeiras(c, l, h) {
      palmeira(c, l * 0.1, h - 8, 48, "#1d6e55", "#2c9c63");
      palmeira(c, l * 0.88, h - 8, 44, "#1d6e55", "#2c9c63");
    },
  };

  const ALTURAS = {
    anel: (u, h) => h - 28 - 15 * u * u,
    arcos: (u, h) => h - 28 - 12 * u * u,
    moderno: (u, h) => h - 42,
    classico: (u, h) => h - 25,
    pequeno: (u, h) => h - 20,
    ferradura: (u, h) => (Math.abs(u) < 0.24 ? h - 7 : h - 24 - 18 * Math.abs(u)),
    folhas: (u, h) => h - 31 - 11 * u * u,
  };

  function pintarArquibancada(c, l, h, e, topo, r) {
    // Torcida mais escura e suave, para os mascotes continuarem em destaque.
    const sombra = Pixel.misturar(e.cores[0], "#21183c", 0.62);
    const torcedorA = Pixel.misturar(e.cores[0], "#21183c", 0.3);
    const torcedorB = Pixel.misturar(e.cores[1], "#21183c", 0.42);
    const claro = Pixel.misturar("#fff3d1", "#21183c", 0.34);
    for (let x = 0; x < l; x++) {
      const t = Math.round(topo(x));
      for (let y = t; y < h - 5; y++) {
        const sorte = r();
        const cor = (y - t) % 4 === 3 ? sombra : sorte < 0.07 ? claro : sorte < 0.62 ? torcedorA : torcedorB;
        ret(c, x, y, 1, 1, cor);
      }
    }
    for (let x = 0; x < l; x += 24) {
      ret(c, x, h - 5, 12, 5, e.cores[0]);
      ret(c, x + 12, h - 5, 12, 5, "#fff3d1");
    }
  }

  const ESTRUTURAS = {
    anel(c, l, h, e, topo) {
      for (let x = 0; x < l; x++) {
        const t = Math.round(topo(x));
        ret(c, x, t - 6, 1, 5, e.teto);
        ret(c, x, t - 7, 1, 1, "#fff3d1");
        ret(c, x, t - 1, 1, 1, "#21183c");
      }
      for (let x = 6; x < l; x += 18) ret(c, x, topo(x) - 1, 2, 12, "#6f6a8c");
    },
    arcos(c, l, h, e, topo) {
      ESTRUTURAS.anel(c, l, h, e, topo);
      [0.25, 0.75].forEach((centro) => {
        for (let t = 0; t <= 1; t += 0.006) {
          const x = l * (centro + (t - 0.5) * 0.42);
          ret(c, x, h - 37 - 30 * (1 - (2 * t - 1) ** 2), 2, 2, e.destaque);
        }
      });
    },
    moderno(c, l, h, e) {
      ret(c, 0, h - 52, l, 9, e.teto);
      ret(c, 0, h - 53, l, 1, "#fff3d1");
      ret(c, 0, h - 43, l, 1, "#21183c");
      for (let x = 4; x < l; x += 12) ret(c, x, h - 52, 2, 9, Pixel.misturar(e.teto, "#21183c", 0.35));
      const largura = Math.min(62, l * 0.28);
      const x = l / 2 - largura / 2;
      ret(c, x - 2, h - 58, largura + 4, 20, "#21183c");
      ret(c, x, h - 56, largura, 16, "#312a6e");
      for (let i = 3; i < largura - 4; i += 5) ret(c, x + i, h - 51, 3, 5, i % 2 ? e.cores[0] : "#fff3d1");
    },
    classico(c, l, h, e, topo) {
      for (let x = 0; x < l; x++) ret(c, x, topo(x) - 2, 1, 2, e.teto);
      const largura = Math.min(104, l * 0.42);
      const x = l / 2 - largura / 2;
      ret(c, x, h - 54, largura, 34, "#e8dcc0");
      ret(c, x - 3, h - 57, largura + 6, 3, e.teto);
      for (let i = 5; i < largura - 8; i += 13) {
        ret(c, x + i, h - 45, 8, 24, "#4a4265");
        elipse(c, x + i + 4, h - 45, 4, 3, "#4a4265");
      }
      if (e.cruz) {
        ret(c, l / 2 - 1, h - 70, 3, 13, "#d8263c");
        ret(c, l / 2 - 5, h - 66, 11, 3, "#d8263c");
      }
    },
    pequeno(c, l, h, e, topo) {
      for (let x = 0; x < l; x++) ret(c, x, topo(x) - 2, 1, 2, e.teto);
      const largura = Math.min(96, l * 0.4);
      const x = l / 2 - largura / 2;
      ret(c, x, h - 34, largura, 4, e.teto);
      ret(c, x, h - 35, largura, 1, "#fff3d1");
      for (let i = 2; i < largura; i += 16) ret(c, x + i, h - 30, 2, 11, "#6f6a8c");
    },
    ferradura(c, l, h, e, topo) {
      for (let x = 0; x < l; x++) {
        const u = (x / l - 0.5) * 2;
        if (Math.abs(u) < 0.24) continue;
        const t = Math.round(topo(x));
        ret(c, x, t - 5, 1, 4, e.teto);
        ret(c, x, t - 6, 1, 1, "#fff3d1");
      }
    },
    folhas(c, l, h, e, topo) {
      for (let x = -6; x < l; x += 13) {
        const t = topo(Math.max(0, x));
        for (let i = 0; i < 12; i++) {
          const curva = Math.round(Math.sin((i / 11) * Math.PI) * 8);
          ret(c, x + i, t - curva - 1, 1, curva + 2, i % 12 < 2 ? "#c9ced8" : e.teto);
        }
      }
    },
  };

  function pintarRefletores(c, l, h) {
    [0.04, 0.96].forEach((p) => {
      const x = Math.round(l * p);
      ret(c, x, h - 76, 2, 62, "#6f6a8c");
      ret(c, x - 6, h - 83, 14, 8, "#21183c");
      for (let i = 0; i < 4; i++) ret(c, x - 5 + i * 3, h - 81, 2, 4, "#fff6c9");
    });
  }

  function pintarCampo(c, l, a, h, r, pos) {
    let y = h;
    let faixa = 4;
    let par = true;
    while (y < a) {
      ret(c, 0, y, l, faixa, par ? "#38a853" : "#2f9649");
      y += faixa;
      faixa = Math.min(faixa + 2, 26);
      par = !par;
    }
    ret(c, 0, h + 2, l, 1, "#fff3d1");
    for (let i = h + 3; i < a; i += 2) ret(c, l / 2, i, 1, 1, "#d8efb0");
    const centro = h + (a - h) * 0.52;
    for (let t = 0; t < 360; t += 3) {
      const rad = (t * Math.PI) / 180;
      ret(c, l / 2 + Math.cos(rad) * Math.min(l * 0.14, 42), centro + Math.sin(rad) * 13, 1, 1, "#d8efb0");
    }
    trave(c, 6, h + 13, 1);
    trave(c, l - 8, h + 13, -1);
    for (let i = 0; i < l / 2; i++) ret(c, r() * l, h + 4 + r() * (a - h), 1, 2, r() > 0.5 ? "#55bd5f" : "#26804a");

    [[pos.jogador, pos.chaoJogador], [pos.adversario, pos.chaoAdversario]].forEach(([px, py]) => {
      const cx = l * px;
      const cy = a * py;
      const rx = Math.min(l * 0.2, a * 0.26);
      elipse(c, cx, cy + 2, rx, 8, "#1f6b3d");
      elipse(c, cx, cy, rx, 7, "#56c56c");
      elipse(c, cx - 2, cy - 1, rx * 0.72, 4, "#72d982");
    });
  }

  function criarEstadio(e) {
    return {
      nome: e.nome,
      posicoes: varzea.posicoes,
      fundo(c, l, a) {
        const r = sorteador(e.semente);
        const h = Math.round(a * 0.54);
        const altura = ALTURAS[e.tipo];
        const topo = (x) => altura((x / l - 0.5) * 2, h);
        pintarCeu(c, l, h, e.ceu, r);
        (e.paisagem || []).forEach((nome) => PAISAGENS[nome](c, l, h, r));
        pintarArquibancada(c, l, h, e, topo, r);
        ESTRUTURAS[e.tipo](c, l, h, e, topo);
        if (e.ceu === "noite") pintarRefletores(c, l, h);
        pintarCampo(c, l, a, h, r, this.posicoes);
      },
      frente: varzea.frente,
    };
  }

  // A chave é o campo "nome" de cada time no jogo.js.
  const BRANCO = "#f4ecd8";
  const PRETO = "#2d2840";
  const estadios = {
    flamengo: { nome: "Maracanã", ceu: "noite", tipo: "anel", cores: ["#d8263c", PRETO], teto: "#e8e4dc", paisagem: ["cristo"] },
    fluminense: { nome: "Maracanã", ceu: "tarde", tipo: "anel", cores: ["#8f1c45", "#2c9c55"], teto: "#e8e4dc", paisagem: ["cristo"] },
    palmeiras: { nome: "Allianz Parque", ceu: "noite", tipo: "moderno", cores: ["#1f8a4c", BRANCO], teto: "#d9dfe8", paisagem: ["predios"] },
    cruzeiro: { nome: "Mineirão", ceu: "manha", tipo: "anel", cores: ["#2558c9", BRANCO], teto: "#c7c9d3", paisagem: ["morros"] },
    "atletico mg": { nome: "Arena MRV", ceu: "noite", tipo: "moderno", cores: [PRETO, BRANCO], teto: "#55506e", paisagem: ["morros"] },
    "são paulo": { nome: "Morumbi", ceu: "dourado", tipo: "anel", cores: ["#d8263c", BRANCO], teto: "#b9bcc8", paisagem: ["predios"] },
    corinthians: { nome: "Neo Química Arena", ceu: "noite", tipo: "moderno", cores: [PRETO, BRANCO], teto: "#8e97a8", paisagem: ["predios"] },
    santos: { nome: "Vila Belmiro", ceu: "manha", tipo: "pequeno", cores: [BRANCO, PRETO], teto: "#6f6a8c", paisagem: ["agua", "palmeiras"] },
    "vasco da gama": { nome: "São Januário", ceu: "tarde", tipo: "classico", cores: [PRETO, BRANCO], teto: "#b9bcc8", cruz: true, paisagem: ["morros"] },
    botafogo: { nome: "Nilton Santos", ceu: "noite", tipo: "arcos", cores: [PRETO, BRANCO], teto: "#c7c9d3", destaque: "#ffb93b", paisagem: ["morros"] },
    bahia: { nome: "Arena Fonte Nova", ceu: "manha", tipo: "ferradura", cores: ["#2f6fd0", "#d8263c"], teto: "#e8e4dc", paisagem: ["agua"] },
    "vitória": { nome: "Barradão", ceu: "dourado", tipo: "pequeno", cores: ["#d8263c", PRETO], teto: "#7b7490", paisagem: ["mata", "palmeiras"] },
    internacional: { nome: "Beira-Rio", ceu: "tarde", tipo: "folhas", cores: ["#d8263c", BRANCO], teto: "#e8e4dc", paisagem: ["agua"] },
    "grêmio": { nome: "Arena do Grêmio", ceu: "noite", tipo: "moderno", cores: ["#2f8fd8", PRETO], teto: "#c7c9d3", paisagem: ["morros"] },
    "athletico paranaense": { nome: "Arena da Baixada", ceu: "noite", tipo: "moderno", cores: ["#d8263c", PRETO], teto: "#55506e", paisagem: ["predios"] },
    coritiba: { nome: "Couto Pereira", ceu: "manha", tipo: "classico", cores: ["#2c9c55", BRANCO], teto: "#7b7490", paisagem: ["predios"] },
    chapecoense: { nome: "Arena Condá", ceu: "tarde", tipo: "pequeno", cores: ["#2c9c55", BRANCO], teto: "#7b7490", paisagem: ["morros"] },
    mirassol: { nome: "Maião", ceu: "dourado", tipo: "pequeno", cores: ["#f2c230", "#2c9c55"], teto: "#7b7490", paisagem: ["mata"] },
    "red bull bragantino": { nome: "Nabi Abi Chedid", ceu: "noite", tipo: "pequeno", cores: ["#d8263c", BRANCO], teto: "#7b7490", paisagem: ["morros"] },
    remo: { nome: "Baenão", ceu: "manha", tipo: "pequeno", cores: ["#27409c", BRANCO], teto: "#7b7490", paisagem: ["mata", "palmeiras"] },
  };

  const cache = {};
  function daCasa(nomeTime) {
    if (!cache[nomeTime]) {
      const semente = 1000 + [...nomeTime].reduce((soma, letra) => soma + letra.charCodeAt(0), 0);
      cache[nomeTime] = criarEstadio({ ...estadios[nomeTime], semente });
    }
    return cache[nomeTime];
  }

  return { varzea, padrao: "varzea", daCasa };
})();
