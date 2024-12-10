let jogadores = [];
let cartas = []; // Aqui estarão as cartas embaralhadas
let cartasJogadores = {}; // Armazenar as cartas para cada jogador
let cartaSelecionada = null; // A carta que foi escolhida pelo jogador da vez
let atributoEscolhido = null; // Atributo escolhido para a comparação

// Função para carregar as cartas do arquivo JSON
async function carregarCartas() {
    const response = await fetch('.././JS/dados_recursos_hidricos.json');
    const dados = await response.json();
    cartas = Object.values(dados); // Pega os valores das cartas
    embaralharCartas(); // Chama a função para embaralhar as cartas
}

// Função para embaralhar as cartas
function embaralharCartas() {
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
}

// Função para distribuir as cartas entre os jogadores
function distribuirCartas() {
    const numJogadores = jogadores.length;
    const cartasPorJogador = Math.floor(cartas.length / numJogadores);

    // Limpa o objeto de cartas dos jogadores
    cartasJogadores = {};

    // Distribui as cartas
    for (let i = 0; i < numJogadores; i++) {
        cartasJogadores[jogadores[i]] = cartas.slice(i * cartasPorJogador, (i + 1) * cartasPorJogador);
    }
}

// Função para iniciar a rodada
function iniciarRodada() {
    // Se ainda houver cartas disponíveis para o jogador da vez
    if (cartasJogadores[jogadores[0]].length > 0) {
        exibirCarta(jogadores[0]);
    }
    // Limpar a seleção do atributo
    atributoEscolhido = null;
}

// Função para exibir a carta do jogador da vez
function exibirCarta(jogador) {
    const carta = cartasJogadores[jogador].shift(); // Retira a carta do jogador
    cartaSelecionada = carta; // Guarda a carta para uso posterior
    document.getElementById(`frame1`).classList.add('exibir'); // Exibe a carta do jogador atual
    document.getElementById('ctrl').innerHTML = `
        <h2>Escolha um Atributo ${jogador}</h2>
        <button onclick="atributo('volume')">Volume de Água</button>
        <button onclick="atributo('profundidade')">Profundidade Média</button>
        <button onclick="atributo('biodiversidade')">Biodiversidade</button>
        <button onclick="atributo('importancia')">Importância Econômica</button>
    `;
}

// Função chamada ao selecionar o atributo
function atributo(atributo) {
    atributoEscolhido = atributo;
    // Exibir um novo botão para avançar a rodada
    document.getElementById("ctrl").innerHTML += `
        <button onclick="avancarRodada()">Avançar Rodada</button>
    `;
}

// Função para avançar a rodada
function avancarRodada() {
    const atributoValor = cartaSelecionada[atributoEscolhido]; // Pega o valor do atributo escolhido

    // Comparar as cartas entre os jogadores
    compararCartas(atributoValor);
}
// Função para comparar as cartas e determinar o vencedor da rodada
function compararCartas(atributoValor) {
    let cartaVencedora = cartaSelecionada;
    let vencedor = jogadores[0]; // Inicialmente, assume-se que o vencedor é o jogador da vez (jogador 0)
    let maiorValor = atributoValor;

    // Exibir a carta do jogador atual (com a classe 'exibir')
    document.getElementById("frame1").classList.add('exibir');

    // Iterar sobre os outros jogadores (começando do índice 1, pois o índice 0 é o jogador da vez)
    for (let i = 1; i < jogadores.length; i++) {
        // Pega a carta do jogador em questão
        const cartaJogador = cartasJogadores[jogadores[i]].shift(); // Remove a carta da mão do jogador
        // Pega o valor do atributo escolhido para comparação
        const atributoJogador = cartaJogador[atributoEscolhido];

        // Verifica se o jogador tem o maior valor para o atributo
        if (atributoJogador > maiorValor) {
            maiorValor = atributoJogador;
            vencedor = jogadores[i];  // Atualiza o vencedor
            cartaVencedora = cartaJogador;  // Atualiza a carta vencedora
        }
        // Caso de empate (mesmo valor no atributo), faz o desempate
        else if (atributoJogador === maiorValor) {
            // Caso de empate, escolhe aleatoriamente um atributo para desempatar
            const atributosPossiveis = ['volume', 'profundidade', 'biodiversidade', 'importancia'];
            const desempateAtributo = atributosPossiveis[Math.floor(Math.random() * atributosPossiveis.length)];
            compararCartas(cartaVencedora[desempateAtributo]);  // Rechama a comparação com o desempate
            return; // Saímos da função após o desempate
        }
    }

    // Se nenhum empate for encontrado, atualiza o vencedor e a carta vencedora
    atualizarVencedor(vencedor, cartaVencedora);
}

// Função para atualizar o vencedor da rodada
function atualizarVencedor(vencedor, cartaVencedora, cartasDisputadas) {
    // Mostrar o vencedor da rodada
    alert(`O vencedor da rodada é ${vencedor} com a carta ${cartaVencedora.nome}`);

    // Transferir as cartas disputadas para a mão do vencedor
    for (let i = 0; i < cartasDisputadas.length; i++) {
        // Adicionar a carta disputada na mão do vencedor
        cartasJogadores[vencedor].push(cartasDisputadas[i]);
        
        // Limpar a carta disputada da mão do jogador
        const index = cartasJogadores[cartasDisputadas[i].jogador].indexOf(cartasDisputadas[i]);
        if (index !== -1) {
            cartasJogadores[cartasDisputadas[i].jogador].splice(index, 1); // Remove a carta do jogador
        }
    }

    // Atualiza o display dos jogadores com a nova carta
    for (let i = 1; i <= jogadores.length; i++) {
        document.getElementById(`frame${i}`).classList.remove('exibir'); // Remover a classe 'exibir' das cartas
    }

    // Chama a função para iniciar a próxima rodada
    iniciarRodada();
}


// Função para obter os participantes do jogo
function obterParticipantes() {
    const jogadores = [];
    const a = document.getElementsByClassName("frame");
    const b = [];

    while (b.length < a.length) {
        const c = Math.floor(Math.random() * (a.length));
        if (b.indexOf(c + 1) === -1) {
            b.push(c + 1);
        }
    }

    for (let i = 1; i <= b.length; i++) {
        const nomeJogador = document.getElementById(`parcipantes${b[i - 1]}`).value.trim();
        if (nomeJogador) {
            jogadores.push(nomeJogador); // Adiciona jogador se o campo estiver preenchido
            document.getElementById(`frame${i}`).style.display = 'block';
            document.getElementById(`frame${i}`).getElementsByClassName('jogador')[0].innerHTML = nomeJogador;
        }
    }

    document.getElementById("ctrl").innerHTML = `
        <h2>Escolha um Atributo ${jogadores[0]}</h2>
        <button onclick="atributo('volume')">Volume de Água</button>
        <button onclick="atributo('profundidade')">Profundidade Média</button>
        <button onclick="atributo('biodiversidade')">Biodiversidade</button>
        <button onclick="atributo('importancia')">Importância Econômica</button>
        <button type="button" onclick="iniciarRodada()">Próxima Rodada</button>
    `;
    document.getElementById("cards").style.display = "none";

    return jogadores;
}
