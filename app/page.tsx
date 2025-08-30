import { HeroSection } from "@/components/hero-section"
import { FilterSection } from "@/components/filter-section"
import { GroupCardsSection } from "@/components/group-cards-section"
import { InfoSection } from "@/components/info-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FilterSection />
      <GroupCardsSection />
      <InfoSection />
      <Footer />
    </main>
  )
}
