// Função para obter os nomes dos participantes a partir dos campos de entrada
function obterParticipantes() {
    const jogadores = [];
    for (let i = 1; i <= 4; i++) {
        const nomeJogador = document.getElementById(`parcipantes${i}`).value.trim();
        if (nomeJogador) {
            jogadores.push(nomeJogador); // Adiciona jogador se o campo estiver preenchido
        }
    }
    return jogadores;
}

// Função para obter os nomes dos participantes a partir dos campos de entrada
function obterParticipantes() {
    const jogadores = [];
    for (let i = 1; i <= 4; i++) {
        const nomeJogador = document.getElementById(`parcipantes${i}`).value.trim();
        if (nomeJogador) {
            jogadores.push(nomeJogador); // Adiciona jogador se o campo estiver preenchido
        }
    }
    return jogadores;
}

// Classe JogoSuperTrunfo
class JogoSuperTrunfo {
    constructor(jogadores) {
        this.jogadores = jogadores;
        this.cartas = Object.values(cartas); // Assumindo que 'cartas' foi definido conforme seu JSON
        this.rodadas = 0;
        this.maxRodadas = 10; // Número máximo de rodadas
        this.cartasJogadores = this.distribuirCartas();
    }

    distribuirCartas() {
        const cartasJogadores = {};
        const cartasDistribuidas = [...this.cartas];
        
        // Inicializa cartas vazias para os jogadores
        this.jogadores.forEach(jogador => {
            cartasJogadores[jogador] = [];
        });

        // Distribui as cartas igualmente entre os jogadores
        while (cartasDistribuidas.length > 0) {
            this.jogadores.forEach(jogador => {
                if (cartasDistribuidas.length > 0) {
                    const carta = cartasDistribuidas.pop();
                    cartasJogadores[jogador].push(carta);
                }
            });
        }
        return cartasJogadores;
    }

    jogarRodada() {
        this.rodadas++;
        console.log(`Rodada ${this.rodadas}:`);

        const atributoEscolhido = this.escolherAtributoAleatorio();
        console.log(`Atributo escolhido: ${atributoEscolhido}`);

        let cartasEscolhidas = [];
        this.jogadores.forEach(jogador => {
            const cartaEscolhida = this.cartasJogadores[jogador].pop();
            cartasEscolhidas.push({ jogador, cartaEscolhida });
        });

        const vencedor = this.compararCartas(cartasEscolhidas, atributoEscolhido);
        console.log(`${vencedor.jogador} venceu a rodada e levou as cartas!`);

        this.cartasJogadores[vencedor.jogador].push(...cartasEscolhidas.map(item => item.cartaEscolhida));
    }

    escolherAtributoAleatorio() {
        const atributos = ["volume", "profundidade", "biodiversidade", "importancia"];
        return atributos[Math.floor(Math.random() * atributos.length)];
    }

    compararCartas(cartasEscolhidas, atributo) {
        const valores = cartasEscolhidas.map(item => item.cartaEscolhida[atributo]);
        const maiorValor = Math.max(...valores);
        return cartasEscolhidas.find(item => item.cartaEscolhida[atributo] === maiorValor);
    }

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

    jogar() {
        while (this.rodadas < this.maxRodadas) {
            this.jogarRodada();
        }
        this.determinarVencedor();
    }
}

// Função que inicia o jogo a partir dos participantes
function iniciarJogo() {
    const jogadores = obterParticipantes(); // Obtém os jogadores preenchidos
    if (jogadores.length < 2) {
        alert("O jogo precisa de pelo menos 2 participantes!");
        return;
    }

    const jogo = new JogoSuperTrunfo(jogadores);
    jogo.jogar(); // Inicia o jogo
}
