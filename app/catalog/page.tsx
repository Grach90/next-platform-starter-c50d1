"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { IFlower, IFilterParams, IFlowerOptions } from "@/lib/types";
import { BOUQUET_SIZE_NAMES } from "@/lib/constants";
import { FilterSection } from "@/components/filter-section";
import { useLanguage } from "@/contexts/language-context";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();

  const [flowers, setFlowers] = useState<IFlower[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [perPage] = useState(9);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const groupId = searchParams.get("groupId");
  const isGroupCatalog = !!groupId;

  const buildFilterParams = (): IFilterParams => {
    const filters: IFilterParams = {
      page,
      perPage,
    };

    const flowerName = searchParams.get("flowerName");
    const bouquetType = searchParams.get("bouqetType");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const colors = searchParams.getAll("colors");
    const kinds = searchParams.getAll("kinds");

    if (flowerName) filters.flowerName = flowerName;
    if (bouquetType) filters.bouqetType = Number(bouquetType);
    if (size) filters.size = Number(size);
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (colors.length) filters.colors = colors.map(Number);
    if (kinds.length) filters.kinds = kinds.map(Number);

    return filters;
  };

  useEffect(() => {
    const resetAndLoad = async () => {
      setLoading(true);
      setFlowers([]);
      setPage(1);
      setHasMore(true);
      await loadFlowers(1, true);
      setLoading(false);
    };

    resetAndLoad();
  }, [searchParams, currentLanguage]);

  const loadFlowers = async (nextPage: number, replace = false) => {
    
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      let result: IFlower[];

      if (isGroupCatalog && groupId) {
        const filters = buildFilterParams();
        filters.page = nextPage;
        result = await ApiService.getFlowersByGroup(filters, groupId, currentLanguage);
      } else {
        const filters = buildFilterParams();
        filters.page = nextPage;
        result = await ApiService.filterFlowers(filters, currentLanguage);
      }

      if (replace) {
        setFlowers(result);
      } else {
        setFlowers((prev) => [...prev, ...result]);
      }

      setHasMore(result.length === perPage);
    } catch (err) {
      console.error(err);
      setError("Failed to load flowers");
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible && hasMore && !loadingRef.current) {
          const next = page + 1;
          setPage(next);
          loadFlowers(next);
        }
      },
      { threshold: 1 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [bottomRef.current, hasMore, page]);

  const findPriceInterval = (flowerOptions: IFlowerOptions[]) => {
    if (flowerOptions.length === 1) {
      return `${flowerOptions[0].price} AED`;
    }

    const prices = flowerOptions.map((i) => i.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max ? `${min} AED` : `${min} - ${max} AED`;
  };

  const handleFlowerClick = (flower: IFlower) => {
    router.push(`/flower/${flower.id}`);
  };

  const handleBackClick = () => {
    router.push(isGroupCatalog ? "/#groups" : "/");
  };

  if (loading && flowers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("catalog.back")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {!isGroupCatalog && (
        <div className="bg-card/50">
          <div className="container mx-auto px-4 py-4">
            <FilterSection />
          </div>
        </div>
      )}

      {/* Flowers */}
      <div className="container mx-auto px-[24px] py-8">
        <section
          className="grid gap-[16px] [&>*:nth-child(n+3)]:pt-[32px] md:gap-8 grid-cols-2 lg:grid-cols-3"
          id="catalog-section"
        >
          {flowers.map((flower) => (
            <Card
              key={flower.id}
              className="cursor-pointer overflow-hidden rounded-none"
              onClick={() => handleFlowerClick(flower)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={
                    flower.flowerOptions[0]?.imageLinks[0] ||
                    "/placeholder.svg"
                  }
                  className="h-full w-full object-cover hover:scale-150"
                />
              </div>

              <CardContent className="pt-0 pl-0">
                <h3 className="text-[18px] md:text-[20px] truncate">
                  {flower.name}
                </h3>

                <p className="text-[14px] md:text-[16px] text-[#ee5400]">
                  {findPriceInterval(flower.flowerOptions)}
                </p>

                <div className="flex text-[14px]">
                  <span>{t("flower.size")}:</span>
                  <span className="ml-2 font-bold">
                    {flower.flowerOptions
                      .map(
                        (o) =>
                          BOUQUET_SIZE_NAMES[
                            o.size as keyof typeof BOUQUET_SIZE_NAMES
                          ]
                      )
                      .join(", ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div
            ref={bottomRef}
            className="flex justify-center py-8"
          >
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
