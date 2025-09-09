"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import type { IGroupCard, IFlower } from "@/lib/types";

interface FlowersTableProps {
  flowers: IFlower[];
  groups: IGroupCard[];
  onEdit: (flower: IFlower) => void;
  onDelete: (flowerId: string) => void;
}

export function FlowersTable({
  flowers,
  groups,
  onEdit,
  onDelete,
}: FlowersTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || "Unknown";
  };

  const handleDelete = async (flowerId: string) => {
    setDeletingId(flowerId);
    try {
      await onDelete(flowerId);
    } finally {
      setDeletingId(null);
    }
  };

  if (flowers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No flowers found matching your filters.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="hidden md:table-cell">Group</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flowers.map((flower) => {
              return (
                <TableRow key={flower.id}>
                  <TableCell>
                    {flower.flowerOptions[0]?.imageLinks?.[0] ? (
                      <img
                        src={
                          flower.flowerOptions[0].imageLinks[0] ||
                          "/placeholder.svg"
                        }
                        alt={flower.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{flower.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${flower.flowerOptions[0]?.price?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs">
                    <div className="truncate" title={flower.description}>
                      {flower.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getGroupName(flower.flowerGroupId)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={flower.IsActive ? "default" : "destructive"}
                    >
                      {flower.IsActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(flower)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === flower.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Flower</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{flower.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(flower.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
