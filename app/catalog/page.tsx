"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { IFlower, IFilterParams } from "@/lib/types";
import { BOUQUET_SIZE_NAMES } from "@/lib/constants";
import { FilterSection } from "@/components/filter-section";
import { useLanguage } from "@/contexts/language-context";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const [flowers, setFlowers] = useState<IFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const groupId = searchParams.get("groupId");
  const isGroupCatalog = !!groupId;

  useEffect(() => {
    loadFlowers();
  }, [searchParams, currentLanguage]);

  const loadFlowers = async () => {
    try {
      setLoading(true);
      setError(null);

      let result: IFlower[];

      if (isGroupCatalog && groupId) {
        // Load flowers by group
        result = await ApiService.getFlowersByGroup(groupId, currentLanguage);
      } else {
        // Load flowers by filter
        const filters: IFilterParams = {};

        const flowerName = searchParams.get("flowerName");
        const bouqetType = searchParams.get("bouqetType");
        const size = searchParams.get("size");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const colors = searchParams.getAll("colors");
        const kinds = searchParams.getAll("kinds");

        if (flowerName) filters.flowerName = flowerName;
        if (bouqetType) filters.bouqetType = Number.parseInt(bouqetType);
        if (size) filters.size = Number.parseInt(size);
        if (minPrice) filters.minPrice = Number.parseFloat(minPrice);
        if (maxPrice) filters.maxPrice = Number.parseFloat(maxPrice);
        if (colors.length)
          filters.colors = colors.map((c) => Number.parseInt(c));
        if (kinds.length) filters.kinds = kinds.map((k) => Number.parseInt(k));

        result = await ApiService.filterFlowers(filters, currentLanguage);
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = "#catalog-section";
          a.click();
          // router.push("#catalog-section");
        }, 200);
      }

      setFlowers(result.slice(0, 10)); // Initial 10 items
      setHasMore(result.length > 10);
      setPage(1);
    } catch (err) {
      setError("Failed to load flowers. Please try again.");
      console.error("Error loading flowers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    // TODO: Implement pagination with API
    const nextPageItems = flowers.length + 10;
    setPage((prev) => prev + 1);
    // For now, just simulate loading more
    setHasMore(false);
  };

  const handleFlowerClick = (flower: IFlower) => {
    router.push(`/flower/${flower.id}`);
  };

  const handleBackClick = () => {
    if (isGroupCatalog) {
      router.push("/#groups");
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadFlowers}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className=" bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleBackClick}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("catalog.back")}
              </Button>
              <div>
                <h1 className="text-md md:text-lg font-bold">
                  {isGroupCatalog
                    ? t("catalog.flower_collection")
                    : t("catalog.search_results")}
                </h1>
                <p className="text-muted-foreground">
                  {flowers.length} {t("catalog.flowers_found")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FilterSection */}
      {!isGroupCatalog && (
        <div className="bg-card/50">
          <div className="container mx-auto px-4 py-4">
            <FilterSection />
          </div>
        </div>
      )}

      {/* Flowers Grid */}
      <div className="container mx-auto px-4 py-8">
        {flowers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("catalog.no_flowers")}</p>
            <Button onClick={handleBackClick} className="mt-4">
              {t("catalog.go_back")}
            </Button>
          </div>
        ) : (
          <>
            <section
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              id="catalog-section"
            >
              {flowers.map((flower) => (
                <Card
                  key={flower.id}
                  className="p-0 cursor-pointer overflow-hidden transition-transform hover:scale-105"
                  onClick={() => handleFlowerClick(flower)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        flower.flowerOptions[0]?.imageLinks[0] ||
                        "/placeholder.svg?height=300&width=300"
                      }
                      alt={flower.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-card-foreground truncate">
                        {flower.name}
                      </h3>
                      <p className="font-bold text-accent">
                        ${flower.flowerOptions[0]?.price || 0}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("flower.size")}:
                      </p>
                      <div className="flex pl-5 text-sm text-muted-foreground mt-1">
                        {flower.flowerOptions.map((option, i, arr) => (
                          <p key={i}>
                            {
                              BOUQUET_SIZE_NAMES[
                                option.size as keyof typeof BOUQUET_SIZE_NAMES
                              ]
                            }{" "}
                            {i === arr.length - 1 ? "" : ", "}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} variant="outline">
                  {t("catalog.load_more")}
                </Button>
              </div>
            )}
          </>
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
