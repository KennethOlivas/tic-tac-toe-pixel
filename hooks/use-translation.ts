"use client"

import { useAppStore } from "@/stores/app-store"
import { getTranslation } from "@/lib/i18n"

/**
 * Custom React hook for accessing the current language and translation function.
 *
 * Retrieves the current language from the application store and provides a translation function `t`
 * that returns the localized string for a given key and optional parameters.
 *
 * @returns An object containing:
 * - `t`: A function to get the translated string for a given key and optional parameters.
 * - `language`: The current language code from the application store.
 */
export function useTranslation() {
  const language = useAppStore((state) => state.language)

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslation(language, key, params)
  }

  return { t, language }
}
