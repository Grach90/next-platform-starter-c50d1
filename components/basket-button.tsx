"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useBasket } from "@/contexts/basket-context"
import { BasketSidebar } from "./basket-sidebar"

export function BasketButton() {
  const { state, setOpen, getTotalItems } = useBasket()
  const basketCount = getTotalItems()

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative h-12 w-12 rounded-full border-2 border-white/30 bg-green-900/20 text-white backdrop-blur-sm "
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="h-5 w-5" />
        {basketCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {basketCount}
          </span>
        )}
      </Button>

      <BasketSidebar />
    </>
  )
}
