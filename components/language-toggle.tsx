"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="pixel-border font-mono text-xs"
        >
          {language === "en" ? "EN" : "ES"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          EN
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("es")}>
          ES
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
