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
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={toggleSuggestions}
      aria-label={ariaLabel}
    >
      {showSuggestions ? (
        <ChevronUp className="h-4 w-4 text-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-foreground" />
      )}
    </Button>
  </div>
) 