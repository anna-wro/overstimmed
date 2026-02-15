/** @fileoverview Header label and toggle button for the tag input. */
import React from "react"
import { Button } from "@/components/ui/Button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TagInputHeaderProps {
  label: string
  showSuggestions: boolean
  toggleSuggestions: () => void
  ariaLabel: string
  inputId: string
}

export const TagInputHeader: React.FC<TagInputHeaderProps> = ({
  label,
  showSuggestions,
  toggleSuggestions,
  ariaLabel,
  inputId,
}) => (
  <div className="flex items-center justify-between">
    <label htmlFor={inputId} className="text-sm font-medium text-foreground">
      {label}
    </label>
  </div>
) 