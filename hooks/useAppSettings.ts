import { useLocalStorage } from "./useLocalStorage"

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