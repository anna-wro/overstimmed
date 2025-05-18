import React from "react"
import { Button } from "@/components/ui/Button"
import { PlusCircle } from "lucide-react"

interface EmptyStateProps {
  searchQuery: string
  isExactMatch: boolean
  addCustomTag: () => void
  triggerCopy: any
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, isExactMatch, addCustomTag, triggerCopy }) => (
  <div className="px-3 py-2 text-center text-sm text-muted-foreground">
    {searchQuery.trim() ? (
      <div className="space-y-2">
        <p>{triggerCopy.noMatch}</p>
        {!isExactMatch && searchQuery.trim() && (
          <Button
            variant="outline"
            size="sm"
            className="mx-auto flex items-center gap-1"
            onClick={addCustomTag}
          >
            <PlusCircle className="h-3.5 w-3.5 text-lavender-500" />
            <span>{triggerCopy.addCustom.replace("{tag}", searchQuery.trim())}</span>
          </Button>
        )}
      </div>
    ) : (
      triggerCopy.typeToSearch
    )}
  </div>
) 