import React from "react"
import { Button } from "@/components/ui/Button"
import { PlusCircle } from "lucide-react"
import { Tag } from "@/hooks/useTagMultiSelect"
import { TRIGGER_CATEGORIES } from "@/consts/triggerConstants"
import { getCategoryIcon } from "../track/utils"
import { EmptyState } from "./EmptyState"

interface SuggestionListProps {
  suggestions: Tag[]
  focusedIndex: number
  suggestionItemsRef: React.MutableRefObject<(HTMLLIElement | null)[]>
  onSuggestionClick: (tag: string) => void
  onSuggestionHover: (index: number) => void
  searchQuery: string
  isExactMatch: boolean
  addCustomTag: () => void
  copy: any
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  focusedIndex,
  suggestionItemsRef,
  onSuggestionClick,
  onSuggestionHover,
  searchQuery,
  isExactMatch,
  addCustomTag,
  copy,
}) => (
  <div className="max-h-60 overflow-y-auto py-1">
    {suggestions.length > 0 ? (
      <ul className="text-sm" role="listbox">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            ref={el => {
              suggestionItemsRef.current[index] = el;
            }}
            id={`suggestion-${index}`}
            className={
              "flex cursor-pointer items-center px-3 py-1.5 hover:bg-muted" +
              (focusedIndex === index ? " bg-muted" : "")
            }
            onClick={() => onSuggestionClick(suggestion.text)}
            onMouseEnter={() => onSuggestionHover(index)}
            role="option"
            aria-selected={focusedIndex === index}
          >
            <span className="mr-2">{getCategoryIcon(suggestion.category, TRIGGER_CATEGORIES)}</span>
            <span className="flex-1">{suggestion.text}</span>
            {index === 0 && copy?.tabHint && <span className="ml-2 text-xs text-muted-foreground">{copy.tabHint}</span>}
            {index === focusedIndex && copy?.enterHint && (
              <span className="ml-2 text-xs text-muted-foreground">{copy.enterHint}</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <EmptyState
        searchQuery={searchQuery}
        isExactMatch={isExactMatch}
        addCustomTag={addCustomTag}
        copy={copy}
      />
    )}
  </div>
) 