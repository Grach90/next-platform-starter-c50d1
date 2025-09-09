"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ImageUploadSection } from "@/components/admin/image-upload-section";
import { FlowerModal } from "@/components/admin/flower-modal";
import { FlowersTable } from "@/components/admin/flowers-table";
import { AdminApiService } from "@/lib/admin-api";
import type { IGroupCard, IFlower } from "@/lib/types";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [groups, setGroups] = useState<IGroupCard[]>([]);
  const [flowers, setFlowers] = useState<IFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [nameFilter, setNameFilter] = useState(searchParams.get("name") || "");
  const [groupFilter, setGroupFilter] = useState(
    searchParams.get("group") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      reloadTableData();
    }
  }, [nameFilter, groupFilter, statusFilter]);

  useEffect(() => {
    if (loadMoreRef.current && hasMore && !loading && !tableLoading) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loadingMore) {
            loadMoreFlowers();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, tableLoading, loadingMore]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const groupsData = await AdminApiService.getAllFlowerGroups();
      const flowers = await AdminApiService.getAllFlowers();
      if (groupsData) {
        setGroups(groupsData);
      }
      if (flowers) {
        setFlowers(flowers);
      }

      // await reloadTableData();
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const reloadTableData = async () => {
    try {
      setTableLoading(true);
      setCurrentPage(1);
      setHasMore(true);

      const flowersData = await AdminApiService.filterFlowers({
        FlowerFilter: statusFilter === "all" ? "all" : statusFilter,
        FlowerGroupId: groupFilter === "all" ? undefined : groupFilter,
        Name: nameFilter || undefined,
      });
      console.log(flowersData, "flowersData");

      setFlowers(flowersData);
      setHasMore(flowersData.length === 10);
    } catch (error) {
      console.error("Failed to reload table data:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const loadMoreFlowers = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const moreFlowers = await AdminApiService.filterFlowers({
        FlowerFilter: statusFilter === "all" ? "all" : statusFilter,
        FlowerGroupId: groupFilter === "all" ? undefined : groupFilter,
        Name: nameFilter || undefined,
        page: nextPage,
      });

      if (moreFlowers.length === 0) {
        setHasMore(false);
      } else {
        setFlowers((prev) => [...prev, ...moreFlowers]);
        setCurrentPage(nextPage);
        setHasMore(moreFlowers.length === 10);
      }
    } catch (error) {
      console.error("Failed to load more flowers:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [
    currentPage,
    nameFilter,
    groupFilter,
    statusFilter,
    loadingMore,
    hasMore,
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlower, setEditingFlower] = useState<IFlower | null>(null);

  const handleAddFlower = () => {
    setEditingFlower(null);
    setIsModalOpen(true);
  };

  const handleEditFlower = (flower: IFlower) => {
    setEditingFlower(flower);
    setIsModalOpen(true);
  };

  const handleDeleteFlower = async (flowerId: string) => {
    try {
      await AdminApiService.deleteFlower(flowerId);
      setFlowers((prev) => prev.filter((f) => f.id !== flowerId));
    } catch (error) {
      console.error("Failed to delete flower:", error);
    }
  };

  const handleFlowerSaved = (flower: IFlower) => {
    if (editingFlower) {
      setFlowers((prev) => prev.map((f) => (f.id === flower.id ? flower : f)));
    } else {
      setFlowers((prev) => [flower, ...prev]);
    }
    setIsModalOpen(false);
  };

  const updateSearchParams = (name: string, group: string, status: string) => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (group && group !== "all") params.set("group", group);
    if (status && status !== "all") {
      params.set("status", status);
    } else params.set("status", "all");

    const newUrl = params.toString() ? `admin/?${params.toString()}` : "/admin";
    router.replace(newUrl, { scroll: false });
  };

  const handleNameFilterChange = (value: string) => {
    setNameFilter(value);
    updateSearchParams(value, groupFilter, statusFilter);
  };

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value);
    updateSearchParams(nameFilter, value, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    updateSearchParams(nameFilter, groupFilter, value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Panel</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Homepage Image Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadSection />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flowers Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Flower Name
                  </label>
                  <Input
                    placeholder="Search by name..."
                    value={nameFilter}
                    onChange={(e) => handleNameFilterChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Group
                  </label>
                  <Select
                    value={groupFilter}
                    onValueChange={handleGroupFilterChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="Archived">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleAddFlower}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Flower
              </Button>
            </div>

            {tableLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Loading flowers...</div>
              </div>
            ) : (
              <FlowersTable
                flowers={flowers}
                groups={groups}
                onEdit={handleEditFlower}
                onDelete={handleDeleteFlower}
              />
            )}

            {hasMore && !tableLoading && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {loadingMore && (
                  <div className="text-muted-foreground">
                    Loading more flowers...
                  </div>
                )}
              </div>
            )}

            {!hasMore && flowers.length > 0 && !tableLoading && (
              <div className="text-center py-4 text-muted-foreground">
                No more flowers to load
              </div>
            )}
          </CardContent>
        </Card>

        <FlowerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          flower={editingFlower}
          groups={groups}
          onSave={handleFlowerSaved}
        />
      </div>
    </div>
  );
}
