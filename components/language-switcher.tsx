"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ELanguage } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"

const LANGUAGES = [
  { code: ELanguage.English, name: "English", flag: "🇺🇸" },
  { code: ELanguage.Russian, name: "Русский", flag: "🇷🇺" },
  { code: ELanguage.Arabic, name: "العربية", flag: "🇦🇪" },
]

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage()

  const handleLanguageChange = async (language: ELanguage) => {
    await setLanguage(language)
  }

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 border-white/30 bg-green-900/20 text-white backdrop-blur-sm hover:bg-green-900/10"
        >
          <span className="text-lg">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-[#ffff]">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
