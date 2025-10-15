"use client"

import { Button } from "@/components/ui/button"
import { useGameStore } from "@/stores/game-store"
import { useTranslation } from "@/hooks/use-translation"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, RotateCcw } from "lucide-react"

export function GameControls() {
  const { t } = useTranslation()
  const router = useRouter()
  const { resetGameState, setGameStatus, winner } = useGameStore()

  const handlePlayAgain = () => {
    resetGameState()
    setGameStatus("playing")
  }

  const handleBackHome = () => {
    router.push("/")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto px-4"
    >
      {winner && (
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handlePlayAgain}
            className="w-full h-12 font-bold pixel-shadow hover:pixel-pressed transition-all bg-primary"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("game.playAgain")}
          </Button>
        </motion.div>
      )}
      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleBackHome}
          variant="outline"
          className="w-full h-12 font-bold pixel-shadow hover:pixel-pressed transition-all bg-transparent"
          size="lg"
        >
          <Home className="w-5 h-5 mr-2" />
          {t("game.backHome")}
        </Button>
      </motion.div>
    </motion.div>
  )
}
