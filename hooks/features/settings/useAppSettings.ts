/**
 * @fileoverview Application settings persisted to localStorage with sensible defaults.
 * @example const [settings, setSettings] = useAppSettings()
 */
import { useLocalStorage } from "@/hooks/shared/useLocalStorage"

export type AppSettings = {
  theme: string
  highContrastMode: boolean
  fontSize: number
  reminders: boolean
  reminderFrequency: string
  dataRetentionPeriod: string
  exportFormat: string
  lowSpoonMode: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  highContrastMode: false,
  fontSize: 16,
  reminders: false,
  reminderFrequency: "hourly",
  dataRetentionPeriod: "forever",
  exportFormat: "json",
  lowSpoonMode: false,
}

export function useAppSettings() {
  return useLocalStorage<AppSettings>("appSettings", DEFAULT_SETTINGS)
} 