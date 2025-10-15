import { Header } from "@/components/header"
import { PixelBackground } from "@/components/pixel-background"
import { HomeCard } from "@/components/home-card"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <HomeCard />
      </div>
    </main>
  )
}
