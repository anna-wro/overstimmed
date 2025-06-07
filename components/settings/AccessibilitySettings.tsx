import type React from "react"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { AlertCircle } from "lucide-react"
import { SettingsCard } from "./SettingsCard"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/useAppSettings"

interface AccessibilitySettingsProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
}

export function AccessibilitySettings({ settings, onSettingsChange }: AccessibilitySettingsProps) {
  const handleLowSpoonModeChange = (checked: boolean) => {
    onSettingsChange({ ...settings, lowSpoonMode: checked })
  }

  return (
    <SettingsCard
      title={settingsPageCopy.accessibility.title}
      description={settingsPageCopy.accessibility.description}
      icon={<AlertCircle className="h-5 w-5 text-mint-600 dark:text-mint-400" />}
      iconBgColor="bg-mint-100 p-2 dark:bg-mint-900/30 high-contrast:bg-primary/20"
    >
      <div className="flex items-center justify-between rounded-lg border bg-white/50 p-4 dark:bg-lavender-950/30 high-contrast:border-black dark:high-contrast:border-white">
        <div className="space-y-0.5">
          <Label htmlFor="low-spoon-mode" className="text-base">
            {settingsPageCopy.accessibility.lowSpoonMode.label}
          </Label>
          <p className="text-sm text-muted-foreground">
            {settingsPageCopy.accessibility.lowSpoonMode.description}
          </p>
        </div>
        <Switch
          id="low-spoon-mode"
          checked={settings.lowSpoonMode}
          onCheckedChange={handleLowSpoonModeChange}
          className="data-[state=checked]:bg-mint-500 high-contrast:data-[state=checked]:bg-primary"
        />
      </div>
    </SettingsCard>
  )
} 