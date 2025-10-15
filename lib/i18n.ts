import enTranslations from "@/locales/en.json"
import esTranslations from "@/locales/es.json"

export type Language = "en" | "es"

const translations = {
  en: enTranslations,
  es: esTranslations,
}

export function getTranslation(lang: Language, key: string, params?: Record<string, string>): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  if (typeof value !== "string") {
    return key
  }

  // Replace params like {{player}}
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => params[paramKey] || "")
  }

  return value
}

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en"

  const browserLang = navigator.language.split("-")[0]
  return browserLang === "es" ? "es" : "en"
}
