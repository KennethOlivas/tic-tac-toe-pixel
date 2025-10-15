"use client"

import { GameCell } from "@/components/game-cell"
import { useGameStore } from "@/stores/game-store"
import { motion } from "framer-motion"
import { useOnlineGame } from "@/hooks/use-online-game"

interface OnlineGameBoardProps {
  roomId: string
}

export function OnlineGameBoard({ roomId }: OnlineGameBoardProps) {
  const { board, currentPlayer, winningLine, gameStatus, localPlayerId, players } = useGameStore()
  const { makeOnlineMove, connected } = useOnlineGame(roomId)

  const localPlayer = players.find((p) => p.id === localPlayerId)
  const isMyTurn = localPlayer?.symbol === currentPlayer

  const handleCellClick = (index: number) => {
    if (!connected || !isMyTurn || board[index] !== "" || gameStatus !== "playing") {
      return
    }
    makeOnlineMove(index)
  }

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="space-y-4">
      {/* Connection status */}
      {!connected && <div className="text-center text-sm text-muted-foreground">Connecting to game...</div>}

      {/* Player info */}
      {localPlayer && (
        <div className="text-center text-sm font-semibold">
          You are playing as{" "}
          <span className={localPlayer.symbol === "X" ? "text-game-x" : "text-game-o"}>{localPlayer.symbol}</span>
          {isMyTurn && gameStatus === "playing" && <span className="ml-2 text-primary">(Your turn)</span>}
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-md mx-auto p-4"
      >
        {board.map((cell, index) => (
          <GameCell
            key={index}
            value={cell}
            index={index}
            onClick={() => handleCellClick(index)}
            isWinning={winningLine?.includes(index) || false}
            disabled={!connected || !isMyTurn || gameStatus !== "playing"}
          />
        ))}
      </motion.div>
    </div>
  )
}
