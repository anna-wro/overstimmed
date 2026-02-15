import React from "react"
import { Zap } from "lucide-react"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { trackingPageCopy } from "@/copy/track"

interface LowSpoonModeToggleProps {
  lowSpoonMode: boolean
  onToggle: (checked: boolean) => void
}

export const LowSpoonModeToggle: React.FC<LowSpoonModeToggleProps> = ({ 
  lowSpoonMode, 
  onToggle 
}) => {
  return (
    <div className="flex items-center justify-between p-6 rounded-lg bg-linear-to-r from-mint-50 to-lavender-50 border border-mint-200 dark:from-mint-950/30 dark:to-lavender-950/30 dark:border-mint-800 high-contrast:bg-accent high-contrast:border-black dark:high-contrast:border-white">
      <div className="flex items-center space-x-4">
        <Zap className="h-6 w-6 text-mint-600 dark:text-mint-400 high-contrast:text-foreground" />
        <div>
          <Label htmlFor="low-spoon-toggle" className="text-base font-medium text-mint-800 dark:text-mint-200 high-contrast:text-foreground cursor-pointer">
            {lowSpoonMode ? trackingPageCopy.lowSpoonMode.label.enabled : trackingPageCopy.lowSpoonMode.label.disabled}
          </Label>
          <p className="text-sm text-mint-600 dark:text-mint-400 high-contrast:text-muted-foreground mt-1">
            {lowSpoonMode ? trackingPageCopy.lowSpoonMode.description.enabled : trackingPageCopy.lowSpoonMode.description.disabled}
          </p>
        </div>
      </div>
      <Switch
        id="low-spoon-toggle"
        checked={lowSpoonMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-mint-500 data-[state=unchecked]:bg-mint-200 dark:data-[state=unchecked]:bg-mint-800 scale-125"
      />
    </div>
  )
} 