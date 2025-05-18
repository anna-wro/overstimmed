import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { FirstVisitModal } from "@/components/first-visit-modal"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Overstimmed",
  description: "Track your overstimulation, energy, and emotional patterns",
  generator: "v0.dev",
}

// Update the RootLayout component to include font size initialization
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          {children}
          <FirstVisitModal />
        </ClientLayout>
      </body>
    </html>
  )
}
