"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MagnifyingGlassProps {
  src: string;
  alt: string;
  className?: string;
  zoomFactor?: number;
  lensSize?: number;
  children?: React.ReactNode;
}

export function MagnifyingGlass({
  src,
  alt,
  className,
  zoomFactor = 2.5,
  lensSize = 150,
  children,
}: MagnifyingGlassProps) {
  const [isActive, setIsActive] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Keep lens within image bounds
      const lensX = Math.max(
        lensSize / 2,
        Math.min(x, rect.width - lensSize / 2)
      );
      const lensY = Math.max(
        lensSize / 2,
        Math.min(y, rect.height - lensSize / 2)
      );

      setLensPosition({ x: lensX, y: lensY });

      // Calculate background position for zoom effect
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      setBackgroundPosition({ x: bgX, y: bgY });
    },
    [lensSize]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (!imageRef.current || !e.touches[0]) return;

      const rect = imageRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // Keep lens within image bounds
      const lensX = Math.max(
        lensSize / 2,
        Math.min(x, rect.width - lensSize / 2)
      );
      const lensY = Math.max(
        lensSize / 2,
        Math.min(y, rect.height - lensSize / 2)
      );

      setLensPosition({ x: lensX, y: lensY });

      // Calculate background position for zoom effect
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      setBackgroundPosition({ x: bgX, y: bgY });
    },
    [lensSize]
  );

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    setIsActive(true);
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
  };

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    // Add touch event listeners
    imageElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    imageElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    imageElement.addEventListener("touchend", handleTouchEnd);

    return () => {
      imageElement.removeEventListener("touchstart", handleTouchStart);
      imageElement.removeEventListener("touchmove", handleTouchMove);
      imageElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchMove]);

  return (
    <div
      ref={imageRef}
      className={cn("relative overflow-hidden cursor-crosshair", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Image */}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Magnifying Lens */}
      {isActive && (
        <div
          ref={lensRef}
          className="absolute pointer-events-none rounded-full border-4 border-white shadow-lg"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensPosition.x - lensSize / 2,
            top: lensPosition.y - lensSize / 2,
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomFactor * 100}%`,
            backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
            backgroundRepeat: "no-repeat",
            transform: "scale(1)",
            transition: "opacity 0.2s ease-in-out",
          }}
        />
      )}

      {/* Optional children (like overlay content) */}
      {children}
    </div>
  );
}
