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
            <h2 className="text-2xl font-bold text-foreground">
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
            <h2 className="text-2xl font-bold text-foreground">
              {t("catalog.flower_collection")}
            </h2>
            <p className="mt-2 text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" id="groups">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground">
            {t("catalog.flower_collection")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg p-0 h-min"
              onClick={() => handleGroupClick(group)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={
                    group.imageLink ||
                    "/placeholder.svg?height=300&width=300&query=flower collection"
                  }
                  alt={group.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block">
                  <h3 className="text-lg font-bold text-white drop-shadow-lg">
                    {group.name}
                  </h3>
                </div>
                <div className="absolute top-0 left-4 right-4 translate-y-4 transition-all duration-300 block md:hidden opacity-100">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {group.name}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
