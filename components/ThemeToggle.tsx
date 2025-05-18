"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/Button"
import { Moon, Sun, Contrast } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [highContrast, setHighContrast] = useLocalStorage<boolean>("highContrast", false)
  const [settings, setSettings] = useLocalStorage<any>("appSettings", {
    theme: "system",
    highContrastMode: false,
    fontSize: 16,
    reminders: false,
    reminderFrequency: "hourly",
    dataRetentionPeriod: "forever",
    exportFormat: "json",
  })

  useEffect(() => {
    setMounted(true)
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    if (settings.theme) {
      setTheme(settings.theme)
    }
    if (settings.highContrastMode !== undefined) {
      setHighContrast(settings.highContrastMode)
      if (settings.highContrastMode) {
        document.documentElement.classList.add("high-contrast")
      } else {
        document.documentElement.classList.remove("high-contrast")
      }
    }
  }, [setTheme, highContrast, settings])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    setSettings({ ...settings, highContrastMode: newValue })
    if (newValue) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme)
    setSettings({ ...settings, theme: newTheme })
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTheme("system")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          System
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleHighContrast}>
          <Contrast className="mr-2 h-4 w-4" />
          {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
