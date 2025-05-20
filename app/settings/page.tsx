"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Slider } from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Palette, Bell, AlertCircle, ArrowLeft, X, Save } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { entriesToCSV, csvToEntries, validateCSV } from "@/utils/CsvUtils"
import { useLocalStorage } from "@/hooks/useLocalStorage"

type Settings = {
  theme: string
  highContrastMode: boolean
  fontSize: number
  reminders: boolean
  reminderFrequency: string
  dataRetentionPeriod: string
  exportFormat: string
}

type ImportData = {
  trackingEntries?: any[]
  exportDate?: string
  settings?: Settings
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [settings, setSettings] = useLocalStorage<Settings>("appSettings", {
    theme: "system",
    highContrastMode: false,
    fontSize: 16,
    reminders: false,
    reminderFrequency: "hourly",
    dataRetentionPeriod: "forever",
    exportFormat: "json",
  })
  const [originalSettings, setOriginalSettings] = useState<Settings | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [trackingEntries, setTrackingEntries] = useLocalStorage<any[]>("trackingEntries", [])

  useEffect(() => {
    // Load settings from localStorage (now from useLocalStorage)
    setOriginalSettings(settings)
    // Apply theme and high contrast settings
    if (settings.theme) {
      setTheme(settings.theme)
    }
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
  }, [settings, setTheme])

  // Check if settings have been modified
  const hasUnsavedChanges = () => {
    if (!originalSettings) return false

    return (
      originalSettings.theme !== settings.theme ||
      originalSettings.highContrastMode !== settings.highContrastMode ||
      originalSettings.fontSize !== settings.fontSize ||
      originalSettings.reminders !== settings.reminders ||
      originalSettings.reminderFrequency !== settings.reminderFrequency ||
      originalSettings.dataRetentionPeriod !== settings.dataRetentionPeriod ||
      originalSettings.exportFormat !== settings.exportFormat
    )
  }

  const handleBackClick = (e: React.MouseEvent) => {
    if (hasUnsavedChanges()) {
      e.preventDefault()
      setPendingNavigation("/")
      setShowUnsavedDialog(true)
    }
  }

  const handleUnsavedDialogAction = (action: "save" | "discard" | "cancel") => {
    setShowUnsavedDialog(false)

    if (action === "save") {
      saveSettings()
      if (pendingNavigation) {
        router.push(pendingNavigation)
      }
    } else if (action === "discard") {
      if (pendingNavigation) {
        router.push(pendingNavigation)
      }
    }

    setPendingNavigation(null)
  }

  const saveSettings = () => {
    setTheme(settings.theme)
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    document.documentElement.style.fontSize = `${settings.fontSize / 16}rem`
    setSettings(settings)
    setOriginalSettings({ ...settings })
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    })
  }

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
      title: "Data exported",
      description: `Your data has been exported successfully as ${settings.exportFormat.toUpperCase()}.`,
    })
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const isCSV = file.name.toLowerCase().endsWith(".csv")
        if (isCSV) {
          const csvContent = e.target?.result as string
          const validation = validateCSV(csvContent)
          if (!validation.valid) throw new Error(validation.message || "Invalid CSV format")
          const importedEntries = csvToEntries(csvContent)
          if (importedEntries.length === 0) throw new Error("No valid entries found in the CSV file")
          if (trackingEntries.length > 0) {
            if (confirm("Do you want to replace your existing data? Click 'OK' to replace or 'Cancel' to merge with existing data.")) {
              setTrackingEntries(importedEntries)
            } else {
              const entriesMap = new Map()
              trackingEntries.forEach((entry: any) => { entriesMap.set(entry.timestamp, entry) })
              importedEntries.forEach((entry: any) => { entriesMap.set(entry.timestamp, entry) })
              const mergedEntries = Array.from(entriesMap.values())
              setTrackingEntries(mergedEntries)
            }
          } else {
            setTrackingEntries(importedEntries)
          }
          toast({ title: "Data imported", description: `Successfully imported ${importedEntries.length} entries from CSV.` })
        }
        const jsonData = JSON.parse(e.target?.result as string) as ImportData
        if (!jsonData.trackingEntries || !Array.isArray(jsonData.trackingEntries)) throw new Error("Invalid data format: Missing or invalid tracking entries")
        for (const entry of jsonData.trackingEntries) {
          if (typeof entry.timestamp !== "string" || typeof entry.energyLevel !== "number" || typeof entry.stimulationLevel !== "number" || typeof entry.stimulationType !== "string") {
            throw new Error("Invalid entry format: Missing required fields")
          }
        }
        if (trackingEntries.length > 0) {
          if (confirm("Do you want to replace your existing data? Click 'OK' to replace or 'Cancel' to merge with existing data.")) {
            setTrackingEntries(jsonData.trackingEntries)
          } else {
            const entriesMap = new Map()
            trackingEntries.forEach((entry: any) => { entriesMap.set(entry.timestamp, entry) })
            jsonData.trackingEntries.forEach((entry: any) => { entriesMap.set(entry.timestamp, entry) })
            const mergedEntries = Array.from(entriesMap.values())
            setTrackingEntries(mergedEntries)
          }
        } else {
          setTrackingEntries(jsonData.trackingEntries)
        }
        if (jsonData.settings) {
          setSettings(jsonData.settings)
          setOriginalSettings(jsonData.settings)
          // Apply theme and high contrast settings
          if (jsonData.settings.theme) setTheme(jsonData.settings.theme)
          if (jsonData.settings.highContrastMode) {
            document.documentElement.classList.add("high-contrast")
          } else {
            document.documentElement.classList.remove("high-contrast")
          }
          document.documentElement.style.fontSize = `${jsonData.settings.fontSize / 16}rem`
        }
        toast({ title: "Data imported", description: `Successfully imported ${jsonData.trackingEntries.length} entries.` })
        if (fileInputRef.current) fileInputRef.current.value = ""
      } catch (error) {
        console.error("Import error:", error)
        setImportError(error instanceof Error ? error.message : "Failed to import data")
      }
    }
    reader.readAsText(file)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8 high-contrast:bg-white dark:high-contrast:bg-black">

      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your experience and manage your data</p>
        </div>

        {importError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Import Error</AlertTitle>
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8">
          <Card className="overflow-hidden border-none shadow-lg high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
            <CardHeader className="flex flex-row items-center gap-4 bg-sand-100/50 dark:bg-sand-900/20 high-contrast:bg-accent">
              <div className="rounded-full bg-lavender-100 p-2 dark:bg-lavender-900/30 high-contrast:bg-primary/20">
                <Palette className="h-5 w-5 text-lavender-600 dark:text-lavender-400" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                  <SelectTrigger
                    id="theme"
                    className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
                  >
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-white/50 p-4 dark:bg-lavender-950/30 high-contrast:border-black dark:high-contrast:border-white">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast" className="text-base">
                    High Contrast Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrastMode}
                  onCheckedChange={(checked) => {
                    setSettings({ ...settings, highContrastMode: checked })
                  }}
                  className="data-[state=checked]:bg-lavender-500 high-contrast:data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Font Size</Label>
                  <span className="font-mono text-sm tabular-nums">{settings.fontSize}px</span>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[settings.fontSize]}
                  onValueChange={(value) => {
                    const newFontSize = value[0]
                    setSettings({ ...settings, fontSize: newFontSize })
                    // Apply font size change immediately
                    document.documentElement.style.fontSize = `${newFontSize / 16}rem`
                  }}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
            <CardHeader className="flex flex-row items-center gap-4 bg-sand-100/50 dark:bg-sand-900/20 high-contrast:bg-accent">
              <div className="rounded-full bg-sand-100 p-2 dark:bg-sand-900/30 high-contrast:bg-primary/20">
                <Bell className="h-5 w-5 text-sand-600 dark:text-sand-400" />
              </div>
              <div>
                <CardTitle>Reminders</CardTitle>
                <CardDescription>Configure when and how you receive reminders</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between rounded-lg border bg-white/50 p-4 dark:bg-lavender-950/30 high-contrast:border-black dark:high-contrast:border-white">
                <div className="space-y-0.5">
                  <Label htmlFor="reminders" className="text-base">
                    Enable Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notifications to track your energy and stimulation levels
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={settings.reminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, reminders: checked })}
                  className="data-[state=checked]:bg-sand-500 high-contrast:data-[state=checked]:bg-primary"
                />
              </div>

              {settings.reminders && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                  <Select
                    value={settings.reminderFrequency}
                    onValueChange={(value) => setSettings({ ...settings, reminderFrequency: value })}
                  >
                    <SelectTrigger
                      id="reminder-frequency"
                      className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
                    >
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
            <CardHeader className="flex flex-row items-center gap-4 bg-sand-100/50 dark:bg-sand-900/20 high-contrast:bg-accent">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30 high-contrast:bg-primary/20">
                <Save className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export, import, and clear your data</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="space-y-2 mb-4">
                <Label htmlFor="export-format">Export Format</Label>
                <Select
                  value={settings.exportFormat}
                  onValueChange={(value) => setSettings({ ...settings, exportFormat: value })}
                >
                  <SelectTrigger
                    id="export-format"
                    className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
                  >
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON (with settings)</SelectItem>
                    <SelectItem value="csv">CSV (data only)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  JSON includes settings and all data. CSV includes only tracking entries.
                </p>
              </div>

              <Button onClick={exportData} className="w-full">
                Export Data
              </Button>

              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <Button onClick={triggerFileInput} variant="outline" className="w-full">
                Import Data
              </Button>

              <Button onClick={clearAllData} variant="destructive" className="w-full">
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="w-full max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-lavender-700 dark:text-lavender-300">Save your changes?</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You've made changes to your settings that haven't been applied yet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border border-sand-300 bg-sand-50 p-4 text-sand-800 dark:bg-sand-900/30 dark:text-sand-200 dark:border-sand-700">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 text-blush-500 dark:text-blush-400" />
                <div>
                  <p className="font-medium">Your preferences will be lost</p>
                  <p className="text-sm mt-1">If you leave without saving, your preference changes won't be applied.</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => handleUnsavedDialogAction("cancel")}
                className="justify-center border-lavender-300 text-lavender-700 hover:bg-lavender-50 dark:border-lavender-700 dark:text-lavender-300 dark:hover:bg-lavender-900/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Keep Editing
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUnsavedDialogAction("discard")}
                className="justify-center border-blush-300 text-blush-700 hover:bg-blush-50 hover:text-blush-800 dark:border-blush-700 dark:text-blush-300 dark:hover:bg-blush-900/20"
              >
                <X className="mr-2 h-4 w-4" />
                Discard Changes
              </Button>
              <Button
                onClick={() => handleUnsavedDialogAction("save")}
                className="justify-center bg-mint-500 hover:bg-mint-600 text-white dark:bg-mint-600 dark:hover:bg-mint-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
