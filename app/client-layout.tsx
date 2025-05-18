"use client"

import type React from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { useEffect } from "react"

function FontSizeInitializer() {
  useEffect(() => {
    // Load font size from settings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.fontSize) {
          document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
        }
      } catch (e) {
        console.error("Error parsing settings:", e)
      }
    }
  }, [])

  return null
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FontSizeInitializer />
      {children}
    </ThemeProvider>
  )
}
