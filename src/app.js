// Ponto de entrada: alterna entre seleção, batalha e classificação.
(() => {
  const telas = {
    selecao: document.querySelector("#tela-selecao"),
    batalha: document.querySelector("#tela-batalha"),
    tabela: document.querySelector("#tela-tabela"),
  };

  const mostrar = (nome) => {
    Object.entries(telas).forEach(([chave, tela]) => {
      tela.hidden = chave !== nome;
    });
    document.body.dataset.tela = nome;
    window.scrollTo(0, 0);
  };

  const classificacao = new UI.StandingsTable(document.querySelector("#tabela"), () => mostrar("selecao"));

  const batalha = new UI.BattleScreen((tabela, jogador, historico) => {
    classificacao.mostrar(tabela, jogador, historico);
    mostrar("tabela");
  });

  const jogarCom = (time) => {
    mostrar("batalha");
    batalha.comecar(time);
  };
  const info = new UI.TeamInfo(document.querySelector("#info-time"), jogarCom);

  new UI.TeamSelect(document.querySelector("#lista-times"), SerieABattle.participantes, jogarCom, (time) => info.abrir(time));

  mostrar("selecao");
})();
