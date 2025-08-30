"use client"

import { Phone, MessageCircle, Instagram, MapPin } from "lucide-react"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="h-5 w-5" />
                <span>{WHATSAPP_NUMBER}</span>
              </div>
              <div
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center md:justify-start gap-3 hover:text-accent transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{t("footer.follow")}</h3>
            <a
              href="https://instagram.com/luxerosedubai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 hover:text-accent transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@luxerosedubai</span>
            </a>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">{t("footer.visit")}</h3>
            <div className="flex items-center justify-center md:justify-end gap-3">
              <MapPin className="h-5 w-5" />
              <div className="text-sm">
                <p>Dubai Marina</p>
                <p>United Arab Emirates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/70">© 2024 Luxe Rose Dubai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
