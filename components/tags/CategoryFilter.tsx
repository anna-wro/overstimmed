import React from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { TRIGGER_CATEGORIES, TriggerCategory } from "@/consts/triggerConstants"
import { getCategoryIcon } from "../track/utils"

interface CategoryFilterProps {
  selectedCategories: string[]
  onToggle: (categoryId: string) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onToggle }) => (
  <div className="flex flex-wrap gap-1">
    {TRIGGER_CATEGORIES.map((category) => (
      <Button
        key={category.id}
        variant="outline"
        size="sm"
        className={cn(
          "h-7 gap-1 px-2 py-0",
          selectedCategories.includes(category.id)
            ? `bg-${category.color.split("-")[1]}-100 border-${category.color.split("-")[1]}-300 text-${category.color.split("-")[1]}-700 high-contrast:bg-accent high-contrast:border-primary`
            : "",
        )}
        onClick={() => onToggle(category.id)}
      >
        {getCategoryIcon(category.id, TRIGGER_CATEGORIES)}
        <span className="text-xs">{category.name}</span>
      </Button>
    ))}
  </div>
) 