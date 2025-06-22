// Gameboard module: stores the board and related methods

const Gameboard = (() => {
  // 3x3 board initialized with empty strings
  let board = ["", "", "", "", "", "", "", "", ""];

  // Method to get the current board
  const getBoard = () => board;

  // Method to set a mark at a position
  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  // Method to reset the board
  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMark, reset };
})();

// Player factory function

const Player = (name, mark) => {
  return { name, mark };
};

// GameController module: controls the game flow

const GameController = (() => {
  const player1 = Player("Player 1", "X"); // Player 1 is X
  const player2 = Player("Player 2", "O"); // Player 2 is O
  let currentPlayer = player1;
  let gameOver = false;

  // --- NEW: Score tracking ---
  let player1Score = 0;
  let player2Score = 0;
  let tieScore = 0;

  // Helper function to get scores (optional, but good practice)
  const getScores = () => ({
    player1: player1Score,
    player2: player2Score,
    tie: tieScore
  });
  // --- END NEW ---

  // Switch turns
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Play a turn
  const playTurn = (index) => {
    if (gameOver) return;
    if (Gameboard.setMark(index, currentPlayer.mark)) {
      if (checkWin()) {
        gameOver = true;
        console.log(`${currentPlayer.name} wins!`);
        // --- NEW: Update score on win ---
        if (currentPlayer === player1) {
          player1Score++;
        } else {
          player2Score++;
        }
        // --- END NEW ---
      } else if (Gameboard.getBoard().every(cell => cell !== "")) {
        gameOver = true;
        console.log("It's a tie!");
        // --- NEW: Update score on tie ---
        tieScore++;
        // --- END NEW ---
      } else {
        switchPlayer();
      }
    } else {
      console.log("Spot already taken!");
    }
  };

  // Check for a win
  const checkWin = () => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];
    return winPatterns.some(pattern =>
      pattern.every(idx => b[idx] === currentPlayer.mark)
    );
  };

  // Reset the game
  const resetGame = () => {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
    // Don't reset scores here, only the game state
  };

  return { playTurn, resetGame, getScores }; // --- NEW: Expose getScores ---
})();

// DisplayController module

const DisplayController = (() => {
  const boardContainer = document.getElementById('board');
  const restartButton = document.querySelector('.restart-button');
  // --- NEW: Get score display elements ---
  const player1ScoreDisplay = document.getElementById('player1-score-display');
  const player2ScoreDisplay = document.getElementById('player2-score-display');
  const tieScoreDisplay = document.getElementById('tie-score-display');
  // --- END NEW ---

  // --- NEW: Function to update all scores ---
  const updateScores = () => {
    const scores = GameController.getScores();
    player1ScoreDisplay.textContent = scores.player1;
    player2ScoreDisplay.textContent = scores.player2;
    tieScoreDisplay.textContent = scores.tie;
  };
  // --- END NEW ---

  // Render the board array to the DOM
  const render = () => {
    boardContainer.innerHTML = ""; // Clear previous board
    const board = Gameboard.getBoard();
    board.forEach((cell, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      cellDiv.addEventListener('click', () => {
        // You might want a better way to prevent clicks on non-empty cells
        // GameController.playTurn already handles this, but visually you might want no click effect
        GameController.playTurn(index);
        render(); // Re-render board (updates marks)
        updateScores(); // --- NEW: Update scores after a turn ---
      });

      cellDiv.textContent = cell;

      if (cell === 'X') {
        cellDiv.classList.add('x-mark');
      } else if (cell === 'O') {
        cellDiv.classList.add('o-mark');
      }

      // --- NEW: Add hover effect only for empty cells using :not() (CSS-only) ---
      // No JS needed for this if using :not(.x-mark):not(.o-mark):hover in CSS
      // If you added a 'playable' class:
      // if (cell === "") {
      //   cellDiv.classList.add('playable');
      // }
      // --- END NEW ---

      boardContainer.appendChild(cellDiv);
    });
  };

  // Add event listener for the restart button
  restartButton.addEventListener('click', () => {
    GameController.resetGame(); // Call the reset method
    render(); // Re-render the board to show the cleared state
    // Don't call updateScores here, as resetGame doesn't reset scores
  });


  // Initial render (and score update)
  render();
  updateScores(); // --- NEW: Call on initial load ---

  // Expose render and updateScores if needed externally
  return { render, updateScores };
})();