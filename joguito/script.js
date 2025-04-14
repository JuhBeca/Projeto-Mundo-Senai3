// Variáveis do jogo
let playerName = '';
let score = 0;
let lives = 3;
let correctAnswers = 0;
const questions = [
    {
        question: "Qual a probabilidade de sair cara em um lançamento de moeda justa?",
        options: ["25%", "50%", "75%"],
        correct: 1,
        explanation: "Em uma moeda justa, há duas possibilidades igualmente prováveis: cara ou coroa, portanto 50% para cada."
    },
    {
        question: "Qual a probabilidade de obter um número par ao lançar um dado de 6 faces?",
        options: ["1/6", "1/3", "1/2"],
        correct: 2,
        explanation: "Há 3 números pares (2, 4, 6) em 6 possibilidades totais, portanto 3/6 = 1/2."
    },
    {
        question: "Em uma urna com 3 bolas vermelhas e 2 azuis, qual a probabilidade de tirar uma vermelha?",
        options: ["30%", "60%", "50%"],
        correct: 1,
        explanation: "Probabilidade = casos favoráveis / casos totais = 3/(3+2) = 3/5 = 60%."
    },
    {
        question: "Qual a probabilidade de não sair o número 1 ao lançar um dado?",
        options: ["1/6", "5/6", "1/3"],
        correct: 1,
        explanation: "Probabilidade do complementar: 1 - P(sair 1) = 1 - 1/6 = 5/6."
    },
    {
        question: "Qual a probabilidade de tirar um valete de um baralho de 52 cartas?",
        options: ["1/52", "1/26", "1/13"],
        correct: 2,
        explanation: "Há 4 valetes em 52 cartas, então 4/52 = 1/13."
    },
    {
        question: "Se a probabilidade de chover é 30%, qual a probabilidade de não chover?",
        options: ["30%", "70%", "Não é possível determinar"],
        correct: 1,
        explanation: "Probabilidade do complementar: 100% - 30% = 70%."
    },
    {
        question: "Qual a probabilidade de sair cara duas vezes ao lançar uma moeda duas vezes?",
        options: ["25%", "50%", "75%"],
        correct: 0,
        explanation: "Probabilidade de dois eventos independentes: 0.5 * 0.5 = 0.25 ou 25%."
    },
    {
        question: "Em uma sala com 5 homens e 5 mulheres, qual a chance de sortear uma mulher?",
        options: ["25%", "50%", "75%"],
        correct: 1,
        explanation: "5 mulheres em 10 pessoas totais: 5/10 = 0.5 ou 50%."
    },
    {
        question: "Qual a probabilidade de tirar uma carta de copas de um baralho?",
        options: ["1/4", "1/13", "1/52"],
        correct: 0,
        explanation: "Há 13 cartas de copas em 52: 13/52 = 1/4."
    },
    {
        question: "Se você tem 1 chance em 4 de ganhar, qual sua probabilidade de perder?",
        options: ["25%", "50%", "75%"],
        correct: 2,
        explanation: "Probabilidade do complementar: 1 - 1/4 = 3/4 = 75%."
    },
    {
        question: "Qual a probabilidade de obter soma 7 ao lançar dois dados?",
        options: ["1/6", "1/12", "1/36"],
        correct: 0,
        explanation: "Há 6 combinações que somam 7 em 36 possíveis: 6/36 = 1/6."
    },
    {
        question: "Em um sorteio com 20 números, qual a chance de seu único bilhete ser sorteado?",
        options: ["1/20", "1/10", "1/5"],
        correct: 0,
        explanation: "1 bilhete favorável em 20 possíveis: 1/20."
    }
];
let currentQuestion = {};
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Elementos do DOM
const startScreen = document.getElementById('start-screen');
const playerNameInput = document.getElementById('player-name');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const car = document.getElementById('car');
const questionElement = document.getElementById('question');
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const option3 = document.getElementById('option3');
const livesContainer = document.getElementById('lives-container');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const winScreen = document.getElementById('win-screen');
const scoreDisplay = document.getElementById('score-display');
const scoreDisplayWin = document.getElementById('score-display-win');
const restartButton = document.getElementById('restart-button');
const restartButtonWin = document.getElementById('restart-button-win');
const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardListWin = document.getElementById('leaderboard-list-win');

