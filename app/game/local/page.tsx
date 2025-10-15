"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { PixelBackground } from "@/components/pixel-background"
import { GameBoard } from "@/components/game-board"
import { GameStatus } from "@/components/game-status"
import { GameControls } from "@/components/game-controls"
import { WinnerAnimation } from "@/components/winner-animation"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/stores/game-store"
import { motion } from "framer-motion"

export default function LocalGamePage() {
  const { setGameStatus, gameStatus } = useGameStore()

  useEffect(() => {
    // Start the game when component mounts
    if (gameStatus === "waiting") {
      setGameStatus("playing")
    }
  }, [gameStatus, setGameStatus])

  return (
    <main className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />
      <WinnerAnimation />

      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="pixel-shadow border-4 border-foreground/20 bg-card/95 backdrop-blur p-4 md:p-6">
            <GameStatus />
            <GameBoard />
            <div className="mt-6">
              <GameControls />
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
