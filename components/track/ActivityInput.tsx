import React from "react"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { trackingPageCopy } from "@/copy/track"

interface ActivityInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ActivityInput: React.FC<ActivityInputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="activities" className="text-sm font-medium">
      {trackingPageCopy.activity.label}
    </Label>
    <Input
      id="activities"
      placeholder={trackingPageCopy.activity.placeholder}
      value={value}
      onChange={onChange}
      className="transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
    />
  </div>
) 