import { useState } from "react"
import { useToast } from "@/hooks/shared/useToast"
import { entriesToCSV, csvToEntries, validateCSV } from "@/utils/CsvUtils"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"

type ImportData = {
  trackingEntries?: any[]
  exportDate?: string
  settings?: AppSettings
}

interface UseDataImportExportProps {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
  setOriginalSettings: (settings: AppSettings) => void
  setTheme: (theme: string) => void
  trackingEntries: any[]
  setTrackingEntries: (entries: any[]) => void
}

export function useDataImportExport({
  settings,
  setSettings,
  setOriginalSettings,
  setTheme,
  trackingEntries,
  setTrackingEntries,
}: UseDataImportExportProps) {
  const { toast } = useToast()
  const [importError, setImportError] = useState<string | null>(null)

  const exportData = () => {
    if (settings.exportFormat === "json") {
      const exportData = {
        trackingEntries,
        exportDate: new Date().toISOString(),
        settings,
      }
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
      const exportFileDefaultName = `energy-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } else if (settings.exportFormat === "csv") {
      const csvContent = entriesToCSV(trackingEntries)
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
    reader.onload = (e) => {
      try {
        const isCSV = file.name.toLowerCase().endsWith(".csv")
        
        if (isCSV) {
          handleCSVImport(e.target?.result as string)
        } else {
          handleJSONImport(e.target?.result as string)
        }
      } catch (error) {
        console.error("Import error:", error)
        setImportError(error instanceof Error ? error.message : "Failed to import data")
      }
    }
    reader.readAsText(file)
  }

  const handleCSVImport = (csvContent: string) => {
    const validation = validateCSV(csvContent)
    if (!validation.valid) {
      throw new Error(validation.message || settingsPageCopy.errors.invalidCSV)
    }

    const importedEntries = csvToEntries(csvContent)
    if (importedEntries.length === 0) {
      throw new Error(settingsPageCopy.errors.noValidEntries)
    }

    if (trackingEntries.length > 0) {
      if (confirm(settingsPageCopy.confirmations.replaceData)) {
        setTrackingEntries(importedEntries)
      } else {
        const mergedEntries = mergeEntries(trackingEntries, importedEntries)
        setTrackingEntries(mergedEntries)
      }
    } else {
      setTrackingEntries(importedEntries)
    }

    toast({
      title: settingsPageCopy.toasts.dataImportedCSV.title,
      description: settingsPageCopy.toasts.dataImportedCSV.description(importedEntries.length),
    })
  }

  const handleJSONImport = (jsonContent: string) => {
    const jsonData = JSON.parse(jsonContent) as ImportData
    
    if (!jsonData.trackingEntries || !Array.isArray(jsonData.trackingEntries)) {
      throw new Error(settingsPageCopy.errors.invalidDataFormat)
    }

    // Validate entry format
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

    // Handle entries
    if (trackingEntries.length > 0) {
      if (confirm("Do you want to replace your existing data? Click 'OK' to replace or 'Cancel' to merge with existing data.")) {
        setTrackingEntries(jsonData.trackingEntries)
      } else {
        const mergedEntries = mergeEntries(trackingEntries, jsonData.trackingEntries)
        setTrackingEntries(mergedEntries)
      }
    } else {
      setTrackingEntries(jsonData.trackingEntries)
    }

    // Handle settings if present
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

  const mergeEntries = (existing: any[], imported: any[]) => {
    const entriesMap = new Map()
    existing.forEach((entry: any) => entriesMap.set(entry.timestamp, entry))
    imported.forEach((entry: any) => entriesMap.set(entry.timestamp, entry))
    return Array.from(entriesMap.values())
  }

  const applyImportedSettings = (importedSettings: AppSettings) => {
    if (importedSettings.theme) setTheme(importedSettings.theme)
    
    if (importedSettings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    
    document.documentElement.style.fontSize = `${importedSettings.fontSize / 16}rem`
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      setTrackingEntries([])
      toast({
        title: "Data cleared",
        description: "All your data has been deleted.",
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