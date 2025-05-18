"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Contrast } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Load high contrast setting from localStorage
  useEffect(() => {
    setMounted(true)
    const savedHighContrast = localStorage.getItem("highContrast") === "true"
    setHighContrast(savedHighContrast)

    if (savedHighContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Load theme settings from appSettings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.theme) {
          setTheme(settings.theme)
        }
        if (settings.highContrastMode !== undefined) {
          setHighContrast(settings.highContrastMode)
          localStorage.setItem("highContrast", String(settings.highContrastMode))
          if (settings.highContrastMode) {
            document.documentElement.classList.add("high-contrast")
          } else {
            document.documentElement.classList.remove("high-contrast")
          }
        }
      } catch (e) {
        console.error("Error parsing settings:", e)
      }
    }
  }, [setTheme])

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("highContrast", String(newValue))

    // Update settings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        settings.highContrastMode = newValue
        localStorage.setItem("appSettings", JSON.stringify(settings))
      } catch (e) {
        console.error("Error updating settings:", e)
      }
    }

    if (newValue) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  // Update theme in settings
  const updateTheme = (newTheme: string) => {
    setTheme(newTheme)

    // Update settings
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        settings.theme = newTheme
        localStorage.setItem("appSettings", JSON.stringify(settings))
      } catch (e) {
        console.error("Error updating settings:", e)
      }
    } else {
      // Create new settings object
      const settings = {
        theme: newTheme,
        highContrastMode: highContrast,
        fontSize: 16,
        reminders: false,
        reminderFrequency: "hourly",
        dataRetentionPeriod: "forever",
        exportFormat: "json",
      }
      localStorage.setItem("appSettings", JSON.stringify(settings))
    }
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
