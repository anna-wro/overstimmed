import { useEffect } from "react"
import { useToast } from "@/hooks/useToast"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/useAppSettings"

interface UseSettingsEffectsProps {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
  setOriginalSettings: (settings: AppSettings) => void
  setTheme: (theme: string) => void
}

export function useSettingsEffects({
  settings,
  setSettings,
  setOriginalSettings,
  setTheme,
}: UseSettingsEffectsProps) {
  const { toast } = useToast()

  // Apply settings to DOM when settings change
  useEffect(() => {
    // Apply theme
    if (settings.theme) {
      setTheme(settings.theme)
    }

    // Apply high contrast mode
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
  }, [settings, setTheme])

  // Initialize original settings on mount
  useEffect(() => {
    setOriginalSettings(settings)
  }, []) // Only run on mount

  const saveSettings = () => {
    // Apply settings to DOM immediately
    setTheme(settings.theme)
    
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    
    document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
    
    // Save to storage
    setSettings(settings)
    setOriginalSettings({ ...settings })
    
    // Show success toast
    toast({
      title: settingsPageCopy.toasts.settingsSaved.title,
      description: settingsPageCopy.toasts.settingsSaved.description,
    })
  }

  return {
    saveSettings,
  }
} 