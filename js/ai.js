// AI opponent implementations
const AI = {
    easy: function(board, currentPlayer) {
        // Random moves
        const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
        return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
    },
    
    medium: function(board, currentPlayer) {
        // Try to win if possible, otherwise block opponent, then random
        const opponent = currentPlayer === 'X' ? 'O' : 'X';
        
        // Check for immediate win
        const winningMove = findWinningMove(board, currentPlayer);
        if (winningMove !== null) return winningMove;
        
        // Block opponent win
        const blockingMove = findWinningMove(board, opponent);
        if (blockingMove !== null) return blockingMove;
        
        // Try to take center
        if (board[4] === null) return 4;
        
        // Try to take corners
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(index => board[index] === null);
        if (emptyCorners.length > 0) {
            return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        }
        
        // Otherwise random
        return AI.easy(board, currentPlayer);
    },
    
    hard: function(board, currentPlayer) {
        // Minimax algorithm
        return minimax(board, currentPlayer).index;
    }
};

// Find winning move for player
function findWinningMove(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        // Check if two in a row and third is empty
        if (board[a] === player && board[b] === player && board[c] === null) return c;
        if (board[a] === player && board[c] === player && board[b] === null) return b;
        if (board[b] === player && board[c] === player && board[a] === null) return a;
    }
    return null;
}

// Minimax algorithm
function minimax(board, player, depth = 0, isMaximizing = true) {
    const opponent = player === 'X' ? 'O' : 'X';
    const currentPlayer = isMaximizing ? player : opponent;
    
    // Check for terminal states
    const gameStatus = checkGameStatusForAI(board);
    if (gameStatus) {
        if (gameStatus.winner === player) return { score: 10 - depth, index: null };
        if (gameStatus.winner === opponent) return { score: depth - 10, index: null };
        if (gameStatus.winner === 'draw') return { score: 0, index: null };
    }
    
    const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    
    if (isMaximizing) {
        let bestMove = { score: -Infinity, index: null };
        
        for (const index of emptyCells) {
            const newBoard = [...board];
            newBoard[index] = player;
            const moveScore = minimax(newBoard, player, depth + 1, false).score;
            
            if (moveScore > bestMove.score) {
                bestMove.score = moveScore;
                bestMove.index = index;
            }
        }
        return bestMove;
    } else {
        let bestMove = { score: Infinity, index: null };
        
        for (const index of emptyCells) {
            const newBoard = [...board];
            newBoard[index] = opponent;
            const moveScore = minimax(newBoard, player, depth + 1, true).score;
            
            if (moveScore < bestMove.score) {
                bestMove.score = moveScore;
                bestMove.index = index;
            }
        }
        return bestMove;
    }
}

// Helper function for minimax to check game status
function checkGameStatusForAI(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a] };
        }
    }

    return board.includes(null) ? null : { winner: 'draw' };
}