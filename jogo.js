// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// O prompt-sync só existe no Node; no navegador o time vem da tela de seleção.
const prompt = typeof window === "undefined" ? require("prompt-sync")() : null;

const participantes = [
  {
    nome: "athletico paranaense",
    apelidos: ["athletico", "furacão"],
    mascote: "Furacão",
    pontos: 0,
  },
  {
    nome: "atletico mg",
    apelidos: ["atletico mineiro", "galo", "galão da massa"],
    mascote: "Galão",
    pontos: 0,
  },
  {
    nome: "bahia",
    apelidos: ["bahêa", "esquadrão de aço", "tricolor de aço"],
    mascote: "Herói de Aço", // ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
    pontos: 0,
  },
  {
    nome: "botafogo",
    apelidos: ["fogão", "glorioso", "estrela solitária"],
    mascote: "Manequinho",
    pontos: 0,
  },
  {
    nome: "chapecoense",
    apelidos: ["chape", "verdão do oeste"],
    mascote: "Índio Condá",
    pontos: 0,
  },
  {
    nome: "corinthians",
    apelidos: ["timão", "coringão", "time do povo", "curintia"],
    mascote: "Gavião",
    pontos: 0,
  },
  {
    nome: "coritiba",
    apelidos: ["coxa", "coxa-branca"],
    mascote: "Vovô Coxa",
    pontos: 0,
  },
  {
    nome: "cruzeiro",
    apelidos: ["raposa", "cabuloso", "celeste"],
    mascote: "Raposa",
    pontos: 0,
  },
  {
    nome: "flamengo",
    apelidos: ["mengo", "mengão", "urubu", "rubro-negro"],
    mascote: "Urubu",
    pontos: 0,
  },
  {
    nome: "fluminense",
    apelidos: ["flu", "tricolor"],
    mascote: "Guerreirinho",
    pontos: 0,
  },
  {
    nome: "grêmio",
    apelidos: ["gremio", "imortal"],
    mascote: "Mosqueteiro",
    pontos: 0,
  },
  {
    nome: "internacional",
    apelidos: ["inter", "colorado"],
    mascote: "Saci",
    pontos: 0,
  },
  {
    nome: "mirassol",
    apelidos: ["leão"],
    mascote: "Leão Caipira",
    pontos: 0,
  },
  {
    nome: "palmeiras",
    apelidos: ["verdão", "porco", "palestra", "verdazzo"],
    mascote: "Porco",
    pontos: 0,
  },
  {
    nome: "red bull bragantino",
    apelidos: ["bragantino", "massa bruta"],
    mascote: "Toro Loko",
    pontos: 0,
  },
  {
    nome: "remo",
    apelidos: ["azulino"],
    mascote: "Leão Azul",
    pontos: 0,
  },
  {
    nome: "santos",
    apelidos: ["peixe", "santástico"],
    mascote: "Baleia",
    pontos: 0,
  },
  {
    nome: "são paulo",
    apelidos: ["sao paulo", "tricolor paulista", "soberano", "tricolor"],
    mascote: "Santo Paulo",
    pontos: 0,
  },
  {
    nome: "vasco da gama",
    apelidos: ["vasco", "vascão", "gigante da colina", "cruzmaltino"],
    mascote: "Almirante",
    pontos: 0,
  },
  {
    nome: "vitória",
    apelidos: ["vitoria", "leão da barra", "nego", "rubro-negro baiano"],
    mascote: "Leão",
    pontos: 0,
  },
];

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// BALANCEAMENTO: atk e vida agora são calculados a partir destes dados.
// Campanha: Brasileirão 2026 até a 36ª rodada (jogos de 22/11/2026).
// trajetoria: nota editorial de 0 a 100 para longevidade e finais recentes.
// A nota de história é calculada em historicoClubes, logo abaixo.
const dadosBrasileirao = {
  flamengo: { trajetoria: 68, jogos: 36, pontos: 80, golsPro: 74, golsContra: 31 },
  palmeiras: { trajetoria: 100, jogos: 36, pontos: 74, golsPro: 64, golsContra: 26 },
  cruzeiro: { trajetoria: 66, jogos: 36, pontos: 66, golsPro: 59, golsContra: 50 },
  fluminense: { trajetoria: 78, jogos: 36, pontos: 63, golsPro: 57, golsContra: 42 },
  "athletico paranaense": { trajetoria: 60, jogos: 36, pontos: 57, golsPro: 56, golsContra: 47 },
  bahia: { trajetoria: 52, jogos: 36, pontos: 54, golsPro: 50, golsContra: 46 },
  "atletico mg": { trajetoria: 92, jogos: 35, pontos: 51, golsPro: 44, golsContra: 40 },
  "red bull bragantino": { trajetoria: 54, jogos: 36, pontos: 50, golsPro: 46, golsContra: 41 },
  santos: { trajetoria: 44, jogos: 35, pontos: 50, golsPro: 51, golsContra: 49 },
  "vasco da gama": { trajetoria: 50, jogos: 36, pontos: 47, golsPro: 47, golsContra: 52 },
  coritiba: { trajetoria: 34, jogos: 36, pontos: 45, golsPro: 41, golsContra: 52 },
  "são paulo": { trajetoria: 64, jogos: 35, pontos: 44, golsPro: 39, golsContra: 40 },
  botafogo: { trajetoria: 74, jogos: 35, pontos: 42, golsPro: 46, golsContra: 57 },
  "vitória": { trajetoria: 30, jogos: 35, pontos: 41, golsPro: 37, golsContra: 52 },
  mirassol: { trajetoria: 40, jogos: 36, pontos: 41, golsPro: 39, golsContra: 49 },
  corinthians: { trajetoria: 62, jogos: 35, pontos: 40, golsPro: 40, golsContra: 42 },
  internacional: { trajetoria: 58, jogos: 35, pontos: 38, golsPro: 39, golsContra: 44 },
  "grêmio": { trajetoria: 62, jogos: 35, pontos: 38, golsPro: 38, golsContra: 47 },
  remo: { trajetoria: 30, jogos: 36, pontos: 32, golsPro: 41, golsContra: 61 },
  chapecoense: { trajetoria: 36, jogos: 36, pontos: 21, golsPro: 34, golsContra: 74 },
};

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// HISTÓRIA: títulos oficiais pesquisados em novembro de 2026.
// mundial soma Copa Intercontinental e Mundial de Clubes da FIFA.
// legado: pontos editoriais para o que títulos não medem (eras, ídolos, pioneirismo).
const historicoClubes = {
  "são paulo": { mundial: 3, libertadores: 3, brasileirao: 6, copaDoBrasil: 1, sulAmericana: 1, recopa: 2, supercopa: 1, conmebol: 1, mercosul: 0, legado: 8 },
  santos: { mundial: 2, libertadores: 3, brasileirao: 8, copaDoBrasil: 1, sulAmericana: 0, recopa: 1, supercopa: 0, conmebol: 1, mercosul: 0, legado: 12 },
  flamengo: { mundial: 1, libertadores: 4, brasileirao: 9, copaDoBrasil: 5, sulAmericana: 0, recopa: 1, supercopa: 0, conmebol: 0, mercosul: 1, legado: 0 },
  palmeiras: { mundial: 0, libertadores: 3, brasileirao: 12, copaDoBrasil: 4, sulAmericana: 0, recopa: 1, supercopa: 0, conmebol: 0, mercosul: 1, legado: 9 },
  corinthians: { mundial: 2, libertadores: 1, brasileirao: 7, copaDoBrasil: 4, sulAmericana: 0, recopa: 1, supercopa: 0, conmebol: 0, mercosul: 0, legado: 6 },
  "grêmio": { mundial: 1, libertadores: 3, brasileirao: 2, copaDoBrasil: 5, sulAmericana: 0, recopa: 2, supercopa: 0, conmebol: 0, mercosul: 0, legado: 4 },
  cruzeiro: { mundial: 0, libertadores: 2, brasileirao: 4, copaDoBrasil: 6, sulAmericana: 0, recopa: 1, supercopa: 2, conmebol: 0, mercosul: 0, legado: 4 },
  internacional: { mundial: 1, libertadores: 2, brasileirao: 3, copaDoBrasil: 1, sulAmericana: 1, recopa: 2, supercopa: 0, conmebol: 0, mercosul: 0, legado: 4 },
  "vasco da gama": { mundial: 0, libertadores: 1, brasileirao: 4, copaDoBrasil: 1, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 1, legado: 6 },
  "atletico mg": { mundial: 0, libertadores: 1, brasileirao: 3, copaDoBrasil: 2, sulAmericana: 0, recopa: 1, supercopa: 0, conmebol: 2, mercosul: 0, legado: 4 },
  fluminense: { mundial: 0, libertadores: 1, brasileirao: 4, copaDoBrasil: 1, sulAmericana: 0, recopa: 1, supercopa: 0, conmebol: 0, mercosul: 0, legado: 4 },
  botafogo: { mundial: 0, libertadores: 1, brasileirao: 3, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 1, mercosul: 0, legado: 6 },
  "athletico paranaense": { mundial: 0, libertadores: 0, brasileirao: 1, copaDoBrasil: 1, sulAmericana: 2, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 2 },
  bahia: { mundial: 0, libertadores: 0, brasileirao: 2, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 3 },
  coritiba: { mundial: 0, libertadores: 0, brasileirao: 1, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 3 },
  chapecoense: { mundial: 0, libertadores: 0, brasileirao: 0, copaDoBrasil: 0, sulAmericana: 1, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 2 },
  "vitória": { mundial: 0, libertadores: 0, brasileirao: 0, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 3 },
  remo: { mundial: 0, libertadores: 0, brasileirao: 0, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 3 },
  "red bull bragantino": { mundial: 0, libertadores: 0, brasileirao: 0, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 1 },
  mirassol: { mundial: 0, libertadores: 0, brasileirao: 0, copaDoBrasil: 0, sulAmericana: 0, recopa: 0, supercopa: 0, conmebol: 0, mercosul: 0, legado: 1 },
};

