// Game state and core logic
const gameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameActive: true,
    players: {
        playerX: 'human',
        playerO: 'ai-easy'
    },
    scores: {
        xWins: 0,
        oWins: 0,
        draws: 0
    },
    settings: {
        soundEnabled: true,
        animationsEnabled: true
    }
};

// DOM Elements
const elements = {
    gameBoard: document.getElementById('game-board'),
    currentPlayerDisplay: document.getElementById('current-player-display'),
    gameMessage: document.getElementById('game-message'),
    xWinsDisplay: document.getElementById('x-wins'),
    oWinsDisplay: document.getElementById('o-wins'),
    drawsDisplay: document.getElementById('draws'),
    player1Select: document.getElementById('player1'),
    player2Select: document.getElementById('player2'),
    newGameBtn: document.getElementById('new-game'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsMenu: document.getElementById('settings-menu'),
    soundToggle: document.getElementById('sound-toggle'),
    animationsToggle: document.getElementById('animations-toggle'),
    resetStatsBtn: document.getElementById('reset-stats'),
    clickSound: document.getElementById('click-sound'),
    winSound: document.getElementById('win-sound'),
    drawSound: document.getElementById('draw-sound')
};

// Initialize the game
function initGame() {
    createBoard();
    loadScores();
    loadSettings();
    setupEventListeners();
    
    // Set initial players from dropdown
    gameState.players.playerX = elements.player1Select.value;
    gameState.players.playerO = elements.player2Select.value;
    
    updateCurrentPlayerDisplay();
    
    // If AI is first player, make move
    if ((gameState.currentPlayer === 'X' && gameState.players.playerX !== 'human') || 
        (gameState.currentPlayer === 'O' && gameState.players.playerO !== 'human')) {
        setTimeout(() => makeAIMove(), 500);
    }
}

// Create the game board
function createBoard() {
    elements.gameBoard.innerHTML = '';
    
    gameState.board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        
        if (cell) {
            cellElement.textContent = cell;
            cellElement.classList.add('filled', cell.toLowerCase());
        }
        
        cellElement.addEventListener('click', () => handleCellClick(index));
        elements.gameBoard.appendChild(cellElement);
    });
}

// Handle cell click
function handleCellClick(index) {
    if (!gameState.gameActive || gameState.board[index] !== null) return;
    
    const currentPlayerType = gameState.currentPlayer === 'X' ? 
        gameState.players.playerX : gameState.players.playerO;
    
    if (currentPlayerType !== 'human') return;
    
    makeMove(index);
}

// Make a move
function makeMove(index) {
    if (!gameState.gameActive || gameState.board[index] !== null) return;
    
    // Play sound
    if (gameState.settings.soundEnabled) {
        elements.clickSound.currentTime = 0;
        elements.clickSound.play();
    }
    
    // Update board
    gameState.board[index] = gameState.currentPlayer;
    const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
    cellElement.textContent = gameState.currentPlayer;
    cellElement.classList.add('filled', gameState.currentPlayer.toLowerCase());
    
    if (gameState.settings.animationsEnabled) {
        cellElement.classList.add('filled');
    }
    
    // Check game status
    const gameStatus = checkGameStatus();
    
    if (gameStatus) {
        handleGameEnd(gameStatus);
    } else {
        switchPlayer();
        updateCurrentPlayerDisplay();
        
        // If next player is AI, make move
        const nextPlayerType = gameState.currentPlayer === 'X' ? 
            gameState.players.playerX : gameState.players.playerO;
        
        if (nextPlayerType !== 'human') {
            setTimeout(() => makeAIMove(), 500);
        }
    }
}

// Make AI move
function makeAIMove() {
    if (!gameState.gameActive) return;
    
    const aiType = gameState.currentPlayer === 'X' ? 
        gameState.players.playerX : gameState.players.playerO;
    
    const move = AI[aiType.split('-')[1]](
        gameState.board, 
        gameState.currentPlayer
    );
    
    if (move !== null && move !== undefined) {
        makeMove(move);
    }
}

// Check game status
function checkGameStatus() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && gameState.board[a] === gameState.board[b] && gameState.board[a] === gameState.board[c]) {
            return { winner: gameState.board[a], winningCells: pattern };
        }
    }

    return gameState.board.includes(null) ? null : { winner: 'draw' };
}

// Handle game end
function handleGameEnd(status) {
    gameState.gameActive = false;
    
    if (status.winner === 'draw') {
        elements.gameMessage.textContent = "It's a draw!";
        gameState.scores.draws++;
        if (gameState.settings.soundEnabled) {
            elements.drawSound.currentTime = 0;
            elements.drawSound.play();
        }
    } else {
        elements.gameMessage.textContent = `Player ${status.winner} wins!`;
        
        if (status.winner === 'X') {
            gameState.scores.xWins++;
        } else {
            gameState.scores.oWins++;
        }
        
        if (gameState.settings.soundEnabled) {
            elements.winSound.currentTime = 0;
            elements.winSound.play();
        }
        
        if (gameState.settings.animationsEnabled) {
            status.winningCells.forEach(index => {
                document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
            });
        }
    }
    
    updateScoresDisplay();
    saveScores();
}

// Switch player
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
}

// Update current player display
function updateCurrentPlayerDisplay() {
    elements.currentPlayerDisplay.textContent = gameState.currentPlayer;
    elements.currentPlayerDisplay.style.color = gameState.currentPlayer === 'X' ? 
        'var(--primary)' : 'var(--danger)';
}

// Reset game
function resetGame() {
    gameState.board = Array(9).fill(null);
    gameState.gameActive = true;
    gameState.currentPlayer = 'X';
    
    // Update players from dropdown
    gameState.players.playerX = elements.player1Select.value;
    gameState.players.playerO = elements.player2Select.value;
    
    createBoard();
    updateCurrentPlayerDisplay();
    elements.gameMessage.textContent = '';
    
    // If AI is first player, make move
    if ((gameState.currentPlayer === 'X' && gameState.players.playerX !== 'human') || 
        (gameState.currentPlayer === 'O' && gameState.players.playerO !== 'human')) {
        setTimeout(() => makeAIMove(), 500);
    }
}

// Setup event listeners
function setupEventListeners() {
    elements.newGameBtn.addEventListener('click', resetGame);
    
    elements.settingsBtn.addEventListener('click', () => {
        elements.settingsMenu.style.display = elements.settingsMenu.style.display === 'flex' ? 
            'none' : 'flex';
    });
    
    elements.soundToggle.addEventListener('change', (e) => {
        gameState.settings.soundEnabled = e.target.checked;
        saveSettings();
    });
    
    elements.animationsToggle.addEventListener('change', (e) => {
        gameState.settings.animationsEnabled = e.target.checked;
        saveSettings();
    });
    
    elements.resetStatsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all statistics?')) {
            resetScores();
        }
    });
    
    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.settingsMenu.contains(e.target) && 
            e.target !== elements.settingsBtn) {
            elements.settingsMenu.style.display = 'none';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);