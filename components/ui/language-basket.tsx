"use client";

import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "../language-switcher";
import { useState } from "react";
import { HomeSidebar } from "@/components/home-sidebar";
import { Button } from "@/components/ui/button";

export function LanguageBasket() {
  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (pathName.includes("/admin") || pathName.includes("/login")) return null;
  return (
    <div className="fixed w-[82px] h-[36px] top-4 right-4 z-20 flex items-center gap-3">
      <LanguageSwitcher />
      <div className="">
        <Button
          onClick={toggleSidebar}
          className="h-[36px] w-[36px] bg-[#F4F4FA4D] border-none backdrop-blur-sm p-[8px] rounded-[8px]"
        >
          <img src="/menu.png" className="h-5 w-5" />
        </Button>
      </div>
      <HomeSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
}
