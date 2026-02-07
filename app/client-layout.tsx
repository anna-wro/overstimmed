"use client"

import type React from "react"
import { ThemeProvider, useTheme } from "next-themes"
import { useEffect } from "react"

function AppSettingsSync() {
  const { setTheme } = useTheme()
  useEffect(() => {
    const saved = localStorage.getItem("appSettings")
    if (!saved) return
    try {
      const settings = JSON.parse(saved)
      if (settings.theme) setTheme(settings.theme)
      if (settings.highContrastMode) {
        document.documentElement.classList.add("high-contrast")
      } else {
        document.documentElement.classList.remove("high-contrast")
      }
      if (settings.fontSize) {
        document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
      }
    } catch (e) {
      console.error("Error parsing app settings:", e)
    }
  }, [setTheme])
  return null
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppSettingsSync />
      {children}
    </ThemeProvider>
  )
}
