"use client"

import { motion } from "framer-motion"

export function PixelBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-game-sky to-background" />

      {/* Animated clouds */}
      <motion.div
        className="absolute top-20 left-0 w-32 h-16 bg-white/30 rounded-full blur-sm"
        animate={{
          x: ["-10%", "110%"],
        }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-40 left-0 w-24 h-12 bg-white/20 rounded-full blur-sm"
        animate={{
          x: ["-10%", "110%"],
        }}
        transition={{
          duration: 80,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay: 10,
        }}
      />
      <motion.div
        className="absolute top-32 left-0 w-28 h-14 bg-white/25 rounded-full blur-sm"
        animate={{
          x: ["-10%", "110%"],
        }}
        transition={{
          duration: 70,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay: 25,
        }}
      />

      {/* Grass layer at bottom with subtle animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating pixel particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-foreground/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sun/moon glow */}
      <motion.div
        className="absolute top-20 right-20 w-24 h-24 bg-yellow-300/30 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
