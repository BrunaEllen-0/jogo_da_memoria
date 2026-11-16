// 8 símbolos diferentes (formarão 16 cartas)
const simbolos = ['🚀', '🍕', '🐶', '🎸', '🎮', '🌟', '🍎', '⚽'];

// Variáveis de controle do jogo
let jogadorAtual = 1;
let pontosJ1 = 0;
let pontosJ2 = 0;
let paresEncontrados = 0;

let primeiraCarta = null;
let segundaCarta = null;
let travarTabuleiro = false;

// Elementos da tela (DOM)
const tabuleiro = document.getElementById('tabuleiro');
const statusVez = document.getElementById('status-vez');
const placarJ1 = document.getElementById('placar-j1');
const placarJ2 = document.getElementById('placar-j2');
const textoPontosJ1 = document.getElementById('pontos-j1');
const textoPontosJ2 = document.getElementById('pontos-j2');
const secaoFimJogo = document.getElementById('fim-jogo');
const mensagemResultado = document.getElementById('mensagem-resultado');
const btnReiniciar = document.getElementById('btn-reiniciar');
const animacaoJogo = document.getElementById('animacao-jogo');
const textoAnimacao = document.getElementById('texto-animacao');


function esperar(milissegundos) {
    return new Promise((resolver) => setTimeout(resolver, milissegundos));
}

async function exibirAnimacao(mensagens, duracao) {
    animacaoJogo.classList.remove('escondido');

    for (const mensagem of mensagens) {
        textoAnimacao.textContent = mensagem;
        textoAnimacao.classList.remove('animar-texto');
        void textoAnimacao.offsetWidth;
        textoAnimacao.classList.add('animar-texto');
        await esperar(duracao);
    }

    animacaoJogo.classList.add('escondido');
}

// Função para embaralhar um array (Algoritmo Fisher-Yates)
function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

// Inicia ou reinicia a partida
async function iniciarJogo() {
    // Reseta estados
    jogadorAtual = 1;
    pontosJ1 = 0;
    pontosJ2 = 0;
    paresEncontrados = 0;
    primeiraCarta = null;
    segundaCarta = null;
    travarTabuleiro = true;
    secaoFimJogo.classList.add('escondido');
    tabuleiro.classList.remove('escondido');

    // Atualiza placares e visual inicial
    textoPontosJ1.textContent = '0';
    textoPontosJ2.textContent = '0';
    atualizarVisualVez();

    // Cria baralho duplicado e embaralha
    const baralho = embaralhar([...simbolos, ...simbolos]);
    tabuleiro.innerHTML = '';

    // Gera as 16 cartas no HTML
    baralho.forEach((simbolo) => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.simbolo = simbolo;

        carta.innerHTML = `
            <div class="frente">${simbolo}</div>
            <div class="verso">❓</div>
        `;

        carta.addEventListener('click', () => virarCarta(carta));
        tabuleiro.appendChild(carta);
    });

    await exibirAnimacao(['Prepare-se!', '3', '2', '1', 'Valendo!'], 650);
    travarTabuleiro = false;
}

// Lógica ao clicar em uma carta
function virarCarta(carta) {
    // Impede clicar se o tabuleiro estiver travado, na mesma carta ou em carta já virada
    if (travarTabuleiro || carta === primeiraCarta || carta.classList.contains('virada')) {
        return;
    }

    carta.classList.add('virada');

    if (!primeiraCarta) {
        primeiraCarta = carta;
        return;
    }

    segundaCarta = carta;
    verificarPar();
}

// Compara as duas cartas viradas
function verificarPar() {
    const saoIguais = primeiraCarta.dataset.simbolo === segundaCarta.dataset.simbolo;

    if (saoIguais) {
        // Marca como encontradas e mantém viradas
        primeiraCarta.classList.add('encontrada');
        segundaCarta.classList.add('encontrada');
        
        // Soma ponto ao jogador atual e mantém a vez dele
        if (jogadorAtual === 1) {
            pontosJ1++;
            textoPontosJ1.textContent = pontosJ1;
        } else {
            pontosJ2++;
            textoPontosJ2.textContent = pontosJ2;
        }

        paresEncontrados++;
        resetarJogada();

        // Verifica se todos os 8 pares foram encontrados
        if (paresEncontrados === simbolos.length) {
            finalizarPartida();
        }
    } else {
        // Se diferentes, aguarda 1 segundo, desvira e troca a vez
        travarTabuleiro = true;
        setTimeout(() => {
            primeiraCarta.classList.remove('virada');
            segundaCarta.classList.remove('virada');
            resetarJogada();
            trocarVez();
        }, 1000);
    }
}

function resetarJogada() {
    primeiraCarta = null;
    segundaCarta = null;
    travarTabuleiro = false;
}

function trocarVez() {
    jogadorAtual = jogadorAtual === 1 ? 2 : 1;
    atualizarVisualVez();
}

function atualizarVisualVez() {
    if (jogadorAtual === 1) {
        statusVez.textContent = 'Vez do Jogador 1';
        statusVez.style.color = '#3498db';
        placarJ1.classList.add('turno-azul');
        placarJ2.classList.remove('turno-vermelho');
    } else {
        statusVez.textContent = 'Vez do Jogador 2';
        statusVez.style.color = '#e74c3c';
        placarJ2.classList.add('turno-vermelho');
        placarJ1.classList.remove('turno-azul');
    }
}

async function finalizarPartida() {
    travarTabuleiro = true;
    tabuleiro.classList.add('escondido');

    if (pontosJ1 > pontosJ2) {
        mensagemResultado.textContent = `Jogador 1 venceu! (${pontosJ1}x${pontosJ2})`;
    } else if (pontosJ2 > pontosJ1) {
        mensagemResultado.textContent = `Jogador 2 venceu! (${pontosJ1}x${pontosJ2})`;
    } else {
        mensagemResultado.textContent = `Empate! (${pontosJ1}x${pontosJ2})`;
    }

    await exibirAnimacao(['Partida encerrada...', 'Vamos ao resultado...', 'E o vencedor é...'], 1500);
    secaoFimJogo.classList.remove('escondido');
}

// Evento do botão "Jogar novamente"
btnReiniciar.addEventListener('click', iniciarJogo);

// Começa o jogo assim que a página abre
iniciarJogo();