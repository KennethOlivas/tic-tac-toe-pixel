"use client"

import { motion } from "framer-motion"
import type { Cell } from "@/lib/game-logic"
import { useAppStore } from "@/stores/app-store"
import Image from "next/image"

interface GameCellProps {
  value: Cell
  index: number
  onClick: () => void
  isWinning: boolean
  disabled: boolean
}

export function GameCell({ value, index, onClick, isWinning, disabled }: GameCellProps) {
  const animationsEnabled = useAppStore((state) => state.animationsEnabled)

  const cellVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: animationsEnabled ? { scale: 1.05 } : {},
    tap: animationsEnabled ? { scale: 0.95 } : {},
  }

  const symbolVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: [0, 1, 0.9, 1],
      transition: {
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
        opacity: {
          duration: 0.3,
          times: [0, 0.5, 0.7, 1],
        },
      },
    },
  }

  const winningCellVariants = {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0px rgba(199, 163, 123, 0)",
        "0 0 20px rgba(199, 163, 123, 0.8), 0 0 40px rgba(199, 163, 123, 0.4)",
        "0 0 0px rgba(199, 163, 123, 0)",
      ],
    },
  }

  return (
    <motion.button
      variants={cellVariants}
      initial="initial"
      animate={isWinning ? winningCellVariants.animate : "animate"}
      whileHover={!disabled && !value ? "hover" : undefined}
      whileTap={!disabled && !value ? "tap" : undefined}
      onClick={onClick}
      disabled={disabled || !!value}
      transition={
        isWinning
          ? {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
          : undefined
      }
      className={`
        aspect-square wooden-frame
        flex items-center justify-center
        transition-all duration-200
        relative overflow-hidden
        ${isWinning ? "pixel-glow" : ""}
        ${!disabled && !value ? "hover:brightness-110 cursor-pointer" : ""}
        ${disabled || value ? "cursor-not-allowed" : ""}
      `}
      style={{
        imageRendering: "pixelated",
      }}
      aria-label={`Cell ${Math.floor(index / 3) + 1}, ${(index % 3) + 1}${value ? `, ${value}` : ""}`}
    >
      {value === "X" && (
        <motion.div
          variants={symbolVariants}
          initial="initial"
          animate="animate"
          className="w-16 h-16 md:w-20 md:h-20 relative"
        >
          <Image
            src="/pixel-assets/x.png"
            alt="X"
            fill
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      )}
      {value === "O" && (
        <motion.div
          variants={symbolVariants}
          initial="initial"
          animate="animate"
          className="w-16 h-16 md:w-20 md:h-20 relative"
        >
          <Image
            src="/pixel-assets/o.png"
            alt="O"
            fill
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      )}
    </motion.button>
  )
}
