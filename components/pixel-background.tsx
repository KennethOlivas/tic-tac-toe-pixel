"use client"

import { motion } from "framer-motion"

function PixelSun() {
  return (
    <svg
      width={128}
      height={128}
      viewBox="0 0 128 128"
      className="absolute top-24 right-24 z-10"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="48" y="48" width="32" height="32" fill="#FFD700" />
      {/* Rays */}
      <rect x="60" y="20" width="8" height="16" fill="#FFD700" />
      <rect x="60" y="92" width="8" height="16" fill="#FFD700" />
      <rect x="20" y="60" width="16" height="8" fill="#FFD700" />
      <rect x="92" y="60" width="16" height="8" fill="#FFD700" />
      <rect x="32" y="32" width="8" height="8" fill="#FFD700" />
      <rect x="88" y="32" width="8" height="8" fill="#FFD700" />
      <rect x="32" y="88" width="8" height="8" fill="#FFD700" />
      <rect x="88" y="88" width="8" height="8" fill="#FFD700" />
    </svg>
  )
}

interface PixelCloudProps {
  x: string | number
  y: string | number
  scale?: number
  opacity?: number
  delay?: number
  duration?: number
}

function PixelCloud({ x, y, scale = 1, opacity = 1, delay = 0, duration = 60 }: PixelCloudProps) {
  return (
    <motion.svg
      width={96 * scale}
      height={48 * scale}
      viewBox="0 0 96 48"
      className="absolute"
      style={{
        left: x,
        top: y,
        opacity,
        imageRendering: "pixelated",
      }}
      animate={{
        x: ["-10%", "110%"],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
        delay,
      }}
    >
      <rect x="16" y="16" width="64" height="16" fill="#fff" />
      <rect x="0" y="24" width="24" height="8" fill="#fff" />
      <rect x="72" y="24" width="24" height="8" fill="#fff" />
      <rect x="32" y="8" width="32" height="8" fill="#fff" />
    </motion.svg>
  )
}

interface PixelGrassProps {
  x: string | number
  y: string | number
  scale?: number
}

function PixelGrass({ x, y, scale = 1 }: PixelGrassProps) {
  return (
    <svg
      width={32 * scale}
      height={32 * scale}
      viewBox="0 0 32 32"
      className="absolute"
      style={{
        left: x,
        bottom: y,
        imageRendering: "pixelated",
      }}
    >
      <rect x="12" y="16" width="8" height="16" fill="#228B22" />
      <rect x="8" y="24" width="4" height="8" fill="#228B22" />
      <rect x="20" y="24" width="4" height="8" fill="#228B22" />
      <rect x="16" y="20" width="4" height="12" fill="#32CD32" />
    </svg>
  )
}

export function PixelBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-game-sky to-background" />

      {/* Pixel Sun */}
      <PixelSun />

      {/* Pixel Clouds - bigger and more visible */}
      <PixelCloud x="2%" y="6%" scale={2.2} opacity={0.85} duration={70} />
      <PixelCloud x="18%" y="14%" scale={1.8} opacity={0.75} delay={10} duration={80} />
      <PixelCloud x="55%" y="10%" scale={1.5} opacity={0.65} delay={25} duration={90} />

      {/* Animated pixel squares as particles - bigger */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80 + 10}%`,
            width: `${Math.random() * 8 + 6}px`,
            height: `${Math.random() * 8 + 6}px`,
            background: "rgba(0,0,0,0.15)",
            borderRadius: "2px",
            imageRendering: "pixelated",
          }}
          animate={{
            y: [0, -40, 0],
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

      {/* Pixel Grass Tufts - bigger */}
      {Array.from({ length: 12 }).map((_, i) => (
        <PixelGrass
          key={i}
          x={`${(i * 8 + Math.random() * 4)}%`}
          y="0"
          scale={2 + Math.random() * 0.8}
        />
      ))}

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
    </div>
  )
}