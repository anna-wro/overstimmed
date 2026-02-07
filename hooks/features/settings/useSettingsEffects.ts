import { useEffect } from "react"
import { useToast } from "@/hooks/shared/useToast"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"

export type SyncProfileFn = (payload: {
  name?: string | null
  theme: string
  high_contrast_mode: boolean
  font_size: number
}) => Promise<void>

interface UseSettingsEffectsProps {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
  setOriginalSettings: (settings: AppSettings) => void
  setTheme: (theme: string) => void
  syncProfileToBackend?: SyncProfileFn
}

export function useSettingsEffects({
  settings,
  setSettings,
  setOriginalSettings,
  setTheme,
  syncProfileToBackend,
}: UseSettingsEffectsProps) {
  const { toast } = useToast()

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

  const saveSettings = async (displayName?: string | null) => {
    setTheme(settings.theme)
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
    setSettings(settings)
    setOriginalSettings({ ...settings })
    if (syncProfileToBackend) {
      try {
        await syncProfileToBackend({
          name: displayName ?? undefined,
          theme: settings.theme,
          high_contrast_mode: settings.highContrastMode,
          font_size: settings.fontSize,
        })
      } catch (e) {
        console.error("Failed to sync profile:", e)
      }
    }
    toast({
      title: settingsPageCopy.toasts.settingsSaved.title,
      description: settingsPageCopy.toasts.settingsSaved.description,
    })
  }

  return {
    saveSettings,
  }
} 