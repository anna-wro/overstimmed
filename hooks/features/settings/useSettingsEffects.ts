/** @fileoverview Side effects for settings changes: theme, font size, and high contrast mode. */
import { useEffect } from "react"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"

interface UseSettingsEffectsProps {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
  setOriginalSettings: (settings: AppSettings) => void
  setTheme: (theme: string) => void
}

export function useSettingsEffects({
  settings,
  setSettings: _setSettings,
  setOriginalSettings,
  setTheme,
}: UseSettingsEffectsProps) {
  useEffect(() => {
    if (settings.theme) setTheme(settings.theme)
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
  }, [settings, setTheme])

  useEffect(() => {
    setOriginalSettings(settings)
  }, [])
} 