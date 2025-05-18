"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { AlertCircle } from "lucide-react"

type TriggerData = {
  trigger: string
  count: number
}

type TriggersTabProps = {
  topTriggers: TriggerData[]
  filteredEntries: any[]
  colors: Record<string, string>
}

export default function TriggersTab({ topTriggers, filteredEntries, colors }: TriggersTabProps) {
  // Helper function to determine if a stimulation level is comfortable based on type
  const isComfortableStimulation = (entry: any): boolean => {
    // Low stimulation (0-3) is comfortable if rated positive, uncomfortable if negative
    if (entry.stimulationLevel <= 3) {
      return entry.stimulationType === "positive"
    }

    // Medium stimulation (4-6) is generally comfortable unless rated negative
    if (entry.stimulationLevel <= 6) {
      return entry.stimulationType !== "negative"
    }

    // High stimulation (7-10) is uncomfortable unless rated positive
    return entry.stimulationType === "positive"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle>Common Triggers</CardTitle>
          <CardDescription>The most frequent triggers affecting your stimulation levels</CardDescription>
        </CardHeader>
        <CardContent>
          {topTriggers.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTriggers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="trigger" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill={colors.stimulation} name="Occurrences" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-10 text-muted-foreground">
              No trigger data available. Make sure to record triggers when tracking.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle>Trigger Impact Analysis</CardTitle>
          <CardDescription>How different triggers affect your energy and stimulation</CardDescription>
        </CardHeader>
        <CardContent>
          {topTriggers.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {topTriggers.slice(0, 5).map((trigger, index) => {
                  // Find entries with this trigger
                  const entriesWithTrigger = filteredEntries.filter((entry) =>
                    entry.triggers.toLowerCase().includes(trigger.trigger.toLowerCase()),
                  )

                  // Calculate average stimulation and energy for this trigger
                  const avgStim =
                    entriesWithTrigger.length > 0
                      ? Math.round(
                          (entriesWithTrigger.reduce((sum, e) => sum + e.stimulationLevel, 0) /
                            entriesWithTrigger.length) *
                            10,
                        ) / 10
                      : 0

                  const avgEnergy =
                    entriesWithTrigger.length > 0
                      ? Math.round(
                          (entriesWithTrigger.reduce((sum, e) => sum + e.energyLevel, 0) / entriesWithTrigger.length) *
                            10,
                        ) / 10
                      : 0

                  // Calculate percentage of positive, neutral, and negative experiences
                  const experiences = {
                    positive: entriesWithTrigger.filter((e) => e.stimulationType === "positive").length,
                    neutral: entriesWithTrigger.filter((e) => e.stimulationType === "neutral").length,
                    negative: entriesWithTrigger.filter((e) => e.stimulationType === "negative").length,
                  }

                  const total = experiences.positive + experiences.neutral + experiences.negative
                  const positivePercent = total > 0 ? Math.round((experiences.positive / total) * 100) : 0
                  const neutralPercent = total > 0 ? Math.round((experiences.neutral / total) * 100) : 0
                  const negativePercent = total > 0 ? Math.round((experiences.negative / total) * 100) : 0

                  // Calculate comfortable percentage
                  const comfortableCount = entriesWithTrigger.filter((e) => isComfortableStimulation(e)).length
                  const comfortablePercent = total > 0 ? Math.round((comfortableCount / total) * 100) : 0

                  return (
                    <div key={index} className="rounded-md border p-3 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{trigger.trigger}</span>
                        <Badge variant="outline">{trigger.count} occurrences</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Average Energy</div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-sand-500 rounded-full"
                                style={{ width: `${avgEnergy * 10}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{avgEnergy}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Average Stimulation</div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-lavender-500 rounded-full"
                                style={{ width: `${avgStim * 10}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{avgStim}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground mb-1">Experience Type</div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-mint-500" style={{ width: `${positivePercent}%` }}></div>
                        <div className="h-full bg-sand-500" style={{ width: `${neutralPercent}%` }}></div>
                        <div className="h-full bg-blush-500" style={{ width: `${negativePercent}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>{positivePercent}% positive</span>
                        <span>{neutralPercent}% neutral</span>
                        <span>{negativePercent}% negative</span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-muted">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Comfortable:</span>
                          <Badge
                            variant={comfortablePercent >= 50 ? "outline" : "secondary"}
                            className={
                              comfortablePercent >= 70
                                ? "bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
                                : comfortablePercent <= 30
                                  ? "bg-blush-100 text-blush-800 dark:bg-blush-900/50 dark:text-blush-300"
                                  : ""
                            }
                          >
                            {comfortablePercent}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {topTriggers.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  Showing top 5 triggers. You have {topTriggers.length} triggers in total.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="mb-2 h-10 w-10 text-lavender-400" />
              <p className="text-muted-foreground">Add more entries with triggers to see detailed impact analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
