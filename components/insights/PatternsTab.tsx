"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/Chart"
import { Heart, Leaf, Sparkles, Home } from "lucide-react"

type TimeOfDayData = {
  time: string
  energy: number
  stimulation: number
  count: number
  positivePercent: number
  comfortableStimPercent: number
}

type DayOfWeekData = {
  day: string
  energy: number
  stimulation: number
  count: number
  positivePercent: number
  comfortableStimPercent: number
}

type BalancedStatesData = {
  count: number
  timeOfDay: string | null
  dayOfWeek: string | null
  activities: Array<{ activity: string; count: number }>
}

type RecoveryPatternsData = {
  count: number
  avgRecoveryTime: number
  activities: Array<{ activity: string; count: number }>
}

type EnvironmentalFactorsData = Array<{
  environment: string
  count: number
  energy: number
  stimulation: number
  positivePercent: number
  neutralPercent: number
  negativePercent: number
}>

type StimulationTypes = Record<string, number>

type PatternsTabProps = {
  timeOfDayData: TimeOfDayData[]
  dayOfWeekData: DayOfWeekData[]
  balancedStatesData: BalancedStatesData
  recoveryPatternsData: RecoveryPatternsData
  environmentalFactorsData: EnvironmentalFactorsData
  stimulationTypes: StimulationTypes
  colors: Record<string, string>
}

