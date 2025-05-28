import React from "react"
import { Button } from "@/components/ui/Button"
import { PlusCircle } from "lucide-react"

interface EmptyStateProps {
  searchQuery: string
  isExactMatch: boolean
  addCustomTag: () => void
  copy: any
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, isExactMatch, addCustomTag, copy }) => (
  <div className="px-3 py-2 text-center text-sm text-muted-foreground">
    {searchQuery.trim() ? (
      <div className="space-y-2">
        <p>{copy?.noMatch}</p>
        {!isExactMatch && searchQuery.trim() && copy?.addCustom && (
          <Button
            variant="outline"
            size="sm"
            className="mx-auto flex items-center gap-1"
            onClick={addCustomTag}
          >
            <PlusCircle className="h-3.5 w-3.5 text-lavender-500" />
            <span>{copy.addCustom.replace("{tag}", searchQuery.trim())}</span>
          </Button>
        )}
      </div>
    ) : (
      copy?.typeToSearch
    )}
  </div>
) 