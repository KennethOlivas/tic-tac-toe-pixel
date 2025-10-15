"use client"

import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-mono text-xl font-bold text-foreground hover:text-primary transition-colors">
          TicTacToe
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="outline" size="icon" asChild className="pixel-border bg-transparent">
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">{t("home.settings")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