const PESOS_TITULOS = {
  mundial: 12,
  libertadores: 8,
  brasileirao: 4,
  copaDoBrasil: 2,
  sulAmericana: 2,
  recopa: 1,
  supercopa: 1,
  conmebol: 1,
  mercosul: 1,
  legado: 1,
};

function pontosHistoria(nome) {
  const clube = historicoClubes[nome];
  return Object.keys(PESOS_TITULOS).reduce(
    (soma, chave) => soma + clube[chave] * PESOS_TITULOS[chave],
    0,
  );
}

// Converte os pontos em nota de 25 a 100, para clube sem títulos não ficar zerado.
function notaHistoria(nome) {
  const maior = Math.max(...Object.keys(historicoClubes).map(pontosHistoria));
  return Math.round(25 + 75 * Math.pow(pontosHistoria(nome) / maior, 0.75));
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Vida: fase atual + trajetória. Ataque: principalmente história.
// As faixas são curtas de propósito, para time menor poder competir
// e para sobrar espaço aos futuros ups de atributos.
function aplicarBalanceamento(participantes) {
  const campanhas = Object.values(dadosBrasileirao);
  const aproveitamento = (d) => d.pontos / (d.jogos * 3);
  const saldo = (d) => (d.golsPro - d.golsContra) / d.jogos;
  const gols = (d) => d.golsPro / d.jogos;
  const normalizar = (valor, medida) => {
    const valores = campanhas.map(medida);
    const menor = Math.min(...valores);
    const maior = Math.max(...valores);
    return (valor - menor) / (maior - menor);
  };

  participantes.forEach((time) => {
    const d = dadosBrasileirao[time.nome];
    const historia = notaHistoria(time.nome);
    const fase =
      0.7 * normalizar(aproveitamento(d), aproveitamento) +
      0.3 * normalizar(saldo(d), saldo);
    const poder =
      0.45 * (historia / 100) + 0.25 * fase + 0.3 * normalizar(gols(d), gols);

    time.historia = historia;
    time.titulos = historicoClubes[time.nome];
    time.trajetoria = d.trajetoria;
    time.campanha = { ...d, posicao: Object.keys(dadosBrasileirao).indexOf(time.nome) + 1 };
    time.fase = Math.round(fase * 100);
    time.atk = Math.floor(14.6 + 3.6 * poder);
    time.vida = Math.round(85 + 18 * (0.45 * fase + 0.55 * (d.trajetoria / 100)));
  });
}

aplicarBalanceamento(participantes);

function escolhaTime(participantes) {
  let time = prompt("Digite seu time para utilizar seu mascote: ")
    .trim()
    .toLowerCase();

  let i = 0;

  while (time === "") {
    console.log("Nome invalido.");
    time = prompt("Digite seu time: ").trim().toLowerCase();
  }
  while (i < participantes.length) {
    if (
      time === participantes[i].nome ||
      participantes[i].apelidos.includes(time)
    ) {
      console.log("Seu mascote é: " + participantes[i].mascote);
      return participantes[i];
    }

    i++;
  }
  if (i === participantes.length) {
    console.log("Time não joga a Série A, kakakaka R E B A I X A D O");
  }
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Rola o dado de 1 a 10 a cada ataque.
function rolarDado() {
  return Math.floor(Math.random() * 10) + 1;
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Condição de dano: o dado define a porcentagem do ATK usada no golpe.
const FAIXAS_DANO = [
  { ate: 1, tipo: "erro", multiplicador: 0 },
  { ate: 4, tipo: "fraco", multiplicador: 0.6 },
  { ate: 7, tipo: "normal", multiplicador: 1 },
  { ate: 9, tipo: "forte", multiplicador: 1.4 },
  { ate: 10, tipo: "critico", multiplicador: 2 },
];
const LIMITE_CAMISA = 0.35; // vida máxima abaixo da qual a camisa pesa
const BONUS_CAMISA_MINIMO = 0.15; // time de menor história
const BONUS_CAMISA_MAXIMO = 0.35; // time de maior história

// Camisa pesada: todo time acuado reage, e a história aumenta um pouco essa força.
function bonusCamisa(time) {
  const notas = participantes.map((item) => item.historia);
  const menor = Math.min(...notas);
  const maior = Math.max(...notas);
  const proporcao = (time.historia - menor) / (maior - menor);
  return BONUS_CAMISA_MINIMO + (BONUS_CAMISA_MAXIMO - BONUS_CAMISA_MINIMO) * proporcao;
}

function calcularDano(atacante, dado, vidaAtual) {
  const faixa = FAIXAS_DANO.find((item) => dado <= item.ate);
  const camisa = faixa.multiplicador > 0 && vidaAtual <= atacante.vida * LIMITE_CAMISA;
  const bonus = camisa ? 1 + bonusCamisa(atacante) : 1;
  return {
    dano: Math.round(atacante.atk * faixa.multiplicador * bonus),
    tipo: faixa.tipo,
    camisa,
  };
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Prepara a partida sem resolvê-la: a luta agora avança um turno por vez.
function iniciarPartida(jogador, adversario) {
  const quemComeca = Math.floor(Math.random() * 2);
  const atacante = quemComeca === 0 ? jogador : adversario; //define quem vai ser o atacante inicial da rodada

  return {
    jogador,
    adversario,
    vidaJogador: jogador.vida,
    vidaAdversario: adversario.vida,
    pontosPartida: 3,
    primeiroAtacante: atacante,
    atacante,
    encerrada: false,
    batalha: {
      jogador: jogador.nome, //aplica automatico
      adversario: adversario.nome, //aplica automatico
      vencedor: null, //aplicado
      rodadas: 0,
      historicoDanoAplicado: [], //ja apliquei
      historicoDanoRecebido: [], //ja apliquei
      vidaFinal: {
        jogador: 0, //aplicado
        adversario: 0, //aplicado
      },
    },
  };
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Executa UM ataque e devolve tudo que a interface precisa mostrar.
function executarTurno(partida, dado = rolarDado()) {
  if (partida.encerrada) return null;

  const { jogador, adversario, batalha } = partida;
  const atacante = partida.atacante;
  const defensor = atacante === jogador ? adversario : jogador; //define quem vai ser o defensor da rodada
  const vidaAtacante = atacante === jogador ? partida.vidaJogador : partida.vidaAdversario;
  const { dano, tipo, camisa } = calcularDano(atacante, dado, vidaAtacante);

  batalha.rodadas++;

  if (defensor === jogador) {
    //responsavel por definir as rodadas, quando a rodada acaba o defensor se torna o atacante
    partida.vidaJogador = Math.floor(partida.vidaJogador - dano);
    batalha.historicoDanoRecebido.push(dano);
  } else {
    partida.vidaAdversario = Math.floor(partida.vidaAdversario - dano);
    batalha.historicoDanoAplicado.push(dano);
  }
  partida.atacante = defensor;

  if (partida.vidaJogador <= 0 || partida.vidaAdversario <= 0) {
    partida.encerrada = true;
    const vencedor = partida.vidaJogador > 0 ? jogador : adversario;
    const perdedor = vencedor === jogador ? adversario : jogador;
    registrarSaldo(vencedor, perdedor, Math.max(partida.vidaJogador, partida.vidaAdversario));
    vencedor.pontos += partida.pontosPartida; //responsavel por adcionar a pontuaçao da partida a tabela participantes
    batalha.vencedor = vencedor.nome;
    batalha.vidaFinal.jogador = partida.vidaJogador;
    batalha.vidaFinal.adversario = partida.vidaAdversario;
  }

  return {
    rodada: batalha.rodadas,
    atacante,
    defensor,
    dado,
    tipo,
    dano,
    camisa,
    vidaJogador: partida.vidaJogador,
    vidaAdversario: partida.vidaAdversario,
    encerrada: partida.encerrada,
    vencedor: batalha.vencedor,
  };
}

function batalhaJogador(jogador, adversariosJogador) {
  adversariosJogador.sort(() => Math.random() - 0.5); //responsavel por embaralhar a lista de times
  const historicoBatalha = [];

  while (adversariosJogador.length > 0) {
    //loop responsavel pelo status da luta
    // ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
    // O miolo da luta foi movido para iniciarPartida() e executarTurno().
    const partida = iniciarPartida(jogador, adversariosJogador[0]);

    while (!partida.encerrada) {
      //loop responsavel pela luta
      executarTurno(partida);
    }
    historicoBatalha.push(partida.batalha);

    adversariosJogador.splice(0, 1); //responsavel pela remocao do bot
  }
  console.log(historicoBatalha);
  return historicoBatalha; // ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Saldo de vida: critério de desempate da tabela.
function registrarSaldo(vencedor, perdedor, vidaRestante) {
  vencedor.saldo = (vencedor.saldo || 0) + vidaRestante;
  perdedor.saldo = (perdedor.saldo || 0) - vidaRestante;
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// O miolo de batalhaBots() virou uma função para os bots jogarem rodada a rodada.
function batalhaEntreBots(bot1, bot2) {
  //loop responsavel pelo status da luta
  let vidaBot1 = bot1.vida;
  let vidaBot2 = bot2.vida;
  const pontosPartida = 3;

  const quemComeca = Math.floor(Math.random() * 2);
  let atacante = quemComeca === 0 ? bot1 : bot2; //define quem vai ser o atacante inicial da rodada

  while (vidaBot1 > 0 && vidaBot2 > 0) {
    //loop responsavel pela luta

    const defensor = atacante === bot1 ? bot2 : bot1; //define quem vai ser o defensor inicial da rodada

    const vidaAtacante = atacante === bot1 ? vidaBot1 : vidaBot2;
    const { dano } = calcularDano(atacante, rolarDado(), vidaAtacante); //responsavel por definir o dano

    if (defensor === bot1) {
      //responsavel por definir as rodadas, quando a rodada acaba o defensor se torna o atacante
      vidaBot1 -= dano;
    } else {
      vidaBot2 -= dano;
    }
    atacante = defensor;
  }

  if (vidaBot1 > 0) {
    bot1.pontos += pontosPartida; //responsavel por adcionar a pontuaçao da partida a tabela participantes
    registrarSaldo(bot1, bot2, vidaBot1);
  } else {
    bot2.pontos += pontosPartida; //responsavel por adcionar a pontuaçao da partida a tabela participantes (bot)
    registrarSaldo(bot2, bot1, vidaBot2);
  }
}

function batalhaBots(bots) {
  let a = 0;
  while (a < bots.length - 1) {
    let b = a + 1;
    while (b < bots.length) {
      batalhaEntreBots(bots[a], bots[b]); // ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
      b++;
    }

    a++;
  }
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Monta o calendário: em cada rodada todos jogam uma vez e ninguém repete rival.
function montarRodadas(outros) {
  const giro = outros.slice();
  const rodadas = [];
  for (let r = 0; r < outros.length; r++) {
    const jogosBots = [];
    for (let i = 1; i <= (giro.length - 1) / 2; i++) {
      jogosBots.push([giro[i], giro[giro.length - i]]);
    }
    rodadas.push({ adversario: giro[0], jogosBots });
    giro.push(giro.shift());
  }
  return rodadas;
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// Funções usadas pela versão web para conduzir o campeonato rodada a rodada.
function iniciarCampeonato(participantes, jogador) {
  participantes.forEach((time) => {
    time.pontos = 0;
    time.saldo = 0;
  });
  const outros = participantes.filter((time) => time !== jogador);
  outros.sort(() => Math.random() - 0.5); //responsavel por embaralhar a lista de times
  const rodadas = montarRodadas(outros);

  return {
    participantes,
    jogador,
    rodadas,
    rodadaAtual: 0,
    adversariosJogador: rodadas.map((rodada) => rodada.adversario),
    historicoBatalha: [],
    totalPartidas: rodadas.length,
    posicoes: null,
    resumoRodada: null,
  };
}

function proximaPartida(campeonato) {
  return iniciarPartida(campeonato.jogador, campeonato.adversariosJogador[0]);
}

// Compara a tabela atual com a da rodada anterior.
function montarResumoRodada(campeonato) {
  const { participantes, jogador, posicoes: anteriores } = campeonato;
  const rodada = campeonato.rodadaAtual;
  tabelaFinal(participantes);

  const posicoes = new Map(participantes.map((time, i) => [time, i + 1]));
  const tabela = participantes.map((time, i) => {
    const vitorias = time.pontos / 3;
    return {
      time,
      posicao: i + 1,
      variacao: anteriores ? anteriores.get(time) - (i + 1) : null,
      vitorias,
      derrotas: rodada - vitorias,
      saldo: time.saldo,
      pontos: time.pontos,
    };
  });
  campeonato.posicoes = posicoes;

  return {
    rodada,
    totalRodadas: campeonato.totalPartidas,
    tabela,
    linhaJogador: tabela[posicoes.get(jogador) - 1],
    proximo: campeonato.adversariosJogador[0] || null,
  };
}

function registrarPartida(campeonato, partida) {
  const rodada = campeonato.rodadas[campeonato.rodadaAtual];
  campeonato.historicoBatalha.push(partida.batalha);
  campeonato.adversariosJogador.splice(0, 1); //responsavel pela remocao do bot
  rodada.jogosBots.forEach(([bot1, bot2]) => batalhaEntreBots(bot1, bot2));
  campeonato.rodadaAtual++;
  campeonato.resumoRodada = montarResumoRodada(campeonato);
  return campeonato.adversariosJogador.length > 0;
}

function encerrarCampeonato(campeonato) {
  tabelaFinal(campeonato.participantes);
  return campeonato.participantes;
}

function tabelaFinal(participantes) {
  participantes.sort((a, b) => {
    return b.pontos - a.pontos || (b.saldo || 0) - (a.saldo || 0); // ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
  });
}

function serieABattle(participantes) {
  // ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
  // Pede o time novamente em vez de quebrar quando o nome não é encontrado.
  let jogador = escolhaTime(participantes);
  while (!jogador) {
    jogador = escolhaTime(participantes);
  }
  const adversariosJogador = participantes.slice(); //cria uma copia da lista original de participantes
  const bots = participantes.slice();
  const indexTime = adversariosJogador.indexOf(jogador, adversariosJogador); //manipula o indice do objeto (time) que foi escolhido
  adversariosJogador.splice(indexTime, 1); //retina o valor do time escolhido pelo usuário da cópia da lista de participantes
  bots.splice(indexTime, 1); //retina o valor do time escolhido pelo usuário da cópia da lista de bots

  batalhaJogador(jogador, adversariosJogador);
  batalhaBots(bots);
  tabelaFinal(participantes);
  console.log(jogador);

  let i = 0;
  while (i < participantes.length) {
    console.log(
      participantes[i].nome + " - " + participantes[i].pontos + " pontos",
    );
    i++;
  }
}

// ALTERAÇÃO NECESSÁRIA PARA INTEGRAÇÃO COM O FRONT-END
// No navegador expõe a lógica para a interface; no Node mantém o jogo de terminal.
if (typeof window !== "undefined") {
  window.SerieABattle = {
    participantes,
    rolarDado,
    calcularDano,
    LIMITE_CAMISA,
    FAIXAS_DANO,
    bonusCamisa,
    iniciarPartida,
    executarTurno,
    iniciarCampeonato,
    proximaPartida,
    registrarPartida,
    encerrarCampeonato,
  };
} else {
  serieABattle(participantes);
}
