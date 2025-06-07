import Link from 'next/link'
import { TrendingUp, LineChart, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '@/components/ui/Chart'
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

type ChartDataPoint = {
  date: string
  energy: number
  stimulation: number
}

type DashboardStats = {
  totalEntries: number
  avgEnergy: number
  avgStimulation: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
}

type InsightsSectionProps = {
  entries: TrackingEntry[]
  recentEntries: ChartDataPoint[]
  stats: DashboardStats
}

export const InsightsSection = ({ entries, recentEntries, stats }: InsightsSectionProps) => {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{dashboardCopy.insights.title}</h2>
        <Link href="/insights">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <TrendingUp className="mr-1 h-4 w-4" />
            {dashboardCopy.insights.viewAllInsights}
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-none bg-gradient-to-br from-mint-50/80 to-sky-50/80 shadow-xl dark:from-mint-900/30 dark:to-sky-900/30 high-contrast:bg-background high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white bg-white dark:bg-lavender-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-mint-400 to-sky-300 high-contrast:bg-primary"></div>

        <CardHeader className="bg-mint-100/50 pb-4 pt-6 dark:bg-mint-900/20 high-contrast:bg-accent">
          <CardTitle className="text-center text-xl">{dashboardCopy.insights.chartTitle}</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
            <div className="rounded-lg bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
              <div className="text-sm font-medium text-muted-foreground mb-1">{dashboardCopy.insights.stats.totalEntries}</div>
              <div className="text-3xl font-bold text-mint-600 dark:text-mint-400 high-contrast:text-foreground">
                {stats.totalEntries}
              </div>
            </div>

            <div className="rounded-lg bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
              <div className="text-sm font-medium text-muted-foreground mb-1">{dashboardCopy.insights.stats.avgEnergy}</div>
              <div className="text-3xl font-bold text-sand-600 dark:text-sand-400 high-contrast:text-foreground">
                {stats.avgEnergy}
              </div>
            </div>

            <div className="rounded-lg bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
              <div className="text-sm font-medium text-muted-foreground mb-1">{dashboardCopy.insights.stats.avgStimulation}</div>
              <div className="text-3xl font-bold text-lavender-600 dark:text-lavender-400 high-contrast:text-foreground">
                {stats.avgStimulation}
              </div>
            </div>
          </div>

          {/* Chart */}
          {recentEntries.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={recentEntries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis domain={[0, 10]} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#57b185"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    name={dashboardCopy.insights.chartLegend.energy}
                  />
                  <Line
                    type="monotone"
                    dataKey="stimulation"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    name={dashboardCopy.insights.chartLegend.stimulation}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <LineChart className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">{dashboardCopy.emptyStates.noChart}</p>
            </div>
          )}

          {/* Quick Insights */}
          {recentEntries.length > 3 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">{dashboardCopy.insights.quickInsights.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time of day insight */}
                <div className="rounded-lg border bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-lavender-500" />
                    <h4 className="font-medium">{dashboardCopy.insights.quickInsights.timeOfDay.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      // Group entries by time of day
                      const timeGroups = entries.reduce(
                        (acc, entry) => {
                          const date = new Date(entry.timestamp)
                          const hours = date.getHours()
                          let timeOfDay = "morning"
                          if (hours >= 12 && hours < 17) timeOfDay = "afternoon"
                          else if (hours >= 17 && hours < 21) timeOfDay = "evening"
                          else if (hours >= 21 || hours < 5) timeOfDay = "night"

                          if (!acc[timeOfDay]) acc[timeOfDay] = []
                          acc[timeOfDay].push(entry)
                          return acc
                        },
                        {} as Record<string, TrackingEntry[]>,
                      )

                      // Find time of day with highest average energy
                      let highestEnergyTime = ""
                      let highestEnergyAvg = 0

                      Object.entries(timeGroups).forEach(([time, entries]) => {
                        if (entries.length === 0) return
                        const avg = entries.reduce((sum, e) => sum + e.energyLevel, 0) / entries.length
                        if (avg > highestEnergyAvg) {
                          highestEnergyAvg = avg
                          highestEnergyTime = time
                        }
                      })

                      return highestEnergyTime
                        ? dashboardCopy.insights.timeOfDayInsight(highestEnergyTime)
                        : dashboardCopy.insights.timeOfDayFallback
                    })()}
                  </p>
                </div>

                {/* Trigger insight */}
                <div className="rounded-lg border bg-white/70 p-4 shadow-sm dark:bg-lavender-950/30 high-contrast:bg-background high-contrast:border high-contrast:border-black dark:high-contrast:border-white">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-mint-500" />
                    <h4 className="font-medium">{dashboardCopy.insights.quickInsights.commonTriggers.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      // Extract all triggers
                      const allTriggers = entries
                        .flatMap((entry) => entry.triggers.split(",").map((t) => t.trim()))
                        .filter((t) => t.length > 0)

                      // Count occurrences
                      const triggerCounts = allTriggers.reduce(
                        (acc, trigger) => {
                          acc[trigger] = (acc[trigger] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      )

                      // Get top trigger
                      const topTriggers = Object.entries(triggerCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 2)
                        .map(([trigger]) => trigger)

                      return topTriggers.length > 0
                        ? dashboardCopy.insights.commonTriggersInsight(topTriggers)
                        : dashboardCopy.insights.commonTriggersFallback
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between bg-mint-100/50 px-6 py-4 dark:bg-mint-900/20 high-contrast:bg-accent">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-mint-500"></div>
              <span className="text-xs text-muted-foreground">{dashboardCopy.insights.chartLegend.energy}</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-lavender-500"></div>
              <span className="text-xs text-muted-foreground">{dashboardCopy.insights.chartLegend.stimulation}</span>
            </div>
          </div>

          <Link href="/insights">
            <Button
              size="sm"
              className="group relative overflow-hidden bg-mint-500 text-white hover:bg-mint-600 dark:bg-mint-600 dark:hover:bg-mint-700 high-contrast:bg-primary"
            >
              <span className="relative z-10 flex items-center">
                {dashboardCopy.insights.viewDetailedInsights}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 