import { Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { SupportiveMessage } from '../shared/SupportiveMessage'
import { LatestEntryHeader } from './LatestEntryHeader'
import { ExperienceTypeBadge } from './ExperienceTypeBadge'
import { LevelCard } from './LevelCard'
import { EntryDetailSection } from './EntryDetailSection'
import {
  getEnergyIcon,
  getEnergyColor,
  getEnergyTextColor,
  getEnergyText,
  getEnergyBackgroundColor,
  getEnergyNumberColor,
  getEnergyDescription,
  getStimulationColor,
  getStimulationText,
  getStimulationDescription,
} from '@/utils/levelFormatting'
import { dashboardCopy } from '@/copy/dashboard'
import type { TrackingEntry } from '@/lib/entries'

type LatestEntryCardProps = {
  latestEntry: TrackingEntry
}

export const LatestEntryCard = ({ latestEntry }: LatestEntryCardProps) => {

  return (
    <div className="mb-10">
      <LatestEntryHeader timestamp={latestEntry.timestamp} />

      <Card className="overflow-hidden border-none bg-gradient-to-br from-sand-50/80 to-lavender-50/80 shadow-xl dark:from-lavender-900/30 dark:to-sand-900/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
        <CardContent className="p-0">
          <div className="relative overflow-hidden p-6">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-lavender-200/50 dark:bg-lavender-800/20 high-contrast:hidden"></div>
            <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-sand-200/50 dark:bg-sand-800/20 high-contrast:hidden"></div>

            <SupportiveMessage
              energyLevel={latestEntry.energyLevel}
              stimulationLevel={latestEntry.stimulationLevel}
              stimulationType={latestEntry.stimulationType}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left column - Energy & Stimulation Summary */}
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{dashboardCopy.latestEntry.howYouFelt}</h3>
                  <ExperienceTypeBadge stimulationType={latestEntry.stimulationType} />
                </div>

                <div className="mb-8 space-y-6">
                  <LevelCard
                    label={dashboardCopy.latestEntry.energy.label}
                    level={latestEntry.energyLevel}
                    text={getEnergyText(latestEntry.energyLevel)}
                    description={getEnergyDescription(latestEntry.energyLevel)}
                    icon={getEnergyIcon(latestEntry.energyLevel)}
                    backgroundColorClass={getEnergyBackgroundColor(latestEntry.energyLevel)}
                    numberColorClass={getEnergyNumberColor(latestEntry.energyLevel)}
                    textColorClass={getEnergyTextColor(latestEntry.energyLevel)}
                    progressColorClass={getEnergyColor(latestEntry.energyLevel)}
                    progressBackgroundClass="bg-gray-100 dark:bg-gray-800"
                  />

                  <LevelCard
                    label={dashboardCopy.latestEntry.stimulation.label}
                    level={latestEntry.stimulationLevel}
                    text={getStimulationText(latestEntry.stimulationLevel)}
                    description={getStimulationDescription(latestEntry.stimulationLevel)}
                    icon={<Zap className="h-5 w-5 text-sand-600 dark:text-sand-400" />}
                    backgroundColorClass="bg-gradient-to-br from-sand-100 to-lavender-100 dark:from-sand-900/30 dark:to-lavender-900/30"
                    numberColorClass="bg-gradient-to-br from-sand-100 to-lavender-100 text-xl font-bold dark:from-sand-900/30 dark:to-lavender-900/30"
                    textColorClass="high-contrast:text-foreground"
                    progressColorClass={getStimulationColor(latestEntry.stimulationLevel)}
                    progressBackgroundClass="bg-lavender-100 dark:bg-lavender-900/50"
                  />
                </div>
              </div>

              {/* Right column - Details */}
              <EntryDetailSection
                triggers={latestEntry.triggers}
                activities={latestEntry.activities}
                notes={latestEntry.notes}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 