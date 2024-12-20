let jogadores = [];
let nomesParticipante = []; //Nome dos Participntes
let cartas = {}; // Aqui estarão as cartas embaralhadas
let cartasJogadores = {}; // Armazenar as cartas para cada jogador
let cartaSelecionada = null; // A carta que foi escolhida pelo jogador da vez
let atributoEscolhido = null; // Atributo escolhido para a comparação
let vez = -1;
let cartasDisputadas = [];

// Função para carregar as cartas do arquivo JSON
async function carregarCartas() {
    const response = await fetch('../JS/dados_recursos_hidricos.json');
    const dados = await response.json();
    cartas = Object.keys(dados).map(chave => {
        return {
            key: chave,
            ...dados[chave]
        };
    });
    embaralharCartas(); // Chama a função para embaralhar as cartas
    distribuirCartas(); // Chama a função para distribuir as cartas
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
    let cartasPorJogador = Math.floor(cartas.length / jogadores.length); 
    // Distribui as cartas para os jogadores
    for (let i = 0; i < jogadores.length; i++) {
        // Calcula o índice inicial e final das cartas para o jogador
        const inicio = i * cartasPorJogador;
        const fim = inicio + cartasPorJogador;
        cartasJogadores[nomesParticipante[i]] = Object.values(cartas).slice(inicio, fim);  // Atribui as cartas ao jogador
    }
}

// Função para iniciar a rodada
function iniciarRodada() {
    if(vez==jogadores.length){vez = 0}
    else{vez++};
    attrButton();
    cartasDisputadas = [] //Limpa da memoria as cartas disputadas
    document.getElementById('status').innerHTML += "";
    if (cartasJogadores[nomesParticipante[vez]].length > 0) {// Se ainda houver cartas disponíveis para o jogador da vez
        exibirCarta(jogadores[vez]);
    };
    atributoEscolhido = null;// Limpar a seleção do atributo
    ocultarCartas()
}
// Função para exibir a carta do jogador
function exibir(carta,i) {
    const c = carta;  // A carta do jogador
    const chaveCarta = c.key;  // Chave da carta
    const nome = c.nome; // Nome do recurso hídrico
    const volume = c.volume;  // Volume de água
    const profundidade = c.profundidade;  // Profundidade média
    const biodiversidade = c.biodiversidade;  // Biodiversidade
    const importancia = c.importancia;  // Importância econômica
    // Exibe a carta no HTML (a classe 'back' será preenchida com as informações)
    document.querySelector(`#frame${i + 1} .back`).innerHTML  = `<h3>${chaveCarta}: ${nome}</h3>
        <div><img src="../IMAGEM/${nome}.jpg" alt="${nome}"/></div>
        <p>Volume de Água: ${volume} Km³</p>
        <p>Profundidade Média: ${profundidade} m</p>
        <p>Biodiversidade: ${biodiversidade} espécies</p>
        <p>Importância Econômica: ${importancia}</p>`;

    // Exibe a carta do jogador atual (exibindo frame específico)
    setTimeout(function(){document.getElementById(`frame${i+1}`).classList.add('exibir'); }, 500)
    
}

// Função para exibir a carta do jogador da vez e exibir as opções de atributos
function exibirCarta() {
    const carta = cartasJogadores[nomesParticipante[vez]].shift(); // Retira a carta do jogador da vez
    cartasDisputadas.push(carta);
    cartaSelecionada = carta; // Guarda a carta para uso posterior
    exibir(cartaSelecionada,vez);
}

// Função chamada ao selecionar o atributo
function atributo(atributo) {
    atributoEscolhido = atributo;
    avancarRodada();
    document.getElementById('status').innerHTML += `<p>ATRIBUTO: ${atributo}<p>`;
}

// Função para avançar a rodada
function avancarRodada() {
    const atributoValor = cartaSelecionada[atributoEscolhido]; // Pega o valor do atributo escolhido
    // Comparar as cartas entre os jogadores
    compararCartas(atributoEscolhido);
}

