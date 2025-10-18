"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/stores/game-store"

export function HomeCard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [joinCode, setJoinCode] = useState("")
  const { setGameMode, resetGameState, setGameStatus } = useGameStore()

  const handlePlayLocal = () => {
    setGameMode("local")
    resetGameState()
    setGameStatus("playing")
    router.push("/game/local")
  }

  const handleCreateOnline = async () => {
    setGameMode("online")
    resetGameState()
    // Will create room in next task
    router.push("/game/create")
  }

  const handleJoinGame = () => {
    if (joinCode.trim()) {
      router.push(`/game/${joinCode.trim()}`)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className=" max-w-2xl mx-auto pixel-shadow border-4 border-foreground/20 bg-card/95 backdrop-blur w-md">
        <CardHeader className="text-center space-y-2 ">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <CardTitle className="text-4xl font-bold font-mono text-primary">{t("home.title")}</CardTitle>
          </motion.div>
          <CardDescription className="text-base">{t("home.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Play Local Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePlayLocal}
              className="w-full h-14 text-lg font-bold pixel-shadow hover:pixel-pressed transition-all bg-primary hover:bg-primary/90"
              size="lg"
            >
              {t("home.playLocal")}
            </Button>
          </motion.div>

          {/* Create Online Button */}
          {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleCreateOnline}
              className="w-full h-14 text-lg font-bold pixel-shadow hover:pixel-pressed transition-all bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {t("home.createOnline")}
            </Button>
          </motion.div> */}

          {/* Join Game Section */}
          {/* <div className="pt-4 border-t-2 border-border space-y-3">
            <Label htmlFor="join-code" className="text-base font-semibold">
              {t("home.joinGame")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="join-code"
                placeholder={t("home.enterCode")}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinGame()
                  }
                }}
                className="flex-1 h-12 text-center font-mono text-lg uppercase pixel-border"
                maxLength={6}
              />
              <Button
                onClick={handleJoinGame}
                disabled={!joinCode.trim()}
                className="h-12 px-6 font-bold pixel-shadow hover:pixel-pressed transition-all"
                size="lg"
              >
                {t("home.join")}
              </Button>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  )
}
