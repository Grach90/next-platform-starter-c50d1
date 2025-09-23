"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";
import type { IFilterParams } from "@/lib/types";
import {
  BOUQUET_TYPE_NAMES,
  BOUQUET_SIZE_NAMES,
  FLOWER_COLOR_NAMES,
  FLOWER_KIND_NAMES,
} from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";

export function FilterSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const [filters, setFilters] = useState<IFilterParams>({});
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<number[]>([]);

  const applyFilters = useCallback(() => {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    router.push(`/catalog?${searchParams.toString()}`);
  }, [filters, router]);

  const handleFilterChange = (key: keyof IFilterParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorToggle = (color: number) => {
    setSelectedColors((prev) => {
      const updated = prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color];
      setFilters((prevFilters) => ({ ...prevFilters, colors: updated }));
      return updated;
    });
  };

  const handleKindToggle = (kind: number) => {
    setSelectedKinds((prev) => {
      const updated = prev.includes(kind)
        ? prev.filter((k) => k !== kind)
        : [...prev, kind];
      setFilters((prevFilters) => ({ ...prevFilters, kinds: updated }));
      return updated;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedColors([]);
    setSelectedKinds([]);
    router.push("/catalog");
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
  );

  return (
    <section className="bg-muted py-16 [&_*]:font-[Montserrat-SemiBold]" id="filter">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t("filter.title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("filter.subtitle")}</p>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <div className="md:col-span-2 lg:col-span-2">
              <Input
                placeholder={t("filter.search_placeholder")}
                value={filters.flowerName || ""}
                onChange={(e) =>
                  handleFilterChange("flowerName", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.bouqetType?.toString() || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "bouqetType",
                    value ? Number.parseInt(value) : undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("filter.bouquet_type")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BOUQUET_TYPE_NAMES).map(([value, name]) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.size?.toString() || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "size",
                    value ? Number.parseInt(value) : undefined
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("filter.size")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BOUQUET_SIZE_NAMES).map(([value, name]) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 ">
              <Input
                type="number"
                placeholder={t("filter.min_price")}
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minPrice",
                    e.target.value
                      ? Number.parseFloat(e.target.value)
                      : undefined
                  )
                }
                className="w-full"
              />
              <Input
                type="number"
                placeholder={t("filter.max_price")}
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxPrice",
                    e.target.value
                      ? Number.parseFloat(e.target.value)
                      : undefined
                  )
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Color and Kind Filters */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3">
                {t("filter.colors")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FLOWER_COLOR_NAMES).map(([value, name]) => (
                  <Badge
                    key={value}
                    variant={
                      selectedColors.includes(Number.parseInt(value))
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleColorToggle(Number.parseInt(value))}
                  >
                    {t(`filter.clear.${name}`)}
                    {selectedColors.includes(Number.parseInt(value)) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-[Montserrat-SemiBold] text-foreground">
                {t("filter.flower_types")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FLOWER_KIND_NAMES).map(([value, name]) => (
                  <Badge
                    key={value}
                    variant={
                      selectedKinds.includes(Number.parseInt(value))
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleKindToggle(Number.parseInt(value))}
                  >
                    {t(`filter.kind.${name}`)}
                    {selectedKinds.includes(Number.parseInt(value)) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:col-span-2 lg:col-span-1 pt-5">
            <Button onClick={applyFilters} className="flex-1">
              <Search className="mr-2 h-4 w-4" />
              {t("filter.search")}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 bg-transparent"
              >
                {t("filter.clear")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
