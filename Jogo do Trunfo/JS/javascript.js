  // Função para realizar uma rodada do jogo
  jogarRodada() {
    this.rodadas++;
    console.log(`Rodada ${this.rodadas}:`);

    const atributoEscolhido = this.escolherAtributoAleatorio();
    console.log(`Atributo escolhido: ${atributoEscolhido}`);

    // Cada jogador escolhe uma carta aleatória de sua mão
    let cartasEscolhidas = [];
    this.jogadores.forEach(jogador => {
      const cartaEscolhida = this.cartasJogadores[jogador].pop();
      cartasEscolhidas.push({ jogador, cartaEscolhida });
    });

    // Determinar o vencedor com base no atributo escolhido
    const vencedor = this.compararCartas(cartasEscolhidas, atributoEscolhido);
    console.log(`${vencedor.jogador} venceu a rodada e levou as cartas!`);

    // O vencedor pega todas as cartas da rodada
    this.cartasJogadores[vencedor.jogador].push(...cartasEscolhidas.map(item => item.cartaEscolhida));
  }

  // Função para escolher aleatoriamente um atributo para comparação
  escolherAtributoAleatorio() {
    const atributos = ["volume", "profundidade", "biodiversidade", "importancia"];
    return atributos[Math.floor(Math.random() * atributos.length)];
  }

  // Função para comparar as cartas de acordo com o atributo escolhido
  compararCartas(cartasEscolhidas, atributo) {
    const valores = cartasEscolhidas.map(item => item.cartaEscolhida[atributo]);
    const maiorValor = Math.max(...valores);

    // Encontrar o jogador que teve o maior valor para o atributo
    return cartasEscolhidas.find(item => item.cartaEscolhida[atributo] === maiorValor);
  }

  // Função para determinar o vencedor final
  determinarVencedor() {
    let vencedor = { jogador: "", cartas: 0 };
    this.jogadores.forEach(jogador => {
      const numCartas = this.cartasJogadores[jogador].length;
      if (numCartas > vencedor.cartas) {
        vencedor = { jogador, cartas: numCartas };
      }
    });

    console.log(`O vencedor do jogo é: ${vencedor.jogador} com ${vencedor.cartas} cartas.`);
  }

  // Função para iniciar o jogo
  jogar() {
    while (this.rodadas < this.maxRodadas) {
      this.jogarRodada();
    }
    this.determinarVencedor();
  }
}
