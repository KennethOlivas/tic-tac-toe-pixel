"use client"

import { GameCell } from "@/components/game-cell"
import { useGameStore } from "@/stores/game-store"
import { motion } from "framer-motion"

export function GameBoard() {
  const { board, makeMove, winner, winningLine, gameStatus } = useGameStore()

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
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-md mx-auto p-6 wooden-frame"
      style={{
        imageRendering: "pixelated",
      }}
    >
      {board.map((cell, index) => (
        <GameCell
          key={index}
          value={cell}
          index={index}
          onClick={() => makeMove(index)}
          isWinning={winningLine?.includes(index) || false}
          disabled={gameStatus !== "playing"}
        />
      ))}
    </motion.div>
  )
}
