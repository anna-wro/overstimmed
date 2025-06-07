import type React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Slider } from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Palette } from "lucide-react"
import { SettingsCard } from "./SettingsCard"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/features/settings/useAppSettings"

interface AppearanceSettingsProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
}

export function AppearanceSettings({ settings, onSettingsChange }: AppearanceSettingsProps) {
  const { setTheme } = useTheme()

  const handleThemeChange = (value: string) => {
    const newSettings = { ...settings, theme: value }
    onSettingsChange(newSettings)
    setTheme(value)
  }

  const handleHighContrastChange = (checked: boolean) => {
    const newSettings = { ...settings, highContrastMode: checked }
    onSettingsChange(newSettings)
    if (checked) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  const handleFontSizeChange = (value: number[]) => {
    const newFontSize = value[0]
    const newSettings = { ...settings, fontSize: newFontSize }
    onSettingsChange(newSettings)
    // Apply font size change immediately
    document.documentElement.style.fontSize = `${newFontSize / 16}rem`
  }

  return (
    <SettingsCard
      title={settingsPageCopy.appearance.title}
      description={settingsPageCopy.appearance.description}
      icon={<Palette className="h-5 w-5 text-lavender-600 dark:text-lavender-400" />}
    >
      <div className="space-y-2">
        <Label htmlFor="theme">{settingsPageCopy.appearance.theme.label}</Label>
        <Select value={settings.theme} onValueChange={handleThemeChange}>
          <SelectTrigger
            id="theme"
            className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
          >
            <SelectValue placeholder={settingsPageCopy.appearance.theme.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">{settingsPageCopy.appearance.theme.options.light}</SelectItem>
            <SelectItem value="dark">{settingsPageCopy.appearance.theme.options.dark}</SelectItem>
            <SelectItem value="system">{settingsPageCopy.appearance.theme.options.system}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-white/50 p-4 dark:bg-lavender-950/30 high-contrast:border-black dark:high-contrast:border-white">
        <div className="space-y-0.5">
          <Label htmlFor="high-contrast" className="text-base">
            {settingsPageCopy.appearance.highContrast.label}
          </Label>
          <p className="text-sm text-muted-foreground">{settingsPageCopy.appearance.highContrast.description}</p>
        </div>
        <Switch
          id="high-contrast"
          checked={settings.highContrastMode}
          onCheckedChange={handleHighContrastChange}
          className="data-[state=checked]:bg-lavender-500 high-contrast:data-[state=checked]:bg-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="font-size">{settingsPageCopy.appearance.fontSize.label}</Label>
          <span className="font-mono text-sm tabular-nums">{settings.fontSize}px</span>
        </div>
        <Slider
          id="font-size"
          min={12}
          max={24}
          step={1}
          value={[settings.fontSize]}
          onValueChange={handleFontSizeChange}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{settingsPageCopy.appearance.fontSize.small}</span>
          <span>{settingsPageCopy.appearance.fontSize.medium}</span>
          <span>{settingsPageCopy.appearance.fontSize.large}</span>
        </div>
      </div>
    </SettingsCard>
  )
} 