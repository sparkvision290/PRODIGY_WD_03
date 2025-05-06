// User interface interactions
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    gameState.board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        
        if (cell) {
            cellElement.textContent = cell;
            cellElement.classList.add('filled');
        }
        
        gameBoard.appendChild(cellElement);
    });
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = gameState.board[index];
        if (gameState.board[index]) {
            cell.classList.add('filled');
        } else {
            cell.classList.remove('filled');
        }
    });
}

function highlightWinningCells(cells) {
    cells.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
    });
}

function updateScoresDisplay() {
    document.getElementById('x-wins').textContent = gameState.scores.xWins;
    document.getElementById('o-wins').textContent = gameState.scores.oWins;
    document.getElementById('draws').textContent = gameState.scores.draws;
}

// More UI functions...