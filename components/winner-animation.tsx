"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/stores/game-store"
import { useAppStore } from "@/stores/app-store"
import { useEffect, useState } from "react"

export function WinnerAnimation() {
  const { winner, localPlayerId, players } = useGameStore()
  const animationsEnabled = useAppStore((state) => state.animationsEnabled)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (winner && winner !== "tie") {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 4000)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [winner])

  if (!animationsEnabled || !show || !winner || winner === "tie") {
    return null
  }

  // Determine if local player won or lost (for online games)
  const localPlayer = players.find((p) => p.id === localPlayerId)
  const isWinner = !localPlayer || localPlayer.symbol === winner

  const bgColor = isWinner ? "bg-game-winner" : "bg-game-loser"
  const particleColor = isWinner ? "bg-game-winner" : "bg-game-loser"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
      >
        {/* Animated background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0.2, 0.3, 0.2, 0],
          }}
          transition={{
            duration: 4,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
          className={`absolute inset-0 ${bgColor}`}
        />

        {/* Camera shake effect for loser */}
        {!isWinner && (
          <motion.div
            animate={{
              x: [0, -10, 10, -10, 10, -5, 5, 0],
              y: [0, -5, 5, -5, 5, -2, 2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: 3,
            }}
            className="fixed inset-0"
          />
        )}

        {/* Particle effects */}
        {isWinner ? (
          // Winner: Confetti-like particles rising up
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${50 + (Math.random() - 0.5) * 20}vw`,
                  y: "110vh",
                  scale: 0,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 80}vw`,
                  y: "-10vh",
                  scale: [0, 1, 1, 0.5],
                  opacity: [1, 1, 1, 0],
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className={`absolute w-3 h-3 ${particleColor} rounded-sm`}
                style={{
                  boxShadow: "0 0 8px currentColor",
                }}
              />
            ))}
            {/* Sparkle effects */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  boxShadow: "0 0 12px #fef08a",
                }}
              />
            ))}
          </>
        ) : (
          // Loser: Falling particles with shake
          <>
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${Math.random() * 100}vw`,
                  y: "-10vh",
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: "110vh",
                  scale: [1, 0.5, 0],
                  opacity: [1, 0.8, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.08,
                  ease: "easeIn",
                }}
                className={`absolute w-4 h-4 ${particleColor} rounded-sm`}
                style={{
                  boxShadow: "0 0 6px currentColor",
                }}
              />
            ))}
          </>
        )}

        {/* Radial pulse effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 3, 5],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${bgColor} rounded-full blur-3xl`}
        />
      </motion.div>
    </AnimatePresence>
  )
}
