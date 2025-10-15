"use client"

import { useGameStore } from "@/stores/game-store"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { X, Circle, Trophy, Handshake } from "lucide-react"

export function GameStatus() {
  const { t } = useTranslation()
  const { currentPlayer, winner, gameStatus } = useGameStore()

  if (gameStatus === "waiting") {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
        <p className="text-lg font-semibold text-muted-foreground">{t("game.waiting")}</p>
      </motion.div>
    )
  }

  if (winner) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center py-4"
      >
        {winner === "tie" ? (
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center gap-3"
          >
            <Handshake className="w-8 h-8 text-accent" />
            <p className="text-2xl md:text-3xl font-bold text-foreground">{t("game.tie")}</p>
            <Handshake className="w-8 h-8 text-accent" />
          </motion.div>
        ) : (
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center gap-3"
          >
            <Trophy className="w-8 h-8 text-game-winner" />
            {winner === "X" ? (
              <X className="w-8 h-8 text-game-x stroke-[4]" />
            ) : (
              <Circle className="w-8 h-8 text-game-o stroke-[4]" />
            )}
            <p className="text-2xl md:text-3xl font-bold text-foreground">{t("game.winner", { player: winner })}</p>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center gap-3"
      >
        {currentPlayer === "X" ? (
          <X className="w-6 h-6 text-game-x stroke-[4]" />
        ) : (
          <Circle className="w-6 h-6 text-game-o stroke-[4]" />
        )}
        <p className="text-xl md:text-2xl font-semibold text-foreground">{t("game.yourTurn")}</p>
      </motion.div>
    </motion.div>
  )
}
