import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"

interface UseUnsavedChangesProps {
  settings: AppSettings
  originalSettings: AppSettings | null
  onSave: () => void
}

export function useUnsavedChanges({ settings, originalSettings, onSave }: UseUnsavedChangesProps) {
  const router = useRouter()
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  const hasUnsavedChanges = () => {
    if (!originalSettings) return false

    return (
      originalSettings.theme !== settings.theme ||
      originalSettings.highContrastMode !== settings.highContrastMode ||
      originalSettings.fontSize !== settings.fontSize ||
      originalSettings.reminders !== settings.reminders ||
      originalSettings.reminderFrequency !== settings.reminderFrequency ||
      originalSettings.dataRetentionPeriod !== settings.dataRetentionPeriod ||
      originalSettings.exportFormat !== settings.exportFormat ||
      originalSettings.lowSpoonMode !== settings.lowSpoonMode
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
      onSave()
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

  const navigateWithCheck = (path: string) => {
    if (hasUnsavedChanges()) {
      setPendingNavigation(path)
      setShowUnsavedDialog(true)
    } else {
      router.push(path)
    }
  }

  return {
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    handleBackClick,
    handleUnsavedDialogAction,
    navigateWithCheck,
  }
} 