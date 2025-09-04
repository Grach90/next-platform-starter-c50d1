"use client";

import { LanguageSwitcher } from "./language-switcher";
import { BasketButton } from "./basket-button";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/photo.png"
          alt="Luxury flower arrangement background"
          className="h-full w-full object-cover object-left"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute bottom-20 z-20 items-center flex flex-col items-center left-1/2 -translate-x-1/2 block md:hidden">
        <Button className="rounded-full bg-pink-300 w-60 h-10 text-lg">
          <a href="#filter">S E A R C H</a>
        </Button>
        <Button className="rounded-full bg-pink-300 w-60 h-10 text-lg mt-3">
          <a href="#groups">ORDER / CATALOG</a>
        </Button>
        <Button className="rounded-full bg-pink-300 w-50 h-9 text-sm mt-3">
          <a href="#info">About Us/Delivery/Payment</a>
        </Button>
        <Button
          className="rounded-full bg-gray-400 w-60 h-9 text-2xl mt-3 border-2 border-green-500"
          onClick={() =>
            window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`)
          }
        >
          {" "}
          Chat
        </Button>
        <Button
          className="absolute bottom-0 -left-1 px-0 bg-transparent pointer-events-none"
          onClick={() =>
            window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`)
          }
        >
          <img src="/whatsapp.png" alt="" className="w-10 h-10" />
        </Button>
        <Button className="absolute bottom-0 -right-13 px-0">
          <img src="/instagram.png" alt="" className="w-10 h-10" />
        </Button>
        <Button className="absolute top-0 left-0 px-0 bg-transparent">
          <a href="#groups">
            <img src="/search.png" alt="" className="w-10 h-10" />
          </a>
        </Button>
      </div>

      {/* Logo Overlay */}
      <div className="absolute inset-0 z-10 flex justify-center">
        <div className="text-center mt-25 mr-10 ml-10">
          {/* SVG Logo Placeholder - Replace with actual SVG */}
          <img src="/logo 1.png" alt="" />
        </div>
      </div>
    </section>
  );
}
