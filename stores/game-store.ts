import { create } from "zustand"
import { type Board, type Cell, type Winner, checkForWinner, resetGame, getWinningLine } from "@/lib/game-logic"

type GameMode = "local" | "online"
type GameStatus = "waiting" | "playing" | "finished"

interface Player {
  id: string
  symbol: Cell
  name?: string
}

interface GameState {
  // Game data
  board: Board
  currentPlayer: Cell
  winner: Winner
  winningLine: number[] | null
  gameMode: GameMode
  gameStatus: GameStatus

  // Online game data
  roomId: string | null
  roomCode: string | null
  players: Player[]
  localPlayerId: string | null

  // Actions
  makeMove: (index: number) => void
  setGameMode: (mode: GameMode) => void
  resetGameState: () => void
  setRoomData: (roomId: string, roomCode: string) => void
  setPlayers: (players: Player[]) => void
  setLocalPlayerId: (id: string) => void
  updateBoard: (board: Board, currentPlayer: Cell) => void
  setGameStatus: (status: GameStatus) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  board: resetGame(),
  currentPlayer: "X",
  winner: null,
  winningLine: null,
  gameMode: "local",
  gameStatus: "waiting",
  roomId: null,
  roomCode: null,
  players: [],
  localPlayerId: null,

  // Make a move (for local play)
  makeMove: (index) => {
    const state = get()

    // Validate move
    if (state.board[index] !== "" || state.winner || state.gameStatus !== "playing") {
      return
    }

    // Update board
    const newBoard = [...state.board]
    newBoard[index] = state.currentPlayer

    // Check for winner
    const winner = checkForWinner(newBoard)
    const winningLine = winner && winner !== "tie" ? getWinningLine(newBoard) : null

    set({
      board: newBoard,
      currentPlayer: state.currentPlayer === "X" ? "O" : "X",
      winner,
      winningLine,
      gameStatus: winner ? "finished" : "playing",
    })
  },

  setGameMode: (mode) => set({ gameMode: mode }),

  resetGameState: () =>
    set({
      board: resetGame(),
      currentPlayer: "X",
      winner: null,
      winningLine: null,
      gameStatus: "waiting",
    }),

  setRoomData: (roomId, roomCode) => set({ roomId, roomCode }),

  setPlayers: (players) => set({ players }),

  setLocalPlayerId: (id) => set({ localPlayerId: id }),

  updateBoard: (board, currentPlayer) => {
    const winner = checkForWinner(board)
    const winningLine = winner && winner !== "tie" ? getWinningLine(board) : null

    set({
      board,
      currentPlayer,
      winner,
      winningLine,
      gameStatus: winner ? "finished" : "playing",
    })
  },

  setGameStatus: (status) => set({ gameStatus: status }),
}))
