/** @fileoverview Contextual supportive message based on current energy and stimulation levels. */
import { getSupportiveMessage } from '@/utils/dashboardHelpers'

type SupportiveMessageProps = {
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
}

export const SupportiveMessage = ({ energyLevel, stimulationLevel, stimulationType }: SupportiveMessageProps) => {
  const supportiveMessage = getSupportiveMessage(energyLevel, stimulationLevel, stimulationType)

  return (
    <div className="mb-6 rounded-lg border border-lavender-200 bg-lavender-50/50 p-4 dark:border-lavender-800 dark:bg-lavender-900/30 high-contrast:border-primary high-contrast:bg-primary/5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {supportiveMessage.icon}
        </div>
        <p className="text-sm italic text-foreground">
          {supportiveMessage.message}
        </p>
      </div>
    </div>
  )
} 