// Event Listeners
startButton.addEventListener('click', startGame);
option1.addEventListener('click', () => checkAnswer(0));
option2.addEventListener('click', () => checkAnswer(1));
option3.addEventListener('click', () => checkAnswer(2));
restartButton.addEventListener('click', restartGame);
restartButtonWin.addEventListener('click', restartGame);

// Funções do jogo
function startGame() {
    if (playerNameInput.value.trim() === '') {
        alert('Por favor, digite seu nome!');
        return;
    }
    
    playerName = playerNameInput.value.trim();
    startScreen.style.display = 'none';
    resetGame();
    showQuestion();
    createClouds();
}

function resetGame() {
    score = 0;
    lives = 3;
    correctAnswers = 0;
    updateScore();
    updateLives();
    car.style.left = '50px';
    // Marca todas as perguntas como não usadas
    questions.forEach(q => q.used = false);
}

function showQuestion() {
    // Seleciona uma pergunta aleatória que não foi usada ainda
    const availableQuestions = questions.filter(q => !q.used);
    
    if (availableQuestions.length === 0) {
        // Se todas as perguntas foram usadas, marca todas como não usadas
        questions.forEach(q => q.used = false);
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    } else {
        currentQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }
    
    currentQuestion.used = true;
    questionElement.textContent = currentQuestion.question;
    option1.textContent = currentQuestion.options[0];
    option2.textContent = currentQuestion.options[1];
    option3.textContent = currentQuestion.options[2];
}

function checkAnswer(selectedOption) {
    if (selectedOption === currentQuestion.correct) {
        // Resposta correta
        score += 50;
        correctAnswers++;
        updateScore();
        moveCar();
        
        if (correctAnswers >= 5) {
            winGame();
        } else {
            showQuestion();
        }
    } else {
        // Resposta errada
        lives--;
        updateLives();
        
        if (lives <= 0) {
            gameOver();
        } else {
            alert(`Resposta incorreta!\nExplicação: ${currentQuestion.explanation}`);
            showQuestion();
        }
    }
}

function moveCar() {
    const currentPosition = parseInt(car.style.left);
    const roadWidth = gameContainer.offsetWidth;
    const newPosition = currentPosition + (roadWidth / 5);
    
    if (newPosition >= roadWidth - 100) {
        car.style.left = (roadWidth - 100) + 'px';
    } else {
        car.style.left = newPosition + 'px';
    }
}

function updateScore() {
    scoreElement.textContent = `Pontos: ${score}`;
}

function updateLives() {
    const hearts = livesContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index < lives) {
            heart.style.display = 'block';
        } else {
            heart.style.display = 'none';
        }
    });
}

function gameOver() {
    gameOverScreen.style.display = 'flex';
    scoreDisplay.textContent = score;
    updateLeaderboard();
}

function winGame() {
    winScreen.style.display = 'flex';
    scoreDisplayWin.textContent = score;
    updateLeaderboard();
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    winScreen.style.display = 'none';
    resetGame();
    showQuestion();
}

function updateLeaderboard() {
    // Adiciona o jogador atual ao placar
    leaderboard.push({ name: playerName, score: score });
    
    // Ordena o placar por pontuação (decrescente)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Mantém apenas os top 5
    if (leaderboard.length > 5) {
        leaderboard = leaderboard.slice(0, 5);
    }
    
    // Salva no localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    // Atualiza a exibição do placar
    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    leaderboardList.innerHTML = '';
    leaderboardListWin.innerHTML = '';
    
    leaderboard.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${index + 1}. ${player.name}</span> <span>${player.score}</span>`;
        leaderboardList.appendChild(li.cloneNode(true));
        leaderboardListWin.appendChild(li);
    });
}

function createClouds() {
    // Remove nuvens existentes
    document.querySelectorAll('.cloud').forEach(cloud => cloud.remove());
    
    // Cria 5 nuvens em posições aleatórias
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Tamanho aleatório entre 50 e 150px
        const size = Math.random() * 100 + 50;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        
        // Posição aleatória
        cloud.style.top = `${Math.random() * 200}px`;
        cloud.style.left = `${Math.random() * 700}px`;
        
        gameContainer.appendChild(cloud);
    }
}

// Inicializa o placar
updateLeaderboardDisplay();