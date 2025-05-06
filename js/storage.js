// Local storage handling
function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        gameState.scores = JSON.parse(savedScores);
        updateScoresDisplay();
    }
}

function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(gameState.scores));
}

function updateScoresDisplay() {
    elements.xWinsDisplay.textContent = gameState.scores.xWins;
    elements.oWinsDisplay.textContent = gameState.scores.oWins;
    elements.drawsDisplay.textContent = gameState.scores.draws;
}

function resetScores() {
    gameState.scores = { xWins: 0, oWins: 0, draws: 0 };
    updateScoresDisplay();
    saveScores();
}

function loadSettings() {
    const savedSettings = localStorage.getItem('ticTacToeSettings');
    if (savedSettings) {
        gameState.settings = JSON.parse(savedSettings);
        elements.soundToggle.checked = gameState.settings.soundEnabled;
        elements.animationsToggle.checked = gameState.settings.animationsEnabled;
    }
}

function saveSettings() {
    localStorage.setItem('ticTacToeSettings', JSON.stringify(gameState.settings));
}