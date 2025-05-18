import React from "react"
import { Badge } from "@/components/ui/Badge"
import { X } from "lucide-react"

interface TagBadgeProps {
  tag: string
  onRemove: () => void
  removeLabel: string
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, onRemove, removeLabel }) => (
  <Badge
    variant="secondary"
    className="flex h-6 items-center gap-1 px-2 py-1 text-xs bg-sand-100 text-sand-800 border border-sand-200 dark:bg-lavender-900/30 dark:text-lavender-300 dark:border-lavender-800 high-contrast:bg-primary/20 high-contrast:text-primary dark:high-contrast:bg-primary/30 dark:high-contrast:text-primary-foreground"
  >
    {tag}
    <button
      type="button"
      onClick={onRemove}
      className="ml-1 rounded-full hover:bg-muted p-0.5"
    >
      <X className="h-3 w-3" />
      <span className="sr-only">{removeLabel}</span>
    </button>
  </Badge>
) 