"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function HomeSidebar({ isOpen, onClose }: HomeSidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={onClose} />}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end p-4  border-gray-200">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 flex flex-col items-end [&_a]:pb-2 [&_a]:font-medium" >
             <a href="#filter" onClick={onClose}>Search</a>
             <a href="#groups" onClick={onClose}>Order</a>
             <a href="#groups" onClick={onClose}>Catalog</a>
             <a href="#info" onClick={onClose}>About Us</a>
             <a href="#info" onClick={onClose}>Delivery</a>
             <a href="#info" onClick={onClose}>Payment</a>
        </div>
      </div>
    </>
  )
}
