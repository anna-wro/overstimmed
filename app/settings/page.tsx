"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { useAppSettings } from "@/hooks/features/settings/useAppSettings"
import { useDataImportExport } from "@/hooks/features/settings/useDataImportExport"
import { useSettingsEffects } from "@/hooks/features/settings/useSettingsEffects"
import { useEntries, useProfile } from "@/hooks/features"
import { useToast } from "@/hooks/shared/useToast"
import { settingsPageCopy } from "@/copy/settings"
import {
  AppearanceSettings,
  RemindersSettings,
  AccessibilitySettings,
  DataManagementSettings,
} from "@/components/settings"

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const [settings, setSettings] = useAppSettings()
  const [originalSettings, setOriginalSettings] = useState<any>(null)
  const { entries, refetch, deleteAll, insertEntries } = useEntries()
  const { profile, updateProfile } = useProfile()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState("")
  const [isSavingDisplayName, setIsSavingDisplayName] = useState(false)

  useEffect(() => {
    if (profile?.name != null) {
      setDisplayName(profile.name)
    }
  }, [profile?.name])

  useSettingsEffects({
    settings,
    setSettings,
    setOriginalSettings,
    setTheme,
  })

  const handleSaveDisplayName = async () => {
    setIsSavingDisplayName(true)
    try {
      await updateProfile({
        name: displayName.trim() || undefined,
        theme: settings.theme,
        high_contrast_mode: settings.highContrastMode,
        font_size: settings.fontSize,
      })
      toast({
        title: settingsPageCopy.toasts.settingsSaved.title,
        description: settingsPageCopy.toasts.settingsSaved.description,
      })
    } catch {
      toast({
        title: settingsPageCopy.toasts.settingsSaveFailed.title,
        description: settingsPageCopy.toasts.settingsSaveFailed.description,
        variant: "destructive",
      })
    } finally {
      setIsSavingDisplayName(false)
    }
  }

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
    <div className="min-h-screen bg-linear-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8 high-contrast:bg-white dark:high-contrast:bg-black">
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
          <AppearanceSettings
            settings={settings}
            onSettingsChange={setSettings}
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
            onSaveDisplayName={handleSaveDisplayName}
            isSavingDisplayName={isSavingDisplayName}
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
    </div>
  )
}
