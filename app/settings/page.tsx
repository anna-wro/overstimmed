"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { useAppSettings } from "@/hooks/features/settings/useAppSettings"
import { useDataImportExport } from "@/hooks/features/settings/useDataImportExport"
import { useUnsavedChanges } from "@/hooks/features/settings/useUnsavedChanges"
import { useSettingsEffects } from "@/hooks/features/settings/useSettingsEffects"
import { useEntries } from "@/hooks/features"
import { settingsPageCopy } from "@/copy/settings"
import {
  AppearanceSettings,
  RemindersSettings,
  AccessibilitySettings,
  DataManagementSettings,
  UnsavedChangesDialog,
} from "@/components/settings"

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const [settings, setSettings] = useAppSettings()
  const [originalSettings, setOriginalSettings] = useState<any>(null)
  const { entries, refetch, deleteAll, insertEntries } = useEntries()

  // Custom hooks
  const { saveSettings } = useSettingsEffects({
    settings,
    setSettings,
    setOriginalSettings,
    setTheme,
  })

  const {
    showUnsavedDialog,
    setShowUnsavedDialog,
    handleUnsavedDialogAction,
  } = useUnsavedChanges({
    settings,
    originalSettings,
    onSave: saveSettings,
  })

  const {
    exportData,
    handleFileImport,
    clearAllData,
    importError,
  } = useDataImportExport({
    settings,
    setSettings,
    setOriginalSettings,
    setTheme,
    entries,
    refetchEntries: refetch,
    deleteAllEntries: deleteAll,
    insertEntries,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8 high-contrast:bg-white dark:high-contrast:bg-black">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">{settingsPageCopy.pageTitle}</h1>
          <p className="text-muted-foreground">{settingsPageCopy.pageDescription}</p>
        </div>

        {importError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{settingsPageCopy.importError.title}</AlertTitle>
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8">
          <AppearanceSettings settings={settings} onSettingsChange={setSettings} />
          <RemindersSettings settings={settings} onSettingsChange={setSettings} />
          <AccessibilitySettings settings={settings} onSettingsChange={setSettings} />
          <DataManagementSettings
            settings={settings}
            onSettingsChange={setSettings}
            onExportData={exportData}
            onFileChange={handleFileImport}
            onClearAllData={clearAllData}
          />
        </div>
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onAction={handleUnsavedDialogAction}
      />
    </div>
  )
}