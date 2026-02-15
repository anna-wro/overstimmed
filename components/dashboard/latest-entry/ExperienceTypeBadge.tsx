/** @fileoverview Badge displaying the experience type with color coding. */
import { dashboardCopy } from '@/copy/dashboard'

type ExperienceTypeBadgeProps = {
  stimulationType: string
}

export const ExperienceTypeBadge = ({ stimulationType }: ExperienceTypeBadgeProps) => {
  if (stimulationType === "positive") {
    return (
      <span className="flex items-center rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium text-lavender-700 dark:bg-lavender-900/50 dark:text-lavender-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
        <div className="mr-1 h-2 w-2 rounded-full bg-lavender-400 high-contrast:bg-primary-foreground"></div>
        {dashboardCopy.latestEntry.experienceTypes.positive}
      </span>
    )
  }

  if (stimulationType === "neutral") {
    return (
      <span className="flex items-center rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-sand-700 dark:bg-sand-900/50 dark:text-sand-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
        <div className="mr-1 h-2 w-2 rounded-full bg-sand-400 high-contrast:bg-primary-foreground"></div>
        {dashboardCopy.latestEntry.experienceTypes.neutral}
      </span>
    )
  }

  if (stimulationType === "negative") {
    return (
      <span className="flex items-center rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-blush-700 dark:bg-blush-900/50 dark:text-blush-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
        <div className="mr-1 h-2 w-2 rounded-full bg-blush-400 high-contrast:bg-primary-foreground"></div>
        {dashboardCopy.latestEntry.experienceTypes.negative}
      </span>
    )
  }

  return null
} 