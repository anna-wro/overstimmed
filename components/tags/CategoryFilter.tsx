/** @fileoverview Category filter buttons for narrowing tag suggestions. */
import React from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { getCategoryIcon, CategoryType } from "../track/utils"

interface CategoryFilterProps {
  selectedCategories: string[]
  onToggle: (categoryId: string) => void
  categories: CategoryType[]
}

// Helper function to get the selected state classes for each color
const getSelectedClasses = (color: string) => {
  if (color.includes("mint")) {
    return "bg-mint-100 border-mint-300 text-mint-700 dark:bg-mint-900/30 dark:border-mint-700 dark:text-mint-300"
  }
  if (color.includes("sky")) {
    return "bg-sky-100 border-sky-300 text-sky-700 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-300"
  }
  if (color.includes("sand")) {
    return "bg-sand-100 border-sand-300 text-sand-700 dark:bg-sand-900/30 dark:border-sand-700 dark:text-sand-300"
  }
  if (color.includes("blush")) {
    return "bg-blush-100 border-blush-300 text-blush-700 dark:bg-blush-900/30 dark:border-blush-700 dark:text-blush-300"
  }
  if (color.includes("sage")) {
    return "bg-sage-100 border-sage-300 text-sage-700 dark:bg-sage-900/30 dark:border-sage-700 dark:text-sage-300"
  }
  if (color.includes("lavender")) {
    return "bg-lavender-100 border-lavender-300 text-lavender-700 dark:bg-lavender-900/30 dark:border-lavender-700 dark:text-lavender-300"
  }
  // Fallback
  return "bg-accent border-primary text-accent-foreground"
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onToggle, categories }) => (
  <div className="flex flex-wrap gap-1">
    {categories.map((category) => (
      <Button
        key={category.id}
        variant="outline"
        size="sm"
        className={cn(
          "h-7 gap-1 px-2 py-0 transition-colors hover:bg-muted",
          selectedCategories.includes(category.id)
            ? getSelectedClasses(category.color)
            : "",
        )}
        onClick={() => onToggle(category.id)}
      >
        {getCategoryIcon(category.id, categories)}
        <span className="text-xs">{category.name}</span>
      </Button>
    ))}
  </div>
) 