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
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let gameOver = false;

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
      } else if (Gameboard.getBoard().every(cell => cell !== "")) {
        gameOver = true;
        console.log("It's a tie!");
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
  };

  return { playTurn, resetGame };
})();

// DisplayController module

// DisplayController module
const DisplayController = (() => {
  const boardContainer = document.getElementById('board');
  const restartButton = document.querySelector('.restart-button'); // Get the restart button

  // Render the board array to the DOM
  const render = () => {
    boardContainer.innerHTML = ""; // Clear previous board
    const board = Gameboard.getBoard();
    board.forEach((cell, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      // Add click event listener to each cell
      cellDiv.addEventListener('click', () => {
        // Only allow playing a turn if the game is not over and the cell is empty
        // You might need to add a method to GameController to check if gameOver is true
        // For now, let's assume playTurn handles it
        GameController.playTurn(index);
        render(); // Re-render the board after a turn to update display
      });

      cellDiv.textContent = cell;

      if (cell === 'X') {
        cellDiv.classList.add('x-mark');
      } else if (cell === 'O') {
        cellDiv.classList.add('o-mark');
      }

      boardContainer.appendChild(cellDiv);
    });
  };

  // Add event listener for the restart button
  restartButton.addEventListener('click', () => {
    GameController.resetGame(); // Call the reset method
    render(); // Re-render the board to show the cleared state
  });


  // Initial render
  render();

  // Expose render if you want to call it again later
  return { render };
})();