import React from "react"
import { Button } from "@/components/ui/Button"
import { PlusCircle } from "lucide-react"
import { TriggerTag, TRIGGER_CATEGORIES } from "@/consts/triggerConstants"
import { getCategoryIcon } from "../track/utils"
import { EmptyState } from "./EmptyState"

interface SuggestionListProps {
  suggestions: TriggerTag[]
  focusedIndex: number
  suggestionItemsRef: React.MutableRefObject<(HTMLLIElement | null)[]>
  onSuggestionClick: (tag: string) => void
  onSuggestionHover: (index: number) => void
  searchQuery: string
  isExactMatch: boolean
  addCustomTag: () => void
  triggerCopy: any
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
  triggerCopy,
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
            {index === 0 && <span className="ml-2 text-xs text-muted-foreground">{triggerCopy.tabHint}</span>}
            {index === focusedIndex && (
              <span className="ml-2 text-xs text-muted-foreground">{triggerCopy.enterHint}</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <EmptyState
        searchQuery={searchQuery}
        isExactMatch={isExactMatch}
        addCustomTag={addCustomTag}
        triggerCopy={triggerCopy}
      />
    )}
  </div>
) 