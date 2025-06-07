import { format } from 'date-fns'
import { Clock, AlertCircle, Activity, FileText, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { useDashboardHelpers } from '@/hooks/features/useDashboardHelpers'
import { SupportiveMessage } from './SupportiveMessage'
import { dashboardCopy } from '@/copy/dashboard'

type TrackingEntry = {
  timestamp: string
  energyLevel: number
  stimulationLevel: number
  stimulationType: string
  triggers: string
  activities: string
  notes: string
}

type LatestEntryCardProps = {
  latestEntry: TrackingEntry
}

export const LatestEntryCard = ({ latestEntry }: LatestEntryCardProps) => {
  const {
    getEnergyColor,
    getEnergyTextColor,
    getStimulationColor,
    getEnergyIcon,
    getEnergyText,
    getStimulationText,
  } = useDashboardHelpers()

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{dashboardCopy.latestEntry.title}</h2>
        <div className="flex items-center rounded-full bg-sand-100 dark:bg-sand-900 px-3 py-1 text-sm text-muted-foreground high-contrast:bg-accent high-contrast:text-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {format(new Date(latestEntry.timestamp), "PPP p")}
        </div>
      </div>

      <Card className="overflow-hidden border-none bg-gradient-to-br from-sand-50/80 to-lavender-50/80 shadow-xl dark:from-lavender-900/30 dark:to-sand-900/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lavender-400 to-sand-300 high-contrast:bg-primary"></div>
        <CardContent className="p-0">
          <div className="relative overflow-hidden p-6">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-lavender-200/50 dark:bg-lavender-800/20 high-contrast:hidden"></div>
            <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-sand-200/50 dark:bg-sand-800/20 high-contrast:hidden"></div>

            {/* Supportive message */}
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
                  <div className="flex items-center space-x-1">
                    {latestEntry.stimulationType === "positive" && (
                      <span className="flex items-center rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium text-lavender-700 dark:bg-lavender-900/50 dark:text-lavender-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
                        <div className="mr-1 h-2 w-2 rounded-full bg-lavender-400 high-contrast:bg-primary-foreground"></div>
                        {dashboardCopy.latestEntry.experienceTypes.positive}
                      </span>
                    )}
                    {latestEntry.stimulationType === "neutral" && (
                      <span className="flex items-center rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-sand-700 dark:bg-sand-900/50 dark:text-sand-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
                        <div className="mr-1 h-2 w-2 rounded-full bg-sand-400 high-contrast:bg-primary-foreground"></div>
                        {dashboardCopy.latestEntry.experienceTypes.neutral}
                      </span>
                    )}
                    {latestEntry.stimulationType === "negative" && (
                      <span className="flex items-center rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-blush-700 dark:bg-blush-900/50 dark:text-blush-300 high-contrast:bg-primary high-contrast:text-primary-foreground">
                        <div className="mr-1 h-2 w-2 rounded-full bg-blush-400 high-contrast:bg-primary-foreground"></div>
                        {dashboardCopy.latestEntry.experienceTypes.negative}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-8 space-y-6">
                  {/* Energy Level */}
                  <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                            latestEntry.energyLevel === 0
                              ? "bg-gray-100 dark:bg-gray-900/30"
                              : latestEntry.energyLevel <= 3
                                ? "bg-blush-100 dark:bg-blush-900/30"
                                : latestEntry.energyLevel <= 7
                                  ? "bg-sand-50 dark:bg-sand-900/20"
                                  : "bg-mint-50 dark:bg-mint-900/20"
                          } high-contrast:bg-accent`}
                        >
                          {getEnergyIcon(latestEntry.energyLevel)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.energy.label}</div>
                          <div
                            className={`font-semibold ${getEnergyTextColor(latestEntry.energyLevel)} high-contrast:text-foreground`}
                          >
                            {getEnergyText(latestEntry.energyLevel)}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                          latestEntry.energyLevel === 0
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300"
                            : latestEntry.energyLevel <= 3
                              ? "bg-blush-100 text-blush-600 dark:bg-blush-900/30 dark:text-blush-300"
                              : latestEntry.energyLevel <= 7
                                ? "bg-sand-50 text-sand-600 dark:bg-sand-900/20 dark:text-sand-300"
                                : "bg-mint-50 text-mint-600 dark:bg-mint-900/20 dark:text-mint-300"
                        } high-contrast:bg-primary high-contrast:text-primary-foreground high-contrast:font-extrabold`}
                      >
                        {latestEntry.energyLevel}
                      </div>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800 high-contrast:bg-muted">
                      <div
                        className={`h-full rounded-full ${getEnergyColor(latestEntry.energyLevel)} transition-all duration-500 high-contrast:bg-primary`}
                        style={{ width: `${latestEntry.energyLevel * 10}%` }}
                      ></div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {latestEntry.energyLevel === 0
                        ? dashboardCopy.latestEntry.energy.descriptions[0]
                        : latestEntry.energyLevel <= 3
                          ? dashboardCopy.latestEntry.energy.descriptions.low
                          : latestEntry.energyLevel <= 7
                            ? dashboardCopy.latestEntry.energy.descriptions.moderate
                            : dashboardCopy.latestEntry.energy.descriptions.high}
                    </p>
                  </div>

                  {/* Stimulation Level */}
                  <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sand-100 to-lavender-100 dark:from-sand-900/30 dark:to-lavender-900/30 high-contrast:bg-accent high-contrast:from-accent high-contrast:to-accent">
                          <Zap className="h-5 w-5 text-sand-600 dark:text-sand-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.stimulation.label}</div>
                          <div className="font-semibold high-contrast:text-foreground">
                            {getStimulationText(latestEntry.stimulationLevel)}
                          </div>
                        </div>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sand-100 to-lavender-100 text-xl font-bold dark:from-sand-900/30 dark:to-lavender-900/30 high-contrast:bg-primary high-contrast:from-primary high-contrast:to-primary high-contrast:text-primary-foreground high-contrast:font-extrabold">
                        {latestEntry.stimulationLevel}
                      </div>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-lavender-100 p-0.5 dark:bg-lavender-900/50 high-contrast:bg-muted">
                      <div
                        className={`h-full rounded-full ${getStimulationColor(
                          latestEntry.stimulationLevel,
                        )} transition-all duration-500 high-contrast:bg-primary`}
                        style={{ width: `${latestEntry.stimulationLevel * 10}%` }}
                      ></div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {latestEntry.stimulationLevel === 0
                        ? dashboardCopy.latestEntry.stimulation.descriptions[0]
                        : latestEntry.stimulationLevel <= 3
                          ? dashboardCopy.latestEntry.stimulation.descriptions.low
                          : latestEntry.stimulationLevel <= 7
                            ? dashboardCopy.latestEntry.stimulation.descriptions.moderate
                            : dashboardCopy.latestEntry.stimulation.descriptions.high}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column - Details */}
              <div className="relative">
                <h3 className="mb-6 text-xl font-semibold">{dashboardCopy.latestEntry.details}</h3>

                <div className="space-y-4">
                  {latestEntry.triggers && (
                    <div className="group rounded-xl border bg-white/70 p-4 shadow-sm transition-all hover:border-lavender-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-lavender-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
                      <div className="mb-2 flex items-center">
                        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-lavender-100 group-hover:bg-lavender-200 dark:bg-lavender-900/30 high-contrast:bg-accent">
                          <AlertCircle className="h-3.5 w-3.5 text-lavender-600 dark:text-lavender-400" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.detailSections.triggers}</span>
                      </div>
                      <p className="text-sm">{latestEntry.triggers}</p>
                    </div>
                  )}

                  {latestEntry.activities && (
                    <div className="group rounded-xl border bg-white/70 p-4 shadow-sm transition-all hover:border-sand-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-sand-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
                      <div className="mb-2 flex items-center">
                        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-sand-100 group-hover:bg-sand-200 dark:bg-sand-900/30 high-contrast:bg-accent">
                          <Activity className="h-3.5 w-3.5 text-sand-600 dark:text-sand-400" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.detailSections.activities}</span>
                      </div>
                      <p className="text-sm">{latestEntry.activities}</p>
                    </div>
                  )}

                  {latestEntry.notes && (
                    <div className="group rounded-xl border bg-white/70 p-4 shadow-sm transition-all hover:border-blush-200 hover:bg-white/80 dark:bg-lavender-950/30 dark:hover:border-blush-700 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white high-contrast:hover:border-primary">
                      <div className="mb-2 flex items-center">
                        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blush-100 group-hover:bg-blush-200 dark:bg-blush-900/30 high-contrast:bg-accent">
                          <FileText className="h-3.5 w-3.5 text-blush-600 dark:text-blush-400" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{dashboardCopy.latestEntry.detailSections.notes}</span>
                      </div>
                      <p className="text-sm">{latestEntry.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 