"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Zap, Calendar, Clock, Activity, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type SummaryTabProps = {
  filteredEntries: any[]
  avgEnergyLevel: number
  avgStimulationLevel: number
  stimulationTypes: Record<string, number>
  balancedStatesData: any
  patterns: any[]
}

export default function SummaryTab({
  filteredEntries,
  avgEnergyLevel,
  avgStimulationLevel,
  stimulationTypes,
  balancedStatesData,
  patterns,
}: SummaryTabProps) {
  // Calculate percentages for stimulation types
  const totalEntries = filteredEntries.length
  const positivePercent = Math.round(((stimulationTypes.positive || 0) / totalEntries) * 100) || 0
  const neutralPercent = Math.round(((stimulationTypes.neutral || 0) / totalEntries) * 100) || 0
  const negativePercent = Math.round(((stimulationTypes.negative || 0) / totalEntries) * 100) || 0

  // Get most recent entry
  const mostRecentEntry =
    filteredEntries.length > 0
      ? filteredEntries.reduce((latest, entry) => {
          return new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest
        }, filteredEntries[0])
      : null

  // Helper function to get pattern badge color
  const getPatternBadgeColor = (severity: string) => {
    switch (severity) {
      case "warning":
        return "bg-blush-100 text-blush-800 dark:bg-blush-900/50 dark:text-blush-300"
      case "success":
        return "bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
      case "info":
      default:
        return "bg-lavender-100 text-lavender-800 dark:bg-lavender-900/50 dark:text-lavender-300"
    }
  }

  // Helper function to get pattern icon
  const getPatternIcon = (type: string) => {
    switch (type) {
      case "high-stimulation-negative":
        return <AlertCircle className="h-4 w-4" />
      case "high-stimulation-positive":
        return <Zap className="h-4 w-4" />
      case "low-energy":
        return <Battery className="h-4 w-4" />
      case "positive-experience":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Status */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-lavender-500" />
              Recent Status
            </CardTitle>
            <CardDescription>Your most recent tracking entry</CardDescription>
          </CardHeader>
          <CardContent>
            {mostRecentEntry ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(mostRecentEntry.timestamp), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium px-2 py-1 rounded-full",
                      mostRecentEntry.stimulationType === "positive"
                        ? "bg-mint-100 text-mint-800 dark:bg-mint-900/30 dark:text-mint-300"
                        : mostRecentEntry.stimulationType === "neutral"
                          ? "bg-sand-100 text-sand-800 dark:bg-sand-900/30 dark:text-sand-300"
                          : "bg-blush-100 text-blush-800 dark:bg-blush-900/30 dark:text-blush-300",
                    )}
                  >
                    {mostRecentEntry.stimulationType.charAt(0).toUpperCase() + mostRecentEntry.stimulationType.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Energy</span>
                      <span className="text-sm font-medium">{mostRecentEntry.energyLevel}/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-sand-500"
                        style={{ width: `${mostRecentEntry.energyLevel * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Stimulation</span>
                      <span className="text-sm font-medium">{mostRecentEntry.stimulationLevel}/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-lavender-500"
                        style={{ width: `${mostRecentEntry.stimulationLevel * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {mostRecentEntry.triggers && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Triggers</div>
                    <div className="text-sm">{mostRecentEntry.triggers}</div>
                  </div>
                )}

                {mostRecentEntry.activities && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Activities</div>
                    <div className="text-sm">{mostRecentEntry.activities}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No recent entries found</div>
            )}
          </CardContent>
        </Card>

        {/* Experience Breakdown */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-mint-500" />
              Experience Breakdown
            </CardTitle>
            <CardDescription>How you've been feeling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-mint-500"></div>
                  <span>Positive</span>
                </div>
                <span className="font-medium">{positivePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-mint-500" style={{ width: `${positivePercent}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-sand-500"></div>
                  <span>Neutral</span>
                </div>
                <span className="font-medium">{neutralPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-sand-500" style={{ width: `${neutralPercent}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blush-500"></div>
                  <span>Negative</span>
                </div>
                <span className="font-medium">{negativePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-blush-500" style={{ width: `${negativePercent}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-lavender-500" />
            Key Insights
          </CardTitle>
          <CardDescription>Important patterns from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patterns.length > 0 ? (
              <div className="space-y-3">
                {patterns.slice(0, 3).map((pattern, index) => (
                  <div
                    key={index}
                    className={cn("flex items-start gap-3 rounded-lg p-3", getPatternBadgeColor(pattern.severity))}
                  >
                    {getPatternIcon(pattern.type)}
                    <p>{pattern.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Not enough data to generate insights yet. Keep tracking to see patterns emerge.
              </div>
            )}

            {balancedStatesData.count > 0 && (
              <div className="mt-4 pt-4 border-t border-muted">
                <h3 className="font-medium mb-2">Balanced States</h3>
                <div className="space-y-2">
                  {balancedStatesData.timeOfDay && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-lavender-500 mt-0.5" />
                      <p>You tend to feel most balanced during the {balancedStatesData.timeOfDay}</p>
                    </div>
                  )}
                  {balancedStatesData.dayOfWeek && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-lavender-500 mt-0.5" />
                      <p>
                        {balancedStatesData.dayOfWeek.charAt(0).toUpperCase() + balancedStatesData.dayOfWeek.slice(1)}{" "}
                        is often your most balanced day
                      </p>
                    </div>
                  )}
                  {balancedStatesData.activities.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Activity className="h-4 w-4 text-lavender-500 mt-0.5" />
                      <p>
                        Activities that help you stay balanced:{" "}
                        {balancedStatesData.activities.map((a: any) => a.activity).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
