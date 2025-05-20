import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { FirstVisitModal } from "@/components/FirstVisitModal"
import ClientLayout from "./client-layout"
import { ConditionalHeader } from "@/components/layout/ConditionalHeader"

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
      <body className={`${inter.className} bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 high-contrast:bg-white dark:high-contrast:bg-black`}>
        <ClientLayout>
          <ConditionalHeader />
          {children}
          <FirstVisitModal />
        </ClientLayout>
      </body>
    </html>
  )
}
