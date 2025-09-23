"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { IFlower, IFlowerOptions, IBasketItem } from "@/lib/types";
import {
  BOUQUET_SIZE_NAMES,
  BOUQUET_TYPE_NAMES,
  FLOWER_COLOR_NAMES,
  FLOWER_KIND_NAMES,
} from "@/lib/constants";
import { ImageCarousel } from "@/components/image-carousel";
import { useBasket } from "@/contexts/basket-context";
import { ApiService } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

const getFlowerById = async (
  id: string,
  currentLanguage: string
): Promise<IFlower> => {
  const result = await ApiService.getFlowerById(id, currentLanguage);
  if (!result) {
    throw new Error("Flower not found");
  }
  return result;
};

export default function FlowerDetailPage() {
  const params = useParams();

  const router = useRouter();
  const [flower, setFlower] = useState<IFlower | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<IFlowerOptions | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const { addItem } = useBasket();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    loadFlower();
  }, [params.id, currentLanguage]);

  const loadFlower = async () => {
    try {
      setLoading(true);
      const result = await getFlowerById(params.id as string, currentLanguage);
      setFlower(result);
      setSelectedOption(result.flowerOptions[0]);
    } catch (err) {
      setError("Failed to load flower details");
      console.error("Error loading flower:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (optionId: string) => {
    const option = flower?.flowerOptions.find((opt) => opt.id === optionId);
    if (option) {
      setSelectedOption(option);
      setSelectedImageIndex(0); // Reset to first image when size changes
    }
  };

  const handleAddToBasket = () => {
    if (!flower || !selectedOption) return;

    const basketItem: IBasketItem = {
      flowerId: flower.id,
      flowerName: flower.name,
      size: selectedOption.size,
      price: selectedOption.price,
      imageLink: selectedOption.imageLinks[0],
      href: window.location.href,
      quantity: 1,
    };

    addItem(basketItem);

    toast.success(`${flower.name} added to basket!`, {
      description: `${t("flower.size")}: ${
        BOUQUET_SIZE_NAMES[
          selectedOption.size as keyof typeof BOUQUET_SIZE_NAMES
        ]
      } - $${selectedOption.price}`,
    });
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !flower) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-destructive mb-4">{error || "Flower not found"}</p>
        <Button onClick={handleBackClick}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div>
        <div className="container mx-auto px-4 py-4">
          <div>
            <a href="/" className=" flex justify-center grow-1 cursor-pointer">
              <img src="/logo-2.svg" alt="logo" className="w-20" />
            </a>
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("flower.back")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={
                  selectedOption?.imageLinks[selectedImageIndex] ||
                  "/placeholder.svg"
                }
                alt={flower.name}
                className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                onClick={() => setCarouselOpen(true)}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {selectedOption?.imageLinks.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-accent"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${flower.name} view ${index + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-[24px] font-bold text-foreground pb-[16px]">
                {flower.name}
              </h1>
              <p className="text-[16px] font-[Montserrat-Bold] text-[#EE5400]">
                {selectedOption?.price} AED
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <label className="text-[16px] font-[Montserrat-SemiBold] text-foreground mb-2 block">
                {t("flower.size")}
              </label>
              <Select
                value={selectedOption?.id || ""}
                onValueChange={handleSizeChange}
              >
                <SelectTrigger className="w-full text-[18px]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {flower.flowerOptions.map((option, i) => (
                    <SelectItem key={i} value={option.id} className="text-[16px]">
                      {
                        BOUQUET_SIZE_NAMES[
                          option.size as keyof typeof BOUQUET_SIZE_NAMES
                        ]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[16px] font-[Montserrat-SemiBold] text-foreground pb-[8px]">
                {t("flower.description")}
              </h3>
              <p className="text-[#000000CC] text-[14px] font-[Montserrat-Regular]  leading-relaxed">
                {flower.description || "-"}
              </p>
            </div>

            {/* Bouquet Type */}
            <div>
              <h3 className="text-[16px] font-[Montserrat-SemiBold] text-foreground pb-[8px]">
                {t("flower.bouquet_type")}
              </h3>
              <Badge variant="secondary" className="bg-[#F2F2F2] text-[#000000] text-[14px] font-[Montserrat-Regular]">
                {
                  BOUQUET_TYPE_NAMES[
                    flower.bouqetType as keyof typeof BOUQUET_TYPE_NAMES
                  ]
                }
              </Badge>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-[16px] font-[Montserrat-SemiBold] text-foreground pb-[8px]">
                {t("flower.available_colors")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {flower.flowerColors.map((color, i) => (
                  <Badge key={i} variant="outline" className="text-[14px] font-[Montserrat-Regular]">
                    {t(
                      `filter.clear.${
                        FLOWER_COLOR_NAMES[
                          color as keyof typeof FLOWER_COLOR_NAMES
                        ]
                      }`
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Flower Types */}
            <div>
              <h3 className="text-[16px] font-[Montserrat-SemiBold] text-foreground pb-[8px]">
                {t("flower.flower_types")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {flower.flowerKinds.map((kind, i) => (
                  <Badge key={i} variant="outline" className="text-[14px] font-[Montserrat-Regular]">
                    {t(
                      `filter.kind.${
                        FLOWER_KIND_NAMES[
                          kind as keyof typeof FLOWER_KIND_NAMES
                        ]
                      }`
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Add to Basket Button */}
            <Button
              onClick={handleAddToBasket}
              className="w-full bg-accent text-[18px] font-[Montserrat-Bold] hover:bg-accent/90"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {t("flower.add_to_basket")} - ${selectedOption?.price}
            </Button>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      {selectedOption && (
        <ImageCarousel
          images={selectedOption.imageLinks}
          isOpen={carouselOpen}
          onClose={() => setCarouselOpen(false)}
          initialIndex={selectedImageIndex}
          title={flower.name}
        />
      )}
    </div>
  );
}
