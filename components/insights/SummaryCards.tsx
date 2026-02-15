/** @fileoverview Summary statistic cards for entry count, energy, and stimulation averages. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Activity, Battery, Zap } from "lucide-react"
import { insightsPageCopy } from "@/copy/insights"

interface SummaryCardsProps {
  entriesCount: number
  timeRange: string
  avgEnergyLevel: number
  avgStimulationLevel: number
  comfortablePercent: number
  uncomfortablePercent: number
}

export function SummaryCards({
  entriesCount,
  timeRange,
  avgEnergyLevel,
  avgStimulationLevel,
  comfortablePercent,
  uncomfortablePercent,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Entry Count Card */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-mint-500" />
            {insightsPageCopy.summaryCards.entryCount.title}
          </CardTitle>
          <CardDescription>{insightsPageCopy.summaryCards.entryCount.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-3xl font-bold">{entriesCount}</div>
              <div className="text-xs text-muted-foreground">{insightsPageCopy.summaryCards.entryCount.totalEntries}</div>
            </div>
            <div className="h-10 border-r border-muted"></div>
            <div>
              <div className="text-3xl font-bold">
                {Math.round(entriesCount / (Number.parseInt(timeRange) / 7))}
              </div>
              <div className="text-xs text-muted-foreground">{insightsPageCopy.summaryCards.entryCount.entriesThisWeek}</div>
            </div>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">
            {insightsPageCopy.summaryCards.entryCount.helpText}
          </p>
        </CardContent>
      </Card>

      {/* Energy Level Card */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Battery className="h-5 w-5 text-sand-500" />
            {insightsPageCopy.summaryCards.energyLevel.title}
          </CardTitle>
          <CardDescription>{insightsPageCopy.summaryCards.energyLevel.average} {avgEnergyLevel}/10</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-blush-400 via-sand-400 to-mint-400 dark:from-blush-500 dark:via-sand-500 dark:to-mint-500"
              style={{ width: `${avgEnergyLevel * 10}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{insightsPageCopy.summaryCards.energyLevel.low}</span>
            <span>{insightsPageCopy.summaryCards.energyLevel.medium}</span>
            <span>{insightsPageCopy.summaryCards.energyLevel.high}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stimulation Level Card */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-lavender-500" />
            {insightsPageCopy.summaryCards.stimulationLevel.title}
          </CardTitle>
          <CardDescription>{insightsPageCopy.summaryCards.stimulationLevel.average} {avgStimulationLevel}/10</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-sand-400 via-lavender-400 to-blush-400 dark:from-sand-500 dark:via-lavender-500 dark:to-blush-500"
              style={{ width: `${avgStimulationLevel * 10}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{insightsPageCopy.summaryCards.stimulationLevel.under}</span>
            <span>{insightsPageCopy.summaryCards.stimulationLevel.balanced}</span>
            <span>{insightsPageCopy.summaryCards.stimulationLevel.over}</span>
          </div>

          {/* Comfortable vs Uncomfortable */}
          <div className="mt-3 pt-3 border-t border-muted">
            <div className="text-xs text-muted-foreground mb-1">{insightsPageCopy.summaryCards.stimulationLevel.experienceLabel}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-mint-500"></div>
                <span className="text-xs">
                  {comfortablePercent}% {insightsPageCopy.summaryCards.stimulationLevel.comfortable}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blush-500"></div>
                <span className="text-xs">
                  {uncomfortablePercent}% {insightsPageCopy.summaryCards.stimulationLevel.uncomfortable}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 