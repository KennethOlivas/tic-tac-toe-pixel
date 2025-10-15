// Game logic helper functions for TicTacToe

export type Cell = "X" | "O" | ""
export type Board = Cell[]
export type Winner = "X" | "O" | "tie" | null

// Check if board is full (for tie detection)
export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== "")
}

// Check for winner in a row
export function checkRow(board: Board, row: number): Cell | null {
  const start = row * 3
  const cells = [board[start], board[start + 1], board[start + 2]]
  if (cells[0] && cells[0] === cells[1] && cells[1] === cells[2]) {
    return cells[0]
  }
  return null
}

// Check for winner in a column
export function checkColumn(board: Board, col: number): Cell | null {
  const cells = [board[col], board[col + 3], board[col + 6]]
  if (cells[0] && cells[0] === cells[1] && cells[1] === cells[2]) {
    return cells[0]
  }
  return null
}

// Check for winner in diagonals
export function checkDiagonals(board: Board): Cell | null {
  // Top-left to bottom-right
  if (board[0] && board[0] === board[4] && board[4] === board[8]) {
    return board[0]
  }
  // Top-right to bottom-left
  if (board[2] && board[2] === board[4] && board[4] === board[6]) {
    return board[2]
  }
  return null
}

// Get winning line indices
/**
 * Determines the winning line in a Tic-Tac-Toe board, if any.
 *
 * Checks all rows, columns, and diagonals for a winning combination.
 * Returns the indices of the winning line if found, otherwise returns `null`.
 *
 * @param board - The current state of the Tic-Tac-Toe board as a flat array.
 * @returns An array of indices representing the winning line, or `null` if there is no winner.
 */
export function getWinningLine(board: Board): number[] | null {
  // Check rows
  for (let row = 0; row < 3; row++) {
    const start = row * 3
    if (checkRow(board, row)) {
      return [start, start + 1, start + 2]
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (checkColumn(board, col)) {
      return [col, col + 3, col + 6]
    }
  }

  // Check diagonals
  if (board[0] && board[0] === board[4] && board[4] === board[8]) {
    return [0, 4, 8]
  }
  if (board[2] && board[2] === board[4] && board[4] === board[6]) {
    return [2, 4, 6]
  }

  return null
}

// Main function to check for winner
export function checkForWinner(board: Board): Winner {
  // Check all rows
  for (let row = 0; row < 3; row++) {
    const winner = checkRow(board, row)
    if (winner) return winner
  }

  // Check all columns
  for (let col = 0; col < 3; col++) {
    const winner = checkColumn(board, col)
    if (winner) return winner
  }

  // Check diagonals
  const diagonalWinner = checkDiagonals(board)
  if (diagonalWinner) return diagonalWinner

  // Check for tie
  if (isBoardFull(board)) return "tie"

  return null
}

// Reset game board
export function resetGame(): Board {
  return Array(9).fill("")
}
