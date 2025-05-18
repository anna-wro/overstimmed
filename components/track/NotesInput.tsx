import React from "react"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { trackingPageCopy } from "@/copy/track"

interface NotesInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}
 
export const NotesInput: React.FC<NotesInputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="notes" className="text-sm font-medium">
      {trackingPageCopy.notes.label}
    </Label>
    <Textarea
      id="notes"
      placeholder={trackingPageCopy.notes.placeholder}
      value={value}
      onChange={onChange}
      rows={3}
      className="resize-none transition-all focus-visible:ring-lavender-400 high-contrast:border-black dark:high-contrast:border-white"
    />
  </div>
) 