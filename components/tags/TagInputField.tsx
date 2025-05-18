import React from "react"
import { Input } from "@/components/ui/Input"
import { Search } from "lucide-react"

interface TagInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showSuggestions: boolean
  focusedSuggestionIndex: number
  inputRef: React.RefObject<HTMLInputElement | null>
  searchQuery: string
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleInputFocus: () => void
  valueLength: number
  triggerCopy: any
}

const TagInputField = React.forwardRef<HTMLInputElement, TagInputFieldProps>(({
  showSuggestions,
  focusedSuggestionIndex,
  inputRef,
  searchQuery,
  handleSearchInputChange,
  handleSearchInputKeyDown,
  handleInputFocus,
  valueLength,
  triggerCopy,
  ...props
}, ref) => (
  <div className="relative flex-1 min-w-[200px]">
    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      ref={ref || inputRef}
      id="triggers"
      value={searchQuery}
      onChange={handleSearchInputChange}
      onKeyDown={handleSearchInputKeyDown}
      onFocus={handleInputFocus}
      placeholder={valueLength ? triggerCopy.placeholderMore : triggerCopy.placeholder}
      aria-expanded={showSuggestions}
      aria-autocomplete="list"
      aria-controls="trigger-suggestions"
      aria-activedescendant={
        focusedSuggestionIndex >= 0 ? `suggestion-${focusedSuggestionIndex}` : undefined
      }
      className="pl-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-6 py-0 text-sm"
      {...props}
    />
  </div>
))
TagInputField.displayName = "TagInputField"

export { TagInputField } 