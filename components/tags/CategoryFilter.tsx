import React from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { getCategoryIcon, CategoryType } from "../track/utils"

interface CategoryFilterProps {
  selectedCategories: string[]
  onToggle: (categoryId: string) => void
  categories: CategoryType[]
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onToggle, categories }) => (
  <div className="flex flex-wrap gap-1">
    {categories.map((category) => (
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
        {getCategoryIcon(category.id, categories)}
        <span className="text-xs">{category.name}</span>
      </Button>
    ))}
  </div>
) 