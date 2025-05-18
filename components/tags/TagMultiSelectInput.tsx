import React, { useEffect } from "react"
import { trackingPageCopy } from "@/copy/track"
import { TagBadge } from "./TagBadge"
import { TagInputField } from "./TagInputField"
import { useTagMultiSelect } from "@/hooks/useTagMultiSelect"
import { TagInputContainer } from "./TagInputContainer"
import { SuggestionDropdown } from "./SuggestionDropdown"
import { TagInputHeader } from "./TagInputHeader"

interface TagMultiSelectInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export const TagMultiSelectInput: React.FC<TagMultiSelectInputProps> = ({ value, onChange }) => {
  const {
    previousTags,
    showSuggestions,
    searchQuery,
    focusedSuggestionIndex,
    inputRef,
    suggestionsRef,
    handleSearchInputChange,
    handleSearchInputKeyDown,
    addTag,
    removeTag,
    handleInputFocus,
    toggleSuggestions,
  } = useTagMultiSelect(value, onChange)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        toggleSuggestions()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    <div className="space-y-2">
      <TagInputHeader
        label={trackingPageCopy.trigger.label}
        showSuggestions={showSuggestions}
        toggleSuggestions={toggleSuggestions}
        ariaLabel={showSuggestions ? trackingPageCopy.trigger.hideSuggestions : trackingPageCopy.trigger.showSuggestions}
        inputId="triggers"
      />
      <div className="relative">
        <TagInputContainer showSuggestions={showSuggestions}>
          {value.map((tag, index) => (
            <TagBadge
              key={index}
              tag={tag}
              onRemove={() => removeTag(index)}
              removeLabel={trackingPageCopy.trigger.removeTag.replace("{tag}", tag)}
            />
          ))}
          <TagInputField
            showSuggestions={showSuggestions}
            focusedSuggestionIndex={focusedSuggestionIndex}
            inputRef={inputRef}
            searchQuery={searchQuery}
            handleSearchInputChange={handleSearchInputChange}
            handleSearchInputKeyDown={handleSearchInputKeyDown}
            handleInputFocus={handleInputFocus}
            valueLength={value.length}
            triggerCopy={trackingPageCopy.trigger}
          />
        </TagInputContainer>

        <SuggestionDropdown
          show={showSuggestions}
          suggestionsRef={suggestionsRef}
          value={value}
          previousTags={previousTags}
          onAddTag={addTag}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {trackingPageCopy.trigger.helpText}
      </p>
    </div>
  )
} 