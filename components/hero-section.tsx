"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
// import { useEffect, useState } from "react";
// import { ApiService } from "@/lib/api";

export function HeroSection() {
  const { t } = useLanguage();
  // const [pgeImge, setPgeImge] = useState<string | null>(null);

  // useEffect(() => {
  //   getPgeImge();
  // }, []);

  // const getPgeImge = async () => {
  //   const { imageLink }: string = await ApiService.getPgeImge();
  //   if (imageLink) setPgeImge(imageLink);
  // };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={"/photo.png"}
          alt="Luxury flower arrangement background"
          className="h-full w-full object-cover object-top-right hidden md:block"
        />
        <img
          src={"/photo_1.jpg"}
          alt="Luxury flower arrangement background"
          className="h-full w-full object-cover object-left block md:hidden"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <a
        href="#groups"
        className="absolute font-[Montserrat-Regular] z-50 bottom-30 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-transparent border-2 text-white text-center pt-6 hidden md:block cursor-pointer"
      >
        {t("hero.choose")}
      </a>
      <div className=" [&_a]:font-[Playfair-SemiBold] absolute w-[320px] h-[206px] bottom-20 z-20 items-center flex-col left-1/2 -translate-x-1/2 block md:hidden">
        <a href="#filter">
          <Button className="rounded-[4px] w-[320px] h-[44px] text-[20px] bg-[#FFFFFF66] justify-start pl-10">
            {t("hero.search...")}
          </Button>
        </a>
        <a href="#groups">
          <Button className="rounded-[4px] bg-[#AB96D1] w-[320px] h-[44px] text-[20px] mt-3">
            {t("hero.Order")}
          </Button>
        </a>
        <a href="#info">
          <Button className="rounded-[4px] bg-[#E5CAF3] w-[320px] h-[44px] text-[20px] mt-3">
            {t("hero.aboutus")}
          </Button>
        </a>
        <div className="flex justify-between w-[inherit] mt-[12px]">
          <div className="flext justify-items-start">
            <Button
              className="w-[155px] h-[44px] font-[Playfair-SemiBold] text-[20px] bg-[#FFFFFF66] pl-3 justify-start"
              onClick={() =>
                window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`)
              }
            >
              <img src="/whatsapp.png" alt="" className="w-[24px] h-[24px]" />
              WhatsApp
            </Button>
          </div>
          <div>
            <Button
              className="w-[155px] h-[44px] text-[20px] font-[Playfair-SemiBold] bg-[#FFFFFF66] pl-3 justify-start"
              onClick={() =>
                window.open(
                  `https://www.instagram.com/luxerosedubai?igsh=MXdsejJ3ZnpxZzA2Nw==`
                )
              }
            >
              <img src="/instagram.png" alt="" className="w-[35px] h-[35px]" />
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
      <div className="absolute right-10 w-[40%] top-70 z-10 hidden md:flex justify-center">
        <div className="text-center mt-25 mr-10 ml-10">
          {/* SVG Logo Placeholder - Replace with actual SVG */}
          <img src="/logo 1.png" alt="" />
        </div>
      </div>
      <div className="absolute inset-0 z-10 flex md:hidden justify-center">
        <div className="text-center mt-25 mr-10 ml-10">
          {/* SVG Logo Placeholder - Replace with actual SVG */}
          <img src="/logo 1.png" alt="" />
        </div>
      </div>
    </section>
  );
}
