// BattleScreen: liga os componentes às funções do jogo.js.
// Regras, dano e pontos ficam somente na lógica; aqui só se exibe o resultado.
window.UI = window.UI || {};

UI.BattleScreen = class BattleScreen {
  constructor(aoTerminar) {
    this.aoTerminar = aoTerminar;
    this.placarEstadio = document.querySelector("#placar-estadio");
    this.placarPartida = document.querySelector("#placar-partida");
    this.placarRodada = document.querySelector("#placar-rodada");
    this.cena = new UI.BattleScene(document.querySelector("#arena"));
    this.personagemJogador = new UI.PlayerCharacter(document.querySelector("#lutador-jogador"));
    this.personagemAdversario = new UI.EnemyCharacter(document.querySelector("#lutador-adversario"));
    this.statusJogador = new UI.PlayerStatus(document.querySelector("#status-jogador"));
    this.statusAdversario = new UI.EnemyStatus(document.querySelector("#status-adversario"));
    this.log = new UI.BattleLog(document.querySelector("#registro"));
    this.dado = new UI.DiceRoller(document.querySelector("#dado"));
    this.acoes = new UI.ActionPanel(document.querySelector("#acoes"), (acao) => this.executar(acao));
    this.resumo = new UI.RoundSummary(document.querySelector("#resumo-rodada"), () => this.continuarCampeonato());
  }

  comecar(jogador) {
    this.campeonato = SerieABattle.iniciarCampeonato(SerieABattle.participantes, jogador);
    this.cena.redesenhar();
    this.abrirPartida();
  }

  executar(acao) {
    if (acao === "rolar") this.jogarTurno();
    if (acao === "rodada") this.resumo.mostrar(this.campeonato.resumoRodada, this.campeonato.jogador);
  }

  continuarCampeonato() {
    if (this.campeonato.adversariosJogador.length > 0) {
      this.abrirPartida();
      return;
    }
    const tabela = SerieABattle.encerrarCampeonato(this.campeonato);
    this.aoTerminar(tabela, this.campeonato.jogador, this.campeonato.historicoBatalha);
  }

  async abrirPartida() {
    const c = this.campeonato;
    const partida = SerieABattle.proximaPartida(c);
    const numero = c.totalPartidas - c.adversariosJogador.length + 1;
    this.partida = partida;

    this.personagemJogador.definir(partida.jogador);
    this.personagemAdversario.definir(partida.adversario);
    this.statusJogador.definir(partida.jogador);
    this.statusAdversario.definir(partida.adversario);
    const mandante = UI.mandante(numero, partida.jogador, partida.adversario);
    const estadio = this.cena.usarEstadio(mandante);
    this.placarEstadio.textContent = estadio;
    this.placarPartida.textContent = `Partida ${numero}/${c.totalPartidas}`;
    this.placarRodada.textContent = "Rodada 1";
    this.dado.limpar();
    this.log.limpar();
    this.acoes.bloquear("Preparando...");

    const nomeJ = partida.jogador.mascote;
    const nomeA = partida.adversario.mascote;
    this.cena.mostrarFaixa(`${nomeJ} x ${nomeA}`, "faixa-inicio");
    this.log.escrever(`${estadio}: ${nomeJ} contra ${nomeA}. A batalha começou!`);
    await UI.esperar(1250);
    this.cena.esconderFaixa();
    this.log.escrever(`${partida.primeiroAtacante.mascote} começa atacando.`);
    this.prepararTurno();
  }

  prepararTurno() {
    const partida = this.partida;
    const vezJogador = partida.atacante === partida.jogador;
    this.statusJogador.marcarVez(vezJogador);
    this.statusAdversario.marcarVez(!vezJogador);
    this.placarRodada.textContent = `Rodada ${partida.batalha.rodadas + 1}`;

    if (vezJogador) {
      this.acoes.habilitar("rolar", "Rolar dado");
    } else {
      this.acoes.bloquear("Vez do rival");
      UI.esperar(650).then(() => this.jogarTurno());
    }
  }

  async jogarTurno() {
    const partida = this.partida;
    this.acoes.bloquear("Rolando...");

    const turno = SerieABattle.executarTurno(partida);
    await this.dado.rolar(turno);

    const atacouJogador = turno.atacante === partida.jogador;
    const atacante = atacouJogador ? this.personagemJogador : this.personagemAdversario;
    const defensor = atacouJogador ? this.personagemAdversario : this.personagemJogador;
    const nomes = { fraco: "fraco", normal: "normal", forte: "forte", critico: "crítico" };

    if (turno.tipo === "erro") {
      this.log.escrever(`${turno.atacante.mascote} tirou 1: bola na trave, sem dano!`);
      await atacante.atacar();
      this.prepararTurno();
      return;
    }

    if (turno.camisa) this.log.escrever(`A camisa pesou: ${turno.atacante.mascote} reage com mais força!`, "linha-camisa");
    this.log.escrever(`${turno.atacante.mascote} tirou ${turno.dado}: golpe ${nomes[turno.tipo]}!`, turno.tipo === "critico" ? "linha-critico" : "");
    const golpe = atacante.atacar();
    await UI.esperar(300);
    this.cena.mostrarDano(defensor.elemento, turno.dano, turno.tipo);
    const reacao = defensor.sofrerDano();
    this.statusJogador.atualizar(turno.vidaJogador);
    this.statusAdversario.atualizar(turno.vidaAdversario);
    await Promise.all([golpe, reacao]);

    const vidaDefensor = Math.max(0, atacouJogador ? turno.vidaAdversario : turno.vidaJogador);
    this.log.escrever(`${turno.defensor.mascote} perdeu ${turno.dano} de vida e ficou com ${vidaDefensor}.`);

    if (turno.encerrada) this.fecharPartida(turno);
    else this.prepararTurno();
  }

  fecharPartida(turno) {
    const partida = this.partida;
    const venceu = turno.vencedor === partida.jogador.nome;
    this.statusJogador.marcarVez(false);
    this.statusAdversario.marcarVez(false);
    this.statusJogador.atualizar(partida.vidaJogador);
    this.statusAdversario.atualizar(partida.vidaAdversario);

    (venceu ? this.personagemJogador : this.personagemAdversario).vencer();
    (venceu ? this.personagemAdversario : this.personagemJogador).perder();
    this.cena.mostrarFaixa(venceu ? "Vitória! +3 pts" : "Derrota", venceu ? "faixa-vitoria" : "faixa-derrota");
    this.log.escrever(venceu
      ? `${partida.jogador.mascote} venceu e ganhou 3 pontos!`
      : `${partida.adversario.mascote} venceu a partida.`, venceu ? "linha-vitoria" : "linha-derrota");

    SerieABattle.registrarPartida(this.campeonato, partida);
    this.acoes.habilitar("rodada", "Ver tabela");
  }
};
