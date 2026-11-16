// Temas disponíveis (8 pares cada = 16 cartas)
const temasCartas = {
    misto: ['🚀', '🍕', '🐶', '🎸', '🎮', '🌟', '🍎', '⚽'],
    espaco: ['🚀', '🛸', '🪐', '👽', '☄️', '🌙', '⭐', '🛰️'],
    comida: ['🍕', '🍔', '🍟', '🌭', '🍩', '🍓', '🍉', '🍦']
};

let temaSelecionado = 'misto';
let nomeJogador1 = 'Jogador 1';
let nomeJogador2 = 'Jogador 2';

// Estado da partida
let jogadorAtual = 1;
let pontosJ1 = 0;
let pontosJ2 = 0;
let paresEncontrados = 0;

let primeiraCarta = null;
let segundaCarta = null;
let travarTabuleiro = false;

// Elementos das telas
const telaInicio = document.getElementById('tela-inicio');
const telaJogo = document.getElementById('tela-jogo');

// Elementos da tela inicial
const inputJ1 = document.getElementById('input-j1');
const inputJ2 = document.getElementById('input-j2');
const botoesTema = document.querySelectorAll('.btn-tema');
const btnIniciar = document.getElementById('btn-iniciar');

// Elementos do jogo
const tabuleiro = document.getElementById('tabuleiro');
const statusVez = document.getElementById('status-vez');
const placarJ1 = document.getElementById('placar-j1');
const placarJ2 = document.getElementById('placar-j2');
const labelNomeJ1 = document.getElementById('nome-j1');
const labelNomeJ2 = document.getElementById('nome-j2');
const textoPontosJ1 = document.getElementById('pontos-j1');
const textoPontosJ2 = document.getElementById('pontos-j2');
const secaoFimJogo = document.getElementById('fim-jogo');
const mensagemResultado = document.getElementById('mensagem-resultado');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnMenu = document.getElementById('btn-menu');

// Seleção de tema na tela inicial
botoesTema.forEach((botao) => {
    botao.addEventListener('click', () => {
        botoesTema.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');
        temaSelecionado = botao.dataset.tema;
    });
});

// Botão "Iniciar Partida"
btnIniciar.addEventListener('click', () => {
    // Se o campo estiver vazio, usa o padrão "Jogador 1" e "Jogador 2"
    nomeJogador1 = inputJ1.value.trim() || 'Jogador 1';
    nomeJogador2 = inputJ2.value.trim() || 'Jogador 2';

    labelNomeJ1.textContent = nomeJogador1;
    labelNomeJ2.textContent = nomeJogador2;

    telaInicio.classList.add('escondido');
    telaJogo.classList.remove('escondido');

    iniciarJogo();
});

// Botão "Voltar ao Menu"
btnMenu.addEventListener('click', () => {
    telaJogo.classList.add('escondido');
    telaInicio.classList.remove('escondido');
});

// Embaralhar (Fisher-Yates)
function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

// Inicia ou reinicia a partida
function iniciarJogo() {
    jogadorAtual = 1;
    pontosJ1 = 0;
    pontosJ2 = 0;
    paresEncontrados = 0;
    primeiraCarta = null;
    segundaCarta = null;
    travarTabuleiro = false;

    textoPontosJ1.textContent = '0';
    textoPontosJ2.textContent = '0';
    atualizarVisualVez();
    secaoFimJogo.classList.add('escondido');

    const simbolos = temasCartas[temaSelecionado];
    const baralho = embaralhar([...simbolos, ...simbolos]);
    tabuleiro.innerHTML = '';

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
}

function virarCarta(carta) {
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

function verificarPar() {
    const saoIguais = primeiraCarta.dataset.simbolo === segundaCarta.dataset.simbolo;

    if (saoIguais) {
        primeiraCarta.classList.add('encontrada');
        segundaCarta.classList.add('encontrada');

        if (jogadorAtual === 1) {
            pontosJ1++;
            textoPontosJ1.textContent = pontosJ1;
        } else {
            pontosJ2++;
            textoPontosJ2.textContent = pontosJ2;
        }

        paresEncontrados++;
        resetarJogada();

        if (paresEncontrados === 8) {
            finalizarPartida();
        }
    } else {
        travarTabuleiro = true;
        primeiraCarta.classList.add('erro');
        segundaCarta.classList.add('erro');

        setTimeout(() => {
            primeiraCarta.classList.remove('virada', 'erro');
            segundaCarta.classList.remove('virada', 'erro');
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
        statusVez.textContent = `Vez de ${nomeJogador1}`;
        statusVez.style.color = '#3498db';
        placarJ1.classList.add('turno-azul');
        placarJ2.classList.remove('turno-vermelho');
    } else {
        statusVez.textContent = `Vez de ${nomeJogador2}`;
        statusVez.style.color = '#e74c3c';
        placarJ2.classList.add('turno-vermelho');
        placarJ1.classList.remove('turno-azul');
    }
}

function finalizarPartida() {
    if (pontosJ1 > pontosJ2) {
        mensagemResultado.textContent = `${nomeJogador1} venceu! (${pontosJ1}x${pontosJ2})`;
    } else if (pontosJ2 > pontosJ1) {
        mensagemResultado.textContent = `${nomeJogador2} venceu! (${pontosJ1}x${pontosJ2})`;
    } else {
        mensagemResultado.textContent = `Empate! (${pontosJ1}x${pontosJ2})`;
    }

    secaoFimJogo.classList.remove('escondido');
}

btnReiniciar.addEventListener('click', iniciarJogo);