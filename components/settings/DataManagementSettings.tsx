import type React from "react"
import { useRef } from "react"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Save } from "lucide-react"
import { SettingsCard } from "./SettingsCard"
import { settingsPageCopy } from "@/copy/settings"
import type { AppSettings } from "@/hooks/useAppSettings"

interface DataManagementSettingsProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  onExportData: () => void
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearAllData: () => void
}

export function DataManagementSettings({ 
  settings, 
  onSettingsChange, 
  onExportData, 
  onFileChange, 
  onClearAllData 
}: DataManagementSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportFormatChange = (value: string) => {
    onSettingsChange({ ...settings, exportFormat: value })
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <SettingsCard
      title={settingsPageCopy.dataManagement.title}
      description={settingsPageCopy.dataManagement.description}
      icon={<Save className="h-5 w-5 text-green-600 dark:text-green-400" />}
      iconBgColor="bg-green-100 p-2 dark:bg-green-900/30 high-contrast:bg-primary/20"
    >
      <div className="space-y-2 mb-4">
        <Label htmlFor="export-format">{settingsPageCopy.dataManagement.exportFormat.label}</Label>
        <Select
          value={settings.exportFormat}
          onValueChange={handleExportFormatChange}
        >
          <SelectTrigger
            id="export-format"
            className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
          >
            <SelectValue placeholder={settingsPageCopy.dataManagement.exportFormat.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">{settingsPageCopy.dataManagement.exportFormat.options.json}</SelectItem>
            <SelectItem value="csv">{settingsPageCopy.dataManagement.exportFormat.options.csv}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {settingsPageCopy.dataManagement.exportFormat.helpText}
        </p>
      </div>

      <Button onClick={onExportData} className="w-full">
        {settingsPageCopy.dataManagement.buttons.export}
      </Button>

      <input
        type="file"
        accept=".json,.csv"
        onChange={onFileChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <Button onClick={triggerFileInput} variant="outline" className="w-full">
        {settingsPageCopy.dataManagement.buttons.import}
      </Button>

      <Button onClick={onClearAllData} variant="destructive" className="w-full">
        {settingsPageCopy.dataManagement.buttons.clear}
      </Button>
    </SettingsCard>
  )
} 