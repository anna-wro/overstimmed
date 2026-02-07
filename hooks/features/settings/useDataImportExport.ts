import { useState } from "react"
import { useToast } from "@/hooks/shared/useToast"
import { entriesToCSV, csvToEntries, validateCSV } from "@/utils/CsvUtils"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"
import type { TrackingEntry } from "@/lib/entries"

type ImportData = {
  trackingEntries?: TrackingEntry[]
  exportDate?: string
  settings?: AppSettings
}

interface UseDataImportExportProps {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
  setOriginalSettings: (settings: AppSettings) => void
  setTheme: (theme: string) => void
  entries: TrackingEntry[]
  refetchEntries: () => Promise<void>
  deleteAllEntries: () => Promise<void>
  insertEntries: (entries: Omit<TrackingEntry, "id">[]) => Promise<void>
}

export function useDataImportExport({
  settings,
  setSettings,
  setOriginalSettings,
  setTheme,
  entries,
  refetchEntries,
  deleteAllEntries,
  insertEntries,
}: UseDataImportExportProps) {
  const { toast } = useToast()
  const [importError, setImportError] = useState<string | null>(null)

  const exportData = () => {
    if (settings.exportFormat === "json") {
      const exportPayload = {
        trackingEntries: entries,
        exportDate: new Date().toISOString(),
        settings,
      }
      const dataStr = JSON.stringify(exportPayload, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
      const exportFileDefaultName = `energy-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } else if (settings.exportFormat === "csv") {
      const csvContent = entriesToCSV(entries)
      const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
      const exportFileDefaultName = `energy-tracker-export-${new Date().toISOString().slice(0, 10)}.csv`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }
    toast({
      title: settingsPageCopy.toasts.dataExported.title,
      description: settingsPageCopy.toasts.dataExported.description(settings.exportFormat),
    })
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const isCSV = file.name.toLowerCase().endsWith(".csv")
        const content = e.target?.result as string
        if (isCSV) {
          await handleCSVImport(content)
        } else {
          await handleJSONImport(content)
        }
      } catch (error) {
        console.error("Import error:", error)
        setImportError(error instanceof Error ? error.message : "Failed to import data")
      }
    }
    reader.readAsText(file)
  }

  const handleCSVImport = async (csvContent: string) => {
    const validation = validateCSV(csvContent)
    if (!validation.valid) {
      throw new Error(validation.message || settingsPageCopy.errors.invalidCSV)
    }

    const importedEntries = csvToEntries(csvContent)
    if (importedEntries.length === 0) {
      throw new Error(settingsPageCopy.errors.noValidEntries)
    }

    const toInsert =
      entries.length === 0
        ? importedEntries
        : confirm(settingsPageCopy.confirmations.replaceData)
          ? importedEntries
          : mergeEntries(entries, importedEntries)
    await insertEntries(normalizeForInsert(toInsert))
    await refetchEntries()

    toast({
      title: settingsPageCopy.toasts.dataImportedCSV.title,
      description: settingsPageCopy.toasts.dataImportedCSV.description(importedEntries.length),
    })
  }

  const handleJSONImport = async (jsonContent: string) => {
    const jsonData = JSON.parse(jsonContent) as ImportData

    if (!jsonData.trackingEntries || !Array.isArray(jsonData.trackingEntries)) {
      throw new Error(settingsPageCopy.errors.invalidDataFormat)
    }

    for (const entry of jsonData.trackingEntries) {
      if (
        typeof entry.timestamp !== "string" ||
        typeof entry.energyLevel !== "number" ||
        typeof entry.stimulationLevel !== "number" ||
        typeof entry.stimulationType !== "string"
      ) {
        throw new Error("Invalid entry format: Missing required fields")
      }
    }

    const toInsert =
      entries.length === 0
        ? jsonData.trackingEntries
        : confirm(settingsPageCopy.confirmations.replaceData)
          ? jsonData.trackingEntries
          : mergeEntries(entries, jsonData.trackingEntries)
    await insertEntries(normalizeForInsert(toInsert))
    await refetchEntries()

    if (jsonData.settings) {
      setSettings(jsonData.settings)
      setOriginalSettings(jsonData.settings)
      applyImportedSettings(jsonData.settings)
    }

    toast({
      title: "Data imported",
      description: `Successfully imported ${jsonData.trackingEntries.length} entries.`,
    })
  }

  const mergeEntries = (existing: TrackingEntry[], imported: TrackingEntry[]) => {
    const entriesMap = new Map<string, TrackingEntry>()
    existing.forEach((entry) => entriesMap.set(entry.timestamp, entry))
    imported.forEach((entry) => entriesMap.set(entry.timestamp, entry))
    return Array.from(entriesMap.values())
  }

  const normalizeForInsert = (list: TrackingEntry[]): Omit<TrackingEntry, "id">[] =>
    list.map(({ id: _id, ...rest }) => rest)

  const applyImportedSettings = (importedSettings: AppSettings) => {
    if (importedSettings.theme) setTheme(importedSettings.theme)
    
    if (importedSettings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    
    document.documentElement.style.fontSize = `${importedSettings.fontSize / 16}rem`
  }

  const clearAllData = async () => {
    if (!confirm(settingsPageCopy.confirmations.clearAllData)) return
    try {
      await deleteAllEntries()
      await refetchEntries()
      toast({
        title: "Data cleared",
        description: "All your data has been deleted.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Could not clear data",
        variant: "destructive",
      })
    }
  }

  return {
    exportData,
    handleFileImport,
    clearAllData,
    importError,
    setImportError,
  }
} 