import React, { useEffect } from "react"
import { TagBadge } from "./TagBadge"
import { TagInputField } from "./TagInputField"
import { useTagMultiSelect, Tag } from "@/hooks/useTagMultiSelect"
import { TagInputContainer } from "./TagInputContainer"
import { SuggestionDropdown } from "./SuggestionDropdown"
import { TagInputHeader } from "./TagInputHeader"
import { DEFAULT_TRIGGERS } from "@/consts/triggerConstants"
import { TRIGGER_CATEGORIES } from "@/consts/triggerConstants"
import { CategoryType } from "../track/utils"

export interface TagMultiSelectCopy {
  label: string
  placeholder: string
  placeholderMore: string
  showSuggestions: string
  hideSuggestions: string
  removeTag: string // Should contain {tag} placeholder
  helpText: string
}

export type { Tag }

export const createTagMultiSelectCopy = (source: any): TagMultiSelectCopy => ({
  label: source.label,
  placeholder: source.placeholder,
  placeholderMore: source.placeholderMore,
  showSuggestions: source.showSuggestions,
  hideSuggestions: source.hideSuggestions,
  removeTag: source.removeTag,
  helpText: source.helpText,
})

interface TagMultiSelectInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  copy: TagMultiSelectCopy
  inputId?: string
  storageKey?: string
  defaultTags?: Tag[]
  categories?: CategoryType[]
}

export const TagMultiSelectInput: React.FC<TagMultiSelectInputProps> = ({ 
  value, 
  onChange, 
  copy,
  inputId = "tags",
  storageKey = "tags",
  defaultTags = DEFAULT_TRIGGERS,
  categories = TRIGGER_CATEGORIES
}) => {
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
  } = useTagMultiSelect(value, onChange, storageKey, defaultTags)

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
        label={copy.label}
        showSuggestions={showSuggestions}
        toggleSuggestions={toggleSuggestions}
        ariaLabel={showSuggestions ? copy.hideSuggestions : copy.showSuggestions}
        inputId={inputId}
      />
      <div className="relative">
        <TagInputContainer showSuggestions={showSuggestions}>
          {value.map((tag, index) => (
            <TagBadge
              key={index}
              tag={tag}
              onRemove={() => removeTag(index)}
              removeLabel={copy.removeTag.replace("{tag}", tag)}
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
            copy={copy}
            inputId={inputId}
          />
        </TagInputContainer>

        <SuggestionDropdown
          show={showSuggestions}
          suggestionsRef={suggestionsRef}
          value={value}
          previousTags={previousTags}
          onAddTag={addTag}
          inputId={inputId}
          copy={copy}
          categories={categories}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {copy.helpText}
      </p>
    </div>
  )
} 