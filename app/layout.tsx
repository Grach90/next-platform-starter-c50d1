import type React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { BasketProvider } from "@/contexts/basket-context";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";
import { LanguageSwitcher } from "@/components/language-switcher";
import { BasketButton } from "@/components/basket-button";

export const metadata: Metadata = {
  title: "Luxe Rose Dubai - Premium Flower Store",
  description: "Elegant flower arrangements and bouquets delivered in Dubai",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Avenir+Next:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <BasketProvider>
            {children}
            <Toaster position="top-right" />
            <div className="fixed top-4 right-4 z-20 flex items-center gap-3">
              <LanguageSwitcher />
              <BasketButton />
            </div>
          </BasketProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
