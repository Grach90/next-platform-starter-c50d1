"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageCircle, X, Plus, Minus, Trash2 } from "lucide-react";
import { useBasket } from "@/contexts/basket-context";
import { useLanguage } from "@/contexts/language-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { BOUQUET_SIZE_NAMES } from "@/lib/constants";

export function BasketSidebar() {
  const {
    state,
    setOpen,
    removeItem,
    updateQuantity,
    clearBasket,
    getTotalPrice,
    getTotalItems,
  } = useBasket();
  const { t } = useLanguage();
  const total = getTotalPrice();
  const basketCount = getTotalItems();
  console.log(state.items, "iteeem");

  const handleWhatsAppRedirect = () => {
    const message =
      state.items.length > 0
        ? `Hello! I'm interested in these flowers:\n${state.items
            .map(
              (item) =>
                `- ${item.flowerName} (Size: ${
                  BOUQUET_SIZE_NAMES[
                    item.size as keyof typeof BOUQUET_SIZE_NAMES
                  ]
                }, Qty: ${item.quantity}, Price: $${(
                  item.price * item.quantity
                ).toFixed(2)}),
                ${item.href}`
            )
            .join("\n")}\n\nTotal: $${total.toFixed(2)}`
        : "Hello! I'm interested in your flower arrangements.";

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleQuantityChange = (
    flowerId: string,
    size: number,
    newQuantity: number
  ) => {
    updateQuantity(flowerId, size, newQuantity);
  };

  const handleRemoveItem = (flowerId: string, size: number) => {
    if (basketCount === 1) setOpen(false);
    removeItem(flowerId, size);
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full max-w-md bg-sidebar text-sidebar-foreground">
        <SheetHeader className="border-b border-sidebar-border pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sidebar-foreground">
              {t("basket.title")}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col py-6 pr-3 pl-3">
          {state.items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-sidebar-accent p-6">
                <MessageCircle className="h-8 w-8 text-sidebar-accent-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t("basket.empty")}
              </h3>
              <p className="text-sm text-sidebar-foreground/70">
                {t("basket.empty_description")}
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 max-h-96 overflow-y-auto">
                {state.items.map((item) => (
                  <div
                    key={`${item.flowerId}-${item.size}`}
                    className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3"
                  >
                    <img
                      src={item.imageLink || "/placeholder.svg"}
                      alt={item.flowerName}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sidebar-accent-foreground truncate">
                        {item.flowerName}
                      </h4>
                      <p className="text-sm text-sidebar-accent-foreground/70">
                        Size:{" "}
                        {
                          BOUQUET_SIZE_NAMES[
                            item.size as keyof typeof BOUQUET_SIZE_NAMES
                          ]
                        }
                      </p>
                      <p className="font-semibold text-sidebar-accent-foreground">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveItem(item.flowerId, item.size)
                        }
                        className="h-6 w-6 text-sidebar-accent-foreground/70 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (basketCount === 1) setOpen(false);
                            handleQuantityChange(
                              item.flowerId,
                              item.size,
                              item.quantity - 1
                            );
                          }}
                          className="h-6 w-6 text-sidebar-accent-foreground hover:bg-sidebar-primary/20"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-sidebar-accent-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(
                              item.flowerId,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="h-6 w-6 text-sidebar-accent-foreground hover:bg-sidebar-primary/20"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>{t("basket.total")}</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      clearBasket();
                    }}
                    variant="outline"
                    className="flex-1 font-[Montserrat-Bold] border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
                  >
                    {t("basket.clear_all")}
                  </Button>
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleWhatsAppRedirect}
            className="w-full font-[Montserrat-Bold] bg-green-600 text-white hover:bg-green-700 mt-4"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("basket.whatsapp")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
