"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PixelBackground } from "@/components/pixel-background"
import { RoomCreationModal } from "@/components/room-creation-modal"

export default function CreateGamePage() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <main className="min-h-screen flex flex-col">
      <PixelBackground />
      <Header />

      <RoomCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
