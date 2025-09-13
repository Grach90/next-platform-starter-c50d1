"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AdminApiService } from "@/lib/admin-api";
import {
  BOUQUET_SIZE_NAMES,
  FLOWER_KIND_NAMES,
  FLOWER_COLOR_NAMES,
  BOUQUET_TYPE_NAMES,
} from "@/lib/constants";
import type { IGroupCard, IFlower, IFlowerOptions, IFlowerAdmin } from "@/lib/types";
import { toast } from "sonner";
import { X } from "lucide-react";

interface FlowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  flower?: IFlowerAdmin | null;
  groups: IGroupCard[];
  onSave: (flower: IFlower) => void;
}

export function FlowerModal({
  isOpen,
  onClose,
  flower,
  groups,
  onSave,
}: FlowerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    priceUSD: "",
    "Descriptions[en]": "",
    "Descriptions[ru]": "",
    "Descriptions[ar]": "",
    groupId: "",
    size: "",
    active: "true",
    flowerKinds: [] as number[],
    flowerColors: [] as number[],
    bouquetType: "",
    flowerOptions:{}
  });
  const [selectedOption, setSelectedOption] = useState<IFlowerOptions>();
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
 
  useEffect(() => {
    if (flower) {
      setFormData({
        name: flower.name,
        priceUSD: flower.flowerOptions[0]?.price?.toString() || "",
        "Descriptions[en]": flower["Descriptions[en]"],
        "Descriptions[ru]": flower["Descriptions[ru]"], // In real app, these would be separate fields
        "Descriptions[ar]": flower["Descriptions[ar]"],
        groupId: flower.flowerGroupId,
        size: flower.flowerOptions[0]?.size?.toString() || "",
        active: flower.isActive ? "true" : "false", // Assuming active status
        flowerKinds: flower.flowerKinds || [],
        flowerColors: flower.flowerColors || [],
        bouquetType: flower.bouqetType?.toString() || "",
        flowerOptions: flower.flowerOptions || {},
      });
      setImages(flower.flowerOptions[0]?.imageLinks || []);
      setSelectedOption(flower.flowerOptions[0]);
    } else {
      setFormData({
        name: "",
        priceUSD: "",
        "Descriptions[en]": "",
        "Descriptions[ru]": "",
        "Descriptions[ar]": "",
        groupId: "",
        size: "",
        active: "true",
        flowerKinds: [],
        flowerColors: [],
        bouquetType: "",
        flowerOptions:{}
      });
      setImages([]);
    }
  }, [flower, isOpen]);

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = "";
  };

  const toggleFlowerKind = (kindId: number) => {
    console.log(kindId, "kindId");
    
    setFormData((prev) => ({
      ...prev,
      flowerKinds: prev.flowerKinds.includes(kindId)
        ? prev.flowerKinds.filter((id) => id !== kindId)
        : [...prev.flowerKinds, kindId],
    }));
  };

  const toggleFlowerColor = (colorId: number) => {
    setFormData((prev) => ({
      ...prev,
      flowerColors: prev.flowerColors.includes(colorId)
        ? prev.flowerColors.filter((id) => id !== colorId)
        : [...prev.flowerColors, colorId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.priceUSD ||
      !formData.groupId ||
      !formData.size
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      

      const flowerData = new FormData();
      const id = flower?.id || "";
      const bouqetType = formData.bouquetType
          ? Number.parseInt(formData.bouquetType)
          : 1;
          flowerData.append("Name",formData.name);
          flowerData.append("Descriptions[en]",formData["Descriptions[en]"]);
          flowerData.append("Descriptions[ru]",formData["Descriptions[ru]"]);
          flowerData.append("Descriptions[ar]",formData["Descriptions[ar]"]);
          flowerData.append("FlowerGroupId",formData.groupId);
          flowerData.append("BouqetType",bouqetType.toString())
          
          for(let i=0; i < formData.flowerColors.length; i++){
            flowerData.append(`FlowerColors[${i}]`, formData.flowerColors[i].toString())
          }
          for(let i=0; i < formData.flowerKinds.length; i++){
            flowerData.append(`FlowerKinds[${i}]`, formData.flowerKinds[i].toString())
          }
          
      if(flower){
        flowerData.append("id",id);
        let currentOptionIndex = flower?.flowerOptions.findIndex(f=> f.size.toString() === formData.size) === -1 ? flower?.flowerOptions.length 
        : flower?.flowerOptions.findIndex(f=> f.size.toString() === formData.size)

        for(let i = 0; i < flower?.flowerOptions.length; i++){
          if(i === currentOptionIndex) continue;
          flowerData.append(`FlowerOptions[${i}].Size`, flower?.flowerOptions[i].size);
          flowerData.append(`FlowerOptions[${i}].Price`, flower?.flowerOptions[i].price);
          flowerData.append(`FlowerOptions[${i}].ImageLinks`, flower?.flowerOptions[i].imageLinks);
        }
        
  
        flowerData.append(`FlowerOptions[${currentOptionIndex}].Size`, formData.size);
        flowerData.append(`FlowerOptions[${currentOptionIndex}].Price`, formData.priceUSD);
        for (let i = 0; i < images.length; i++) {
          const dataUrl = images[i]; // например: "data:image/png;base64,..."
          if(!dataUrl.includes("https:")){
            const file = dataURLtoFile(dataUrl, `image_${i}.png`);
            flowerData.append(`FlowerOptions[${currentOptionIndex}].Images`, file);
          }else{
            flowerData.append(`FlowerOptions[${currentOptionIndex}].ImageLinks`, dataUrl);
          }
        }
      }else {
        flowerData.append(`FlowerOptions[0].Size`, formData.size);
        flowerData.append(`FlowerOptions[0].Price`, formData.priceUSD);
        for (let i = 0; i < images.length; i++) {
          const dataUrl = images[i]; // например: "data:image/png;base64,..."
            const file = dataURLtoFile(dataUrl, `image_${i}.png`);
            flowerData.append(`FlowerOptions[0].Images`, file);
        }
        // ключ должен совпадать с тем, что ASP.NET ожидает
  }


// функция конвертации DataURL → File
function dataURLtoFile(dataUrl: any, filename: string) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


let savedFlower: IFlower;
if (flower) {
  const isActive = formData.active === "true" ? true : false;
        if(isActive !== flower.isActive){
         const data = await AdminApiService.ActiveInactiveFlower(flower.id, isActive);
          flowerData.append("data",data)
        }
        savedFlower = await AdminApiService.updateFlower(flower.id, flowerData);
      } else {
        savedFlower = await AdminApiService.createFlower(flowerData);
      }
      console.log(savedFlower,"savedFlower");

      onSave(savedFlower);
      toast.success(`Flower ${flower ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("Failed to save flower:", error);
      toast.error("Failed to save flower. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSizeChange = (optionId: string) => {
    let index;
    const option = flower?.flowerOptions.find((opt,i) => {
      index = i;
     return opt.id === optionId})
    if (option) {
      option.index = index;
      console.log(option,"option");
      setSelectedOption(option);
      setImages(option.imageLinks);
      setFormData((prev)=> ({...prev, priceUSD: option.price.toString(), size: option.size.toString()}) )
    }
  };

  const handleDeleteFlowerOption = async ()=> {
    try {
 setSaving(true);
    const flowerData = new FormData();
      const id = flower?.id || "";
      const bouqetType = formData.bouquetType
          ? Number.parseInt(formData.bouquetType)
          : 1;
          flowerData.append("Name",formData.name);
          flowerData.append("Descriptions[en]",formData["Descriptions[en]"]);
          flowerData.append("Descriptions[ru]",formData["Descriptions[ru]"]);
          flowerData.append("Descriptions[ar]",formData["Descriptions[ar]"]);
          flowerData.append("FlowerGroupId",formData.groupId);
          flowerData.append("BouqetType",bouqetType.toString())
          
          for(let i=0; i < formData.flowerColors.length; i++){
            flowerData.append(`FlowerColors[${i}]`, formData.flowerColors[i].toString())
          }
          for(let i=0; i < formData.flowerKinds.length; i++){
            flowerData.append(`FlowerKinds[${i}]`, formData.flowerKinds[i].toString())
          }
      flowerData.append("id",id);
        let currentOptionIndex = flower?.flowerOptions.findIndex(f=> f.size.toString() === formData.size) === -1 ? flower?.flowerOptions.length 
        : flower?.flowerOptions.findIndex(f=> f.size.toString() === formData.size)

        for(let i = 0; i < flower?.flowerOptions.length; i++){
          if(i === currentOptionIndex) {
            flowerData.append(`FlowerOptions[${i}].IsDeleted`,"true");
            continue;
          }
          flowerData.append(`FlowerOptions[${i}].Size`, flower?.flowerOptions[i].size);
          flowerData.append(`FlowerOptions[${i}].Price`, flower?.flowerOptions[i].price);
          flowerData.append(`FlowerOptions[${i}].ImageLinks`, flower?.flowerOptions[i].imageLinks);
        }
      const savedFlower = await AdminApiService.updateFlower(flower.id, flowerData);

      onSave(savedFlower);
      toast.success(`Flower Option was deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete flower option:", error);
      toast.error("Failed to delete flower option. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{flower ? "Edit Flower" : "Add New Flower"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
           {flower &&  <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Flower Options
              </label>
              <Select
                value={selectedOption?.id || ""}
                onValueChange={handleSizeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Option size" />
                </SelectTrigger>
                <SelectContent>
                  {flower.flowerOptions.map((option, i) => (
                    <SelectItem key={i} value={option.id}>
                      {
                        BOUQUET_SIZE_NAMES[
                          option.size as keyof typeof BOUQUET_SIZE_NAMES
                        ]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {flower.flowerOptions.length > 1 && <Button type="button" variant="destructive" className="mt-4" onClick={handleDeleteFlowerOption}>
                {saving ? "Deleting..." : "Delete Option"}
              </Button>}
            </div>}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Flower Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter flower name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Price in USD *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.priceUSD}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, priceUSD: e.target.value }))
                }
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (English)
              </label>
              <Textarea
                value={formData["Descriptions[en]"]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    "Descriptions[en]": e.target.value,
                  }))
                }
                placeholder="Enter description in English"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (Russian)
              </label>
              <Textarea
                value={formData["Descriptions[ru]"]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    "Descriptions[ru]": e.target.value,
                  }))
                }
                placeholder="Enter description in Russian"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (Arabic)
              </label>
              <Textarea
                value={formData["Descriptions[ar]"]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    "Descriptions[ar]": e.target.value,
                  }))
                }
                placeholder="Enter description in Arabic"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 [&_button]:w-full">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Group *
                </label>
                <Select
                  value={formData.groupId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, groupId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="[&_button]:w-full">
                <label className="text-sm font-medium mb-2 block">Size *</label>
                <Select
                  value={formData.size}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, size: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BOUQUET_SIZE_NAMES).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {flower && <div className="[&_button]:w-full">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={formData.active}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, active: value  }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Flower Kinds
                </label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[80px] max-h-32 overflow-y-auto">
                  {Object.entries(FLOWER_KIND_NAMES).map(([key, name]) => (
                    <Badge
                      key={key}
                      variant={
                        formData.flowerKinds.includes(Number.parseInt(key))
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => toggleFlowerKind(Number.parseInt(key))}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Flower Colors
                </label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[80px] max-h-32 overflow-y-auto">
                  {Object.entries(FLOWER_COLOR_NAMES).map(([key, name]) => (
                    <Badge
                      key={key}
                      variant={
                        formData.flowerColors.includes(Number.parseInt(key))
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => toggleFlowerColor(Number.parseInt(key))}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="[&_button]:w-full">
                <label className="text-sm font-medium mb-2 block">
                  Bouquet Type
                </label>
                <Select
                  value={formData.bouquetType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, bouquetType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bouquet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BOUQUET_TYPE_NAMES).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Images</h3>
                <div>
                  <input
                    type="file"
                    id="image-upload1"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("image-upload1")?.click()
                    }
                  >
                    Add Images
                  </Button>
                </div>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Flower image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  <p>No images uploaded yet</p>
                  <p className="text-sm">
                    Click "Add Images" to upload flower photos
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : flower ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