export default function PatternsTab({
  timeOfDayData,
  dayOfWeekData,
  balancedStatesData,
  recoveryPatternsData,
  environmentalFactorsData,
  stimulationTypes,
  colors,
}: PatternsTabProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Time of Day Analysis */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle>Time of Day Analysis</CardTitle>
            <CardDescription>How your energy and stimulation vary throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded p-2 text-xs shadow-sm">
                            <p className="font-medium capitalize">{label}</p>
                            <p>Energy: {data.energy}</p>
                            <p>Stimulation: {data.stimulation}</p>
                            <p>Positive: {data.positivePercent}%</p>
                            <p>Comfortable: {data.comfortableStimPercent}%</p>
                            <p>Entries: {data.count}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="energy" name="Energy Level" fill={colors.energy} />
                  <Bar dataKey="stimulation" name="Stimulation Level" fill={colors.stimulation} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm">
              <p className="text-muted-foreground">
                {timeOfDayData.some((d) => d.count > 0) ? (
                  <>
                    Your {timeOfDayData.find((d) => d.energy === Math.max(...timeOfDayData.map((d) => d.energy)))?.time}{" "}
                    tends to have your highest energy levels. Your stimulation is most comfortable during the{" "}
                    {
                      timeOfDayData.find(
                        (d) =>
                          d.comfortableStimPercent === Math.max(...timeOfDayData.map((d) => d.comfortableStimPercent)),
                      )?.time
                    }
                    .
                  </>
                ) : (
                  "Add more entries to see patterns throughout the day."
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Day of Week Analysis */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle>Day of Week Analysis</CardTitle>
            <CardDescription>How your energy and stimulation vary by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded p-2 text-xs shadow-sm">
                            <p className="font-medium capitalize">{label}</p>
                            <p>Energy: {data.energy}</p>
                            <p>Stimulation: {data.stimulation}</p>
                            <p>Positive: {data.positivePercent}%</p>
                            <p>Comfortable: {data.comfortableStimPercent}%</p>
                            <p>Entries: {data.count}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="energy" name="Energy Level" fill={colors.energy} />
                  <Bar dataKey="stimulation" name="Stimulation Level" fill={colors.stimulation} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm">
              <p className="text-muted-foreground">
                {dayOfWeekData.some((d) => d.count > 0) ? (
                  <>
                    Your energy tends to be highest on{" "}
                    {
                      dayOfWeekData.find(
                        (d) => d.energy === Math.max(...dayOfWeekData.filter((d) => d.count > 0).map((d) => d.energy)),
                      )?.day
                    }
                    s. Your most comfortable days are{" "}
                    {
                      dayOfWeekData.find(
                        (d) =>
                          d.comfortableStimPercent ===
                          Math.max(...dayOfWeekData.filter((d) => d.count > 0).map((d) => d.comfortableStimPercent)),
                      )?.day
                    }
                    s.
                  </>
                ) : (
                  "Add more entries to see patterns by day of week."
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Experience Type Distribution */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle>Experience Type Distribution</CardTitle>
            <CardDescription>Breakdown of your positive, neutral, and negative experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Positive", value: stimulationTypes.positive || 0 },
                      { name: "Neutral", value: stimulationTypes.neutral || 0 },
                      { name: "Negative", value: stimulationTypes.negative || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill={colors.positive} />
                    <Cell fill={colors.neutral} />
                    <Cell fill={colors.negative} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: colors.positive }}></div>
                <span className="text-sm">Positive</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: colors.neutral }}></div>
                <span className="text-sm">Neutral</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: colors.negative }}></div>
                <span className="text-sm">Negative</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balanced States Analysis */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-mint-500" />
              Balanced States
            </CardTitle>
            <CardDescription>When you feel most balanced and comfortable</CardDescription>
          </CardHeader>
          <CardContent>
            {balancedStatesData.count > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Best time of day:</span>
                    <Badge
                      variant="outline"
                      className="bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
                    >
                      {balancedStatesData.timeOfDay || "Not enough data"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Best day of week:</span>
                    <Badge
                      variant="outline"
                      className="bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
                    >
                      {balancedStatesData.dayOfWeek
                        ? balancedStatesData.dayOfWeek.charAt(0).toUpperCase() + balancedStatesData.dayOfWeek.slice(1)
                        : "Not enough data"}
                    </Badge>
                  </div>
                </div>

                {balancedStatesData.activities.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Activities during balanced states:</h4>
                    <div className="space-y-2">
                      {balancedStatesData.activities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-mint-500" />
                          <span className="text-sm">{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    You've experienced {balancedStatesData.count} balanced states in this time period. Try to recreate
                    these conditions when you need to feel centered.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="mb-2 h-10 w-10 text-mint-400" />
                <p className="text-muted-foreground">Add more entries to identify when you feel most balanced.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recovery Patterns */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-mint-500" />
              Recovery Patterns
            </CardTitle>
            <CardDescription>How you recover from high stimulation</CardDescription>
          </CardHeader>
          <CardContent>
            {recoveryPatternsData.count > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recovery instances:</span>
                    <Badge
                      variant="outline"
                      className="bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
                    >
                      {recoveryPatternsData.count}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average recovery time:</span>
                    <Badge
                      variant="outline"
                      className="bg-mint-100 text-mint-800 dark:bg-mint-900/50 dark:text-mint-300"
                    >
                      {recoveryPatternsData.avgRecoveryTime} hours
                    </Badge>
                  </div>
                </div>

                {recoveryPatternsData.activities.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Effective recovery activities:</h4>
                    <div className="space-y-2">
                      {recoveryPatternsData.activities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-mint-500" />
                          <span className="text-sm">{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    These activities have helped you recover from high stimulation in the past. Consider them when you
                    need to restore balance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Leaf className="mb-2 h-10 w-10 text-mint-400" />
                <p className="text-muted-foreground">Add more entries to identify your recovery patterns.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environmental Factors */}
        <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-lavender-500" />
              Environmental Factors
            </CardTitle>
            <CardDescription>How different environments affect you</CardDescription>
          </CardHeader>
          <CardContent>
            {environmentalFactorsData.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {environmentalFactorsData.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-2 bg-background">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-lavender-500" />
                        <span className="text-sm capitalize">{item.environment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Energy:</span>
                            <span className="text-xs font-medium">{item.energy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Stim:</span>
                            <span className="text-xs font-medium">{item.stimulation}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Positive:</span>
                            <span className="text-xs font-medium">{item.positivePercent}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    These environments appear to have different effects on your energy and stimulation levels. Consider
                    this when planning your day.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Home className="mb-2 h-10 w-10 text-lavender-400" />
                <p className="text-muted-foreground">
                  Mention environments in your activities or notes to see how they affect you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
