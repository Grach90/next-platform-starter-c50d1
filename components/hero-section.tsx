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

      <div className="absolute w-[320px] h-[206px] bottom-20 z-20 items-center flex flex-col items-center left-1/2 -translate-x-1/2 block md:hidden">
        <Button className="rounded-[4px] w-[320px] h-[44px] text-lg bg-[#FFFFFF66] justify-start pl-10">
          <a href="#filter">Search...</a>
        </Button>
        <Button className="rounded-[4px] bg-[#AB96D1] w-[320px] h-[44px] text-lg mt-3">
          <a href="#groups">ORDER / CATALOG</a>
        </Button>
        <Button className="rounded-[4px] bg-[#E5CAF3] w-[320px] h-[44px] text-lg mt-3">
          <a href="#info">About Us | Delivery | Payment</a>
        </Button>
        <div className="flex justify-between w-[inherit] mt-[12px]">
          <div className="flext justify-items-start">
            <Button className="w-[155px] h-[44px] text-lg bg-[#FFFFFF66] pl-3 justify-start" onClick={() =>
            window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`)
          }>
            <img src="/whatsapp.png" alt="" className="w-[24px] h-[24px]" />
              Whatsup
            </Button>
          </div>
          <div>
            <Button className="w-[155px] h-[44px] text-lg bg-[#FFFFFF66] pl-3 justify-start">
            <img src="/instagram.png" alt="" className="w-[26px] h-[26px]" />
              Instagram
            </Button>
          </div>
        </div>
        <Button className="absolute top-0 left-2 px-0 bg-transparent">
          <a href="#groups">
            <img src="/search.png" alt="" className="w-[24px] h-[24px]" />
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
