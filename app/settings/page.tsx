"use client"

import { Header } from "@/components/header"
import { PixelBackground } from "@/components/pixel-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/stores/app-store"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { language, setLanguage, audioEnabled, toggleAudio, animationsEnabled, toggleAnimations } = useAppStore()

  return (
    <main className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="pixel-shadow border-4 border-foreground/20 bg-card/95 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="pixel-border">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-2xl font-bold font-mono">{t("settings.title")}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Language Setting */}
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="text-base font-semibold">
                  {t("settings.language")}
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                    className="pixel-border font-mono"
                  >
                    EN
                  </Button>
                  <Button
                    variant={language === "es" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("es")}
                    className="pixel-border font-mono"
                  >
                    ES
                  </Button>
                </div>
              </div>

              {/* Audio Setting */}
              <div className="flex items-center justify-between">
                <Label htmlFor="audio" className="text-base font-semibold">
                  {t("settings.audio")}
                </Label>
                <Switch id="audio" checked={audioEnabled} onCheckedChange={toggleAudio} />
              </div>

              {/* Animations Setting */}
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-base font-semibold">
                  {t("settings.animations")}
                </Label>
                <Switch id="animations" checked={animationsEnabled} onCheckedChange={toggleAnimations} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
