"use client"

import { useLanguage } from "@/contexts/language-context"

export function InfoSection() {
  const { t } = useLanguage()

  return (
    <section className="bg-white py-16" id="info">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-primary">{t("about.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("about.description")}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">{t("delivery.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("delivery.description")}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">{t("payment.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("payment.description")}</p>
          </div>
            <div className="pt-0 md:pt-7">
            <p className="mt-4 text-muted-foreground leading-relaxed"><span className="mr-2">✅</span>{t("payment.ApplePay")}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed"><span className="mr-2">✅</span>{t("payment.Paymentlink")}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed"><span className="mr-2">✅</span>{t("payment.Banktransfers")}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed"><span className="mr-2">✅</span>{t("payment.USDT")}</p>
            </div>
        </div>
      </div>
    </section>
  )
}
