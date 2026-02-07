"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { useAppSettings } from "@/hooks/features/settings/useAppSettings"
import { useDataImportExport } from "@/hooks/features/settings/useDataImportExport"
import { useUnsavedChanges } from "@/hooks/features/settings/useUnsavedChanges"
import { useSettingsEffects } from "@/hooks/features/settings/useSettingsEffects"
import { useEntries, useProfile } from "@/hooks/features"
import { settingsPageCopy } from "@/copy/settings"
import { Button } from "@/components/ui/Button"
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
  const { profile, updateProfile } = useProfile()
  const [displayName, setDisplayName] = useState("")
  const [originalDisplayName, setOriginalDisplayName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile?.name != null) {
      setDisplayName(profile.name)
      setOriginalDisplayName(profile.name)
    }
  }, [profile?.name])

  const syncProfileToBackend = async (payload: {
    name?: string | null
    theme: string
    high_contrast_mode: boolean
    font_size: number
  }) => {
    await updateProfile(payload)
  }

  const { saveSettings } = useSettingsEffects({
    settings,
    setSettings,
    setOriginalSettings,
    setTheme,
    syncProfileToBackend,
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveSettings(displayName)
      setOriginalDisplayName(displayName)
    } finally {
      setIsSaving(false)
    }
  }

  const {
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    handleUnsavedDialogAction,
  } = useUnsavedChanges({
    settings,
    originalSettings,
    onSave: handleSave,
    displayNameChanged: displayName !== originalDisplayName,
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
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-end">
          <div className="text-center sm:text-left">
            <h1 className="mb-2 text-3xl font-bold">{settingsPageCopy.pageTitle}</h1>
            <p className="text-muted-foreground">{settingsPageCopy.pageDescription}</p>
          </div>
          {hasUnsavedChanges() && (
            <Button onClick={handleSave} disabled={isSaving} className="shrink-0">
              {isSaving ? settingsPageCopy.savingButton : settingsPageCopy.saveButton}
            </Button>
          )}
        </div>

        {importError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{settingsPageCopy.importError.title}</AlertTitle>
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8">
          <AppearanceSettings
            settings={settings}
            onSettingsChange={setSettings}
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
          />
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