// Motor de pixel art: desenha em uma grade 32x32 e aplica sombra e contorno.
window.Pixel = (() => {
  const TAM = 32;
  const TINTA = "#21183c";

  const paraRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const misturar = (hex, alvo, t) => {
    const a = paraRgb(hex);
    const b = paraRgb(alvo);
    return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
  };

  class Grade {
    constructor() {
      this.px = new Array(TAM * TAM).fill(null);
    }
    ponto(x, y, cor) {
      if (x >= 0 && y >= 0 && x < TAM && y < TAM) this.px[y * TAM + x] = cor;
    }
    ler(x, y) {
      return x >= 0 && y >= 0 && x < TAM && y < TAM ? this.px[y * TAM + x] : null;
    }
    ret(x, y, l, a, cor) {
      for (let j = y; j < y + a; j++) for (let i = x; i < x + l; i++) this.ponto(i, j, cor);
    }
    // Desenha o retângulo e seu espelho no eixo central.
    par(x, y, l, a, cor) {
      this.ret(x, y, l, a, cor);
      this.ret(TAM - x - l, y, l, a, cor);
    }
    bola(x, y, l, a, cor) {
      this.ret(x + 2, y, l - 4, a, cor);
      this.ret(x + 1, y + 1, l - 2, a - 2, cor);
      this.ret(x, y + 2, l, a - 4, cor);
    }
    acabar() {
      const base = this.px.slice();
      const vazio = (x, y) => (x < 0 || y < 0 || x >= TAM || y >= TAM ? true : base[y * TAM + x] === null);
      for (let y = 0; y < TAM; y++) {
        for (let x = 0; x < TAM; x++) {
          const cor = base[y * TAM + x];
          if (!cor || cor === TINTA) continue;
          if (vazio(x, y + 1)) this.px[y * TAM + x] = misturar(cor, TINTA, 0.28);
          else if (vazio(x, y - 1)) this.px[y * TAM + x] = misturar(cor, "#ffffff", 0.2);
        }
      }
      for (let y = 0; y < TAM; y++) {
        for (let x = 0; x < TAM; x++) {
          if (base[y * TAM + x]) continue;
          if (!vazio(x - 1, y) || !vazio(x + 1, y) || !vazio(x, y - 1) || !vazio(x, y + 1)) {
            this.px[y * TAM + x] = TINTA;
          }
        }
      }
      return this;
    }
    pintar(ctx) {
      ctx.clearRect(0, 0, TAM, TAM);
      for (let y = 0; y < TAM; y++) {
        for (let x = 0; x < TAM; x++) {
          const cor = this.px[y * TAM + x];
          if (cor) {
            ctx.fillStyle = cor;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
  }

  return { Grade, TAM, TINTA, misturar };
})();
