"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeSidebar({ isOpen, onClose }: HomeSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-40 md:w-[250px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end p-4 border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 flex gap-[8px] flex-col items-end [&_a]:border-b [&_a]:w-[118px] md:[&_a]:w-[218px] [&_a]:h-[40px] [&_a]:pb-2 [&_a]:font-[18px] [&_a]:font-[Playfair-SemiBold]">
          <a href="/#filter" onClick={onClose}>
            SEARCH
          </a>
          <a href="/#groups" onClick={onClose}>
            ORDER
          </a>
          <a href="/#groups" onClick={onClose}>
            CATALOG
          </a>
          <a href="/#info" onClick={onClose}>
            ABOUT US
          </a>
          <a href="/#info" onClick={onClose}>
            DELIVERY
          </a>
          <a href="/#info" onClick={onClose}>
            PAYMENT
          </a>
        </div>
      </div>
    </>
  );
}
