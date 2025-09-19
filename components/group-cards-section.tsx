"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { IGroupCard } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";

export function GroupCardsSection() {
  const { t, currentLanguage } = useLanguage();
  const router = useRouter();
  const [groups, setGroups] = useState<IGroupCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, [currentLanguage]);

  const loadGroups = async () => {
    try {
      setLoading(true);

      const result = await ApiService.getAllFlowerGroups(currentLanguage);
      setGroups(result);
    } catch (err) {
      setError("Failed to load flower groups");
      console.error("Error loading groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (group: IGroupCard) => {
    router.push(`/catalog?groupId=${group.id}`);
  };

  if (loading) {
    return (
      <section className="py-16" id="groups">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-[MyFont] text-2xl font-bold text-foreground">
              {t("catalog.flower_collection")}
            </h2>
            {/* <p className="mt-2 text-muted-foreground">
              Explore our curated flower groups
            </p> */}
            <div className="mt-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16" id="groups">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-[MyFont] text-2xl font-bold text-foreground">
              {t("catalog.flower_collection")}
            </h2>
            <p className="font-[MyFont] mt-2 text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const interval: any = {
    Bouquets: 450,
    "Mono / Duo": 350,
    "Baskets/Boxes": 750,
    "Luxury Wow / XXL": 2500,
  };

  return (
    <section className="py-16" id="groups">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-[MyFont] text-2xl font-bold text-foreground">
            {t("catalog.flower_collection")}
          </h2>
        </div>

        <div className="grid gap-0.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {groups.map((group) => (
            <Card
              key={group.id}
              className=" group rounded-none cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg p-0 h-min"
              onClick={() => handleGroupClick(group)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    group.imageLink ||
                    "/placeholder.svg?height=300&width=300&query=flower collection"
                  }
                  alt={group.name}
                  className="w-full object-cover transition-transform duration-300"
                />
                <div className="absolute hidden md:block w-full top-0 h-full bg-[#00000063] transition-opacity duration-300 group-hover:bg-transparent" />
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-300 hidden md:block">
                  <h3 className="font-[MyFont] font-bold text-white text-2xl drop-shadow-lg w-max">
                    {group.name}
                  </h3>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 block md:hidden opacity-100">
                  <h3 className="font-[MyFont] text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">
                    {group.name}
                  </h3>
                </div>
                {interval[group.name] && (
                  <p className="absolute font-[MyFont] md:hidden w-[200px] h-[30px] -bottom-[15px] -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-center group-hover:block">
                    {`From ${interval[group.name]} aed`}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
