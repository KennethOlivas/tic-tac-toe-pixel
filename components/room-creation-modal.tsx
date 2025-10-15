"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import { Copy, Share2, Play } from "lucide-react"

interface RoomCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RoomCreationModal({ isOpen, onClose }: RoomCreationModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()

  const [isCreating, setIsCreating] = useState(true)
  const [roomData, setRoomData] = useState<{ id: string; code: string } | null>(null)
  const [dots, setDots] = useState("")
  const [showSparkles, setShowSparkles] = useState(false)

  // console.log("RoomCreationModal rendered. isOpen:", isOpen, "isCreating:", isCreating, "roomData:", roomData)
  console.log("RoomCreationModal state:", { isOpen, isCreating, roomData })
  // Animated dots for loading state
  useEffect(() => {
    if (!isCreating) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isCreating])

  // Create room on mount
  useEffect(() => {
    if (!isOpen) return

    // Reset state when modal opens
    setIsCreating(true)
    setRoomData(null)
    setShowSparkles(false)

    let isCancelled = false

    const createRoom = async () => {
      try {
        const response = await fetch("/api/rooms", {
          method: "POST",
        })

        if (!response.ok) {
          throw new Error("Failed to create room")
        }

        const data = await response.json()

        // Simulate a brief delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!isCancelled) {
          setRoomData(data)
          setIsCreating(false)
          setShowSparkles(true)

          // Hide sparkles after animation
          setTimeout(() => setShowSparkles(false), 2000)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error creating room:", error)
          toast({
            title: t("errors.connectionError"),
            variant: "destructive",
          })
          onClose()
          router.push("/")
        }
      }
    }

    createRoom()

    return () => {
      isCancelled = true
    }
  }, [isOpen])

  const handleCopyCode = async () => {
    if (!roomData) return

    // console.log("Copying room code:", roomData.code)
    try {
      await navigator.clipboard.writeText(roomData.code)
      toast({
        title: t("room.codeCopied"),
        description: roomData.code,
      })
    } catch (error) {
      console.error("Failed to copy code:", error)
      toast({
        title: t("errors.copyFailed"),
        variant: "destructive",
      })
    }
  }

  const handleShareLink = async () => {
    if (!roomData) return

    const url = `${window.location.origin}/game/${roomData.id}?code=${roomData.code}`
    // console.log("Sharing link:", url)

    try {
      if (navigator.share) {
        await navigator.share({
          title: t("room.shareTitle"),
          text: t("room.shareText"),
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast({
          title: t("room.linkCopied"),
        })
      }
    } catch (error) {
      console.error("Failed to share link:", error)
      // User cancelled share or error occurred
    }
  }

  const handlePlay = () => {
    if (!roomData) return
    // console.log("Navigating to game room:", roomData.id, "with code:", roomData.code)
    router.push(`/game/${roomData.id}?code=${roomData.code}`)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pixel border glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50 blur-sm animate-pulse" />

          {/* Modal content */}
          <div className="relative bg-background border-8 border-foreground/30 pixel-shadow p-8">
            {isCreating ? (
              // Creating room state
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold font-mono text-primary">
                  {t("room.creating")}
                  {dots}
                </h2>

                {/* Pixel loading animation */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 bg-primary"
                      animate={{
                        y: [0, -20, 0],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Room created state
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-mono text-center text-primary">{t("room.created")}</h2>

                {/* Room code display with blinking cursor */}
                <div className="relative">
                  <div className="bg-card border-4 border-foreground/20 p-4 text-center">
                    <div className="text-sm font-mono text-muted-foreground mb-2">{t("room.code")}</div>
                    <div className="text-3xl font-bold font-mono text-primary tracking-wider flex items-center justify-center gap-1">
                      {roomData?.code || "ERROR"}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                        className="inline-block w-1 h-8 bg-primary ml-1"
                      />
                    </div>
                  </div>

                  {/* Sparkle animation */}
                  <AnimatePresence>
                    {showSparkles && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [1, 1, 0],
                              x: Math.cos((i * Math.PI * 2) / 6) * 60,
                              y: Math.sin((i * Math.PI * 2) / 6) * 60,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent"
                            style={{ transform: "translate(-50%, -50%)" }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Share buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="font-mono border-4 hover:scale-105 transition-transform bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {t("room.copyCode")}
                  </Button>
                  <Button
                    onClick={handleShareLink}
                    variant="outline"
                    className="font-mono border-4 hover:scale-105 transition-transform bg-transparent"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {t("room.shareLink")}
                  </Button>
                </div>

                {/* Play button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handlePlay}
                    size="lg"
                    className="w-full text-xl font-bold font-mono border-4 border-foreground/30 py-6"
                  >
                    <Play className="w-6 h-6 mr-2 fill-current" />
                    {t("room.play")}
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
