"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ELanguage } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";

const LANGUAGES = [
  { code: ELanguage.English, name: "English", flag: "🇺🇸" },
  { code: ELanguage.Russian, name: "Русский", flag: "🇷🇺" },
  { code: ELanguage.Arabic, name: "العربية", flag: "🇦🇪" },
];

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageChange = async (language: ELanguage) => {
    await setLanguage(language);
  };

  const {code}:any = LANGUAGES.find((lang) => lang.code === currentLanguage);
console.log(code,"currentLang");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-[48px] w-[48px] bg-[#F4F4FA4D] border-none backdrop-blur-sm p-[8px] rounded-[8px]"
        >
          <img src={ "/" + code+".png"} alt="flag" className="h-[20px] w-[28px]"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-[#ffff]">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
             <img src={ "/" + language.code+".png"} alt="flag" className="h-[20px] w-[28px]"/>
            {/* <span className="text-lg">{language.flag}</span> */}
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