// Função para comparar as cartas e determinar o vencedor da rodada
function compararCartas(atributoValor) {
    let cartaVencedora = cartaSelecionada;
    let vencedor = jogadores[vez]; // Inicialmente, assume-se que o vencedor é o jogador da vez
    let maiorValor = atributoValor; // Atributo da carta do jogador da vez

    // Iterar sobre os outros jogadores 
    for (var i = 0; i < jogadores.length; i++) {
        if(i==vez){
            continue
        };
        // Pega a carta do jogador em questão
            const cartaJogador = cartasJogadores[nomesParticipante[i]].shift(); // Remove a carta da mão do jogador
            exibir(cartaJogador,i);
            // Pega o valor do atributo escolhido para comparação
            cartasDisputadas.push(cartaJogador);
            const atributoJogador = cartaJogador[atributoEscolhido];
    
            // Verifica se o jogador tem o maior valor para o atributo
            if (atributoJogador > maiorValor) {
                maiorValor = atributoJogador;
                vencedor = jogadores[i];  // Atualiza o vencedor
                cartaVencedora = cartaJogador;  // Atualiza a carta vencedora
                continue
            }while(atributoJogador == maiorValor){
                let a = ["volume","importancia","profundidade","biodiversidade"];
                let c = Math.floor(Math.random() * a.length);               
    
                // Verifica se o jogador tem o maior valor para o atributo
                if (cartaJogador[a[c]] > cartaSelecionada[a[c]]) {
                    maiorValor = atributoJogador;
                    vencedor = jogadores[i];  // Atualiza o vencedor
                    cartaVencedora = cartaJogador;  // Atualiza a carta vencedora
                    document.getElementById('status').innerHTML += `<p>EMPATE ${nomesParticipante[vez]} e nomesParticipante[i]: Atributo aleatorizado: ${a[c]}<p>`;
                    break
                }
            }
    }
    // Se nenhum empate for encontrado, atualiza o vencedor e a carta vencedora
    atualizarVencedor(vencedor, cartaVencedora);
}

// Função para atualizar o vencedor da rodada
function atualizarVencedor(vencedor, cartaVencedora) {
        // Transferir as cartas disputadas para a mão do vencedor
    for (let i = 0; i < cartasDisputadas.length; i++) {
        // Adicionar a carta disputada na mão do vencedor
        cartasJogadores[nomesParticipante[vencedor]].push(cartasDisputadas[i]);
    }
    // Chama a função para iniciar a próxima rodada
    document.getElementById("ctrl").innerHTML = '<button type="button" onclick="iniciarRodada()">Próxima Rodada</button>';
    
    // Mostrar o vencedor da rodada
    document.getElementById('status').innerHTML += `<p>VENCEDOR: ${nomesParticipante[vencedor]}}<p>`;
    alert(`O vencedor da rodada é ${nomesParticipante[vencedor]}`);
}
function ocultarCartas(){
    // Atualiza o display dos jogadores com a nova carta
    for (let i = 1; i <= jogadores.length; i++) {
        document.getElementById(`frame${i}`).classList.remove('exibir'); // Remover a classe 'exibir' das cartas
    }
}
// Função para obter os participantes do jogo
function obterParticipantes() {
    const a = document.getElementsByClassName("frame");
    const b = [];

    while (b.length < a.length) {
        let c = Math.floor(Math.random() * (a.length));
        if (b.indexOf(c + 1) === -1) {
            b.push(c + 1);
        }
    }
    for (let i = 1; i <= b.length; i++) {
        const nomeJogador = document.getElementById(`parcipantes${b[i - 1]}`).value.trim();
        if (nomeJogador) {
            jogadores.push(b[i - 1]); // Adiciona jogador se o campo estiver preenchido
            nomesParticipante.push(nomeJogador);// Adiciona nome se o campo estiver preenchido
            document.getElementById(`frame${i}`).style.display = 'block';
            document.getElementById(`frame${i}`).getElementsByClassName('jogador')[0].innerHTML = nomeJogador;
        }
    }
    return jogadores;
}
function attrButton(){
    document.getElementById("ctrl").innerHTML = `
            <h2>Escolha um Atributo ${nomesParticipante[0]}</h2>
            <button onclick="atributo('volume')">Volume de Água</button>
            <button onclick="atributo('profundidade')">Profundidade Média</button>
            <button onclick="atributo('biodiversidade')">Biodiversidade</button>
            <button onclick="atributo('importancia')">Importância Econômica</button>
            `;
}
// Função para iniciar o jogo
function iniciarJogo() {
    // Obter os jogadores e garantir que o número de jogadores seja válido
    jogadores = obterParticipantes();
    if (jogadores.length < 2 || jogadores.length > 4) {
        alert("O jogo deve ter entre 2 e 4 jogadores.");
        return;
    }
    document.getElementById("btn").style.display = "none";
    document.getElementById("ctrl").innerHTML = '<button type="button" onclick="iniciarRodada()">Começar</button>'
    
    // Embaralhar as cartas e Distribui as cartas
    carregarCartas();
    
    alert(`O jogo começa com ${nomesParticipante[0]}`);
    
    document.getElementById("cards").style.display = "none";
};
