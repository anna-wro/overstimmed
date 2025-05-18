import React from "react"
import { TriggerCategory } from "@/consts/triggerConstants"

export function getCategoryIcon(categoryId: string, categories: TriggerCategory[]) {
  const category = categories.find((c) => c.id === categoryId)
  if (!category) return null
  const Icon = category.icon
  return <Icon className={`h-4 w-4 ${category.color}`} />
} 