/** @fileoverview Utility functions for the tracking form. */
import React from "react"

export type CategoryType = {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

export function getCategoryIcon(categoryId: string, categories: CategoryType[]) {
  const category = categories.find((c) => c.id === categoryId)
  if (!category) return null
  const Icon = category.icon
  return <Icon className={`h-4 w-4 ${category.color}`} />
} 