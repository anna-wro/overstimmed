export const getExperienceTypeText = (type: string): string => {
  if (type === "positive") return "Positive/Energizing"
  if (type === "neutral") return "Neutral/Balanced"
  return "Negative/Draining"
}

export const getExperienceTypeColor = (type: string): string => {
  if (type === "positive") return "text-mint-600 dark:text-mint-400"
  if (type === "neutral") return "text-sand-600 dark:text-sand-400"
  return "text-blush-600 dark:text-blush-400"
}

export const getExperienceTypeBgColor = (type: string): string => {
  if (type === "positive") return "bg-mint-100 text-mint-900 dark:bg-mint-900/30 dark:text-mint-300"
  if (type === "neutral") return "bg-sand-100 text-sand-900 dark:bg-sand-900/30 dark:text-sand-300"
  return "bg-blush-100 text-blush-900 dark:bg-blush-900/30 dark:text-blush-300"
} 