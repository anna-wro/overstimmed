/** @fileoverview Reminder notification settings panel. */
import type React from "react"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Bell } from "lucide-react"
import { SettingsCard } from "./SettingsCard"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"

interface RemindersSettingsProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
}

export function RemindersSettings({ settings, onSettingsChange }: RemindersSettingsProps) {
  const handleRemindersChange = (checked: boolean) => {
    onSettingsChange({ ...settings, reminders: checked })
  }

  const handleReminderFrequencyChange = (value: string) => {
    onSettingsChange({ ...settings, reminderFrequency: value })
  }

  return (
    <SettingsCard
      title={settingsPageCopy.reminders.title}
      description={settingsPageCopy.reminders.description}
      icon={<Bell className="h-5 w-5 text-sand-600 dark:text-sand-400" />}
      iconBgColor="bg-sand-100 p-2 dark:bg-sand-900/30 high-contrast:bg-primary/20"
    >
      <div className="flex items-center justify-between rounded-lg border bg-white/50 p-4 dark:bg-lavender-950/30 high-contrast:border-black dark:high-contrast:border-white">
        <div className="space-y-0.5">
          <Label htmlFor="reminders" className="text-base">
            {settingsPageCopy.reminders.enable.label}
          </Label>
          <p className="text-sm text-muted-foreground">
            {settingsPageCopy.reminders.enable.description}
          </p>
        </div>
        <Switch
          id="reminders"
          checked={settings.reminders}
          onCheckedChange={handleRemindersChange}
          className="data-[state=checked]:bg-sand-500 high-contrast:data-[state=checked]:bg-primary"
        />
      </div>

      {settings.reminders && (
        <div className="space-y-2">
          <Label htmlFor="reminder-frequency">{settingsPageCopy.reminders.frequency.label}</Label>
          <Select
            value={settings.reminderFrequency}
            onValueChange={handleReminderFrequencyChange}
          >
            <SelectTrigger
              id="reminder-frequency"
              className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
            >
              <SelectValue placeholder={settingsPageCopy.reminders.frequency.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">{settingsPageCopy.reminders.frequency.options.hourly}</SelectItem>
              <SelectItem value="daily">{settingsPageCopy.reminders.frequency.options.daily}</SelectItem>
              <SelectItem value="weekly">{settingsPageCopy.reminders.frequency.options.weekly}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </SettingsCard>
  )
} 