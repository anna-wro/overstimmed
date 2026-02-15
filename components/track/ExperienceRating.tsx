/** @fileoverview Experience type selector with positive, neutral, and negative options. */
import React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Label } from "@/components/ui/Label"
import { cn } from "@/lib/utils"
import { trackingPageCopy } from "@/copy/track"

interface ExperienceRatingProps {
  value: string
  onChange: (val: string) => void
}

export const ExperienceRating: React.FC<ExperienceRatingProps> = ({ value, onChange }) => {
  return (
    <div className="rounded-lg bg-sand-100/50 p-4 dark:bg-sand-900/50 high-contrast:bg-accent high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
      <Label className="mb-3 block text-sm font-medium">
        {trackingPageCopy.experienceRating.label}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-2 md:grid-cols-3"
      >
        <Label
          htmlFor="positive"
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-md border border-muted bg-background p-3 text-center transition-all hover:border-lavender-300 high-contrast:hover:border-primary",
            value === "positive" &&
              "border-2 border-lavender-400 ring-2 ring-lavender-200 dark:ring-lavender-900 high-contrast:border-primary high-contrast:ring-primary",
          )}
        >
          <RadioGroupItem value="positive" id="positive" className="sr-only" />
          <span>{trackingPageCopy.experienceRating.positive}</span>
        </Label>
        <Label
          htmlFor="neutral"
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-md border border-muted bg-background p-3 text-center transition-all hover:border-sand-300 high-contrast:hover:border-primary",
            value === "neutral" &&
              "border-2 border-sand-400 ring-2 ring-sand-200 dark:ring-sand-900 high-contrast:border-primary high-contrast:ring-primary",
          )}
        >
          <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
          <span>{trackingPageCopy.experienceRating.neutral}</span>
        </Label>
        <Label
          htmlFor="negative"
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-md border border-muted bg-background p-3 text-center transition-all hover:border-blush-300 high-contrast:hover:border-primary",
            value === "negative" &&
              "border-2 border-blush-400 ring-2 ring-blush-200 dark:ring-blush-900 high-contrast:border-primary high-contrast:ring-primary",
          )}
        >
          <RadioGroupItem value="negative" id="negative" className="sr-only" />
          <span>{trackingPageCopy.experienceRating.negative}</span>
        </Label>
      </RadioGroup>
    </div>
  )
} 