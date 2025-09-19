"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useBasket } from "@/contexts/basket-context";
import { BasketSidebar } from "./basket-sidebar";
import { usePathname } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function BasketButton() {
  const pathName = usePathname();
  const { state, setOpen, getTotalItems } = useBasket();
  const basketCount = getTotalItems();

  if (pathName.includes("/admin") || pathName.includes("/login")) return null;
  return (
    <>
      {basketCount === 0 || (
        <Button
          variant="default"
          size="icon"
          className="fixed z-10 bottom-4 left-6 h-12 w-12 bg-transparent border-none md:top-25 md:right-12 md:left-auto"
          onClick={() => setOpen(true)}
        >
          <img src="/shop.png" alt="shop" />
          {basketCount > 0 && (
            <span className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff0000] text-xs font-bold text-white">
              {basketCount}
            </span>
          )}
        </Button>
      )}
      {basketCount === 0 || <BasketSidebar />}
      <Button
        variant="default"
        size="icon"
        className="fixed z-10 bottom-2 right-6 h-15 w-15 bg-transparent border-none cursor-pointer md:bottom-10 md:right-12"
        onClick={() =>
          window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`)
        }
      >
        <img src="/whatsapp.png" alt="whatsapp" />
      </Button>
    </>
  );
}
