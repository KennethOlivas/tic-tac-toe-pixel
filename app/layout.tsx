import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P, VT323 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-pixel-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pixel TicTacToe",
  description: "TicTacToe game",
  generator: "Kenneth Olivas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-pixel-body ${pressStart2P.variable} ${vt323.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
