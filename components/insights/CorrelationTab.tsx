"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "@/components/ui/Chart"

type CorrelationDataPoint = {
  energy: number
  stimulation: number
  type: string
  comfortable: boolean
}

type CorrelationTabProps = {
  correlationData: CorrelationDataPoint[]
  colors: Record<string, string>
}

export default function CorrelationTab({ correlationData, colors }: CorrelationTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle>Energy-Stimulation Correlation</CardTitle>
          <CardDescription>Relationship between your energy and stimulation levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="energy"
                  name="Energy"
                  domain={[0, 10]}
                  label={{ value: "Energy Level", position: "bottom", offset: 0 }}
                />
                <YAxis
                  type="number"
                  dataKey="stimulation"
                  name="Stimulation"
                  domain={[0, 10]}
                  label={{ value: "Stimulation Level", angle: -90, position: "left" }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                {["positive", "neutral", "negative"].map((type) => (
                  <Scatter
                    key={type}
                    name={type.charAt(0).toUpperCase() + type.slice(1)}
                    data={correlationData.filter((d) => d.type === type)}
                    fill={colors[type as keyof typeof colors]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="space-y-2 w-full">
            <h3 className="text-sm font-medium">Correlation Analysis</h3>
            <p className="text-sm text-muted-foreground">
              {correlationData.length > 5 ? (
                <>
                  {correlationData.filter((d) => d.energy >= 7 && d.stimulation <= 3 && d.type === "positive").length >
                    0 &&
                    "You often experience high energy with low stimulation as positive - this may be an ideal state for focused work. "}
                  {correlationData.filter((d) => d.energy <= 3 && d.stimulation >= 7 && d.type === "negative").length >
                    0 &&
                    "You sometimes experience low energy with high stimulation as negative - this may indicate overstimulation that's draining your energy. "}
                  {correlationData.filter((d) => d.energy >= 7 && d.stimulation >= 7 && d.type === "positive").length >
                    0 &&
                    "When both energy and stimulation are high and rated positive - these are your 'flow state' moments. "}
                  {correlationData.filter((d) => d.energy <= 3 && d.stimulation <= 3 && d.type === "negative").length >
                    0 &&
                    "Low energy and low stimulation periods rated as negative might indicate you need more rest or a change of environment. "}
                </>
              ) : (
                "Add more entries to see patterns in how your energy and stimulation levels relate to each other."
              )}
            </p>
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle>Quadrant Analysis</CardTitle>
          <CardDescription>Understanding your energy-stimulation patterns</CardDescription>
        </CardHeader>
        <CardContent>
          {correlationData.length > 0 ? (
            <div className="space-y-6">
              <div className="relative h-[300px] border rounded-md overflow-hidden">
                {/* Quadrant background colors */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="bg-mint-100/50 dark:bg-mint-900/20"></div>
                  <div className="bg-lavender-100/50 dark:bg-lavender-900/20"></div>
                  <div className="bg-sand-100/50 dark:bg-sand-900/20"></div>
                  <div className="bg-blush-100/50 dark:bg-blush-900/20"></div>
                </div>

                {/* Quadrant labels */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                  <div className="flex items-center justify-center p-2">
                    <div className="text-xs font-medium text-center text-mint-800 dark:text-mint-300">
                      High Energy
                      <br />
                      Low Stimulation
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2">
                    <div className="text-xs font-medium text-center text-lavender-800 dark:text-lavender-300">
                      High Energy
                      <br />
                      High Stimulation
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2">
                    <div className="text-xs font-medium text-center text-sand-800 dark:text-sand-300">
                      Low Energy
                      <br />
                      Low Stimulation
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2">
                    <div className="text-xs font-medium text-center text-blush-800 dark:text-blush-300">
                      Low Energy
                      <br />
                      High Stimulation
                    </div>
                  </div>
                </div>

                {/* Scatter plot */}
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="energy"
                        domain={[0, 10]}
                        tick={false}
                        axisLine={{ stroke: "#888", strokeWidth: 1 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="stimulation"
                        domain={[0, 10]}
                        tick={false}
                        axisLine={{ stroke: "#888", strokeWidth: 1 }}
                      />
                      <ZAxis range={[60, 60]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded p-2 text-xs shadow-sm">
                                <p>Energy: {payload[0].payload.energy}</p>
                                <p>Stimulation: {payload[0].payload.stimulation}</p>
                                <p>Type: {payload[0].payload.type}</p>
                                <p>Comfortable: {payload[0].payload.comfortable ? "Yes" : "No"}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      {["positive", "neutral", "negative"].map((type) => (
                        <Scatter
                          key={type}
                          name={type}
                          data={correlationData.filter((d) => d.type === type)}
                          fill={colors[type as keyof typeof colors]}
                        />
                      ))}

                      {/* Quadrant dividing lines */}
                      <ReferenceLine x={5} stroke="#888" strokeDasharray="3 3" />
                      <ReferenceLine y={5} stroke="#888" strokeDasharray="3 3" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                {/* Quadrant distribution */}
                {(() => {
                  // Count entries in each quadrant with experience type
                  const q1Positive = correlationData.filter(
                    (d) => d.energy >= 5 && d.stimulation < 5 && d.type === "positive",
                  ).length
                  const q1Negative = correlationData.filter(
                    (d) => d.energy >= 5 && d.stimulation < 5 && d.type === "negative",
                  ).length
                  const q1Neutral = correlationData.filter(
                    (d) => d.energy >= 5 && d.stimulation < 5 && d.type === "neutral",
                  ).length

                  const q2Positive = correlationData.filter(
                    (d) => d.energy >= 5 && d.stimulation >= 5 && d.type === "positive",
                  ).length
                  const q2Negative = correlationData.filter(
                    (d) => d.energy >= 5 && d.stimulation >= 5 && d.type === "negative",
                  ).length
                  const q2Neutral = correlationData.filter(
                    (d) => d.energy >= 5 && d.stimulation >= 5 && d.type === "neutral",
                  ).length

                  const q3Positive = correlationData.filter(
                    (d) => d.energy < 5 && d.stimulation < 5 && d.type === "positive",
                  ).length
                  const q3Negative = correlationData.filter(
                    (d) => d.energy < 5 && d.stimulation < 5 && d.type === "negative",
                  ).length
                  const q3Neutral = correlationData.filter(
                    (d) => d.energy < 5 && d.stimulation < 5 && d.type === "neutral",
                  ).length

                  const q4Positive = correlationData.filter(
                    (d) => d.energy < 5 && d.stimulation >= 5 && d.type === "positive",
                  ).length
                  const q4Negative = correlationData.filter(
                    (d) => d.energy < 5 && d.stimulation >= 5 && d.type === "negative",
                  ).length
                  const q4Neutral = correlationData.filter(
                    (d) => d.energy < 5 && d.stimulation >= 5 && d.type === "neutral",
                  ).length

                  const q1 = q1Positive + q1Negative + q1Neutral
                  const q2 = q2Positive + q2Negative + q2Neutral
                  const q3 = q3Positive + q3Negative + q3Neutral
                  const q4 = q4Positive + q4Negative + q4Neutral
                  const total = correlationData.length

                  // Calculate percentages
                  const q1Percent = Math.round((q1 / total) * 100)
                  const q2Percent = Math.round((q2 / total) * 100)
                  const q3Percent = Math.round((q3 / total) * 100)
                  const q4Percent = Math.round((q4 / total) * 100)

                  // Calculate positive percentages for each quadrant
                  const q1PositivePercent = q1 > 0 ? Math.round((q1Positive / q1) * 100) : 0
                  const q2PositivePercent = q2 > 0 ? Math.round((q2Positive / q2) * 100) : 0
                  const q3PositivePercent = q3 > 0 ? Math.round((q3Positive / q3) * 100) : 0
                  const q4PositivePercent = q4 > 0 ? Math.round((q4Positive / q4) * 100) : 0

                  // Find dominant quadrant
                  const quadrants = [
                    {
                      name: "High Energy, Low Stimulation",
                      count: q1,
                      percent: q1Percent,
                      positivePercent: q1PositivePercent,
                      color: "bg-mint-500",
                    },
                    {
                      name: "High Energy, High Stimulation",
                      count: q2,
                      percent: q2Percent,
                      positivePercent: q2PositivePercent,
                      color: "bg-lavender-500",
                    },
                    {
                      name: "Low Energy, Low Stimulation",
                      count: q3,
                      percent: q3Percent,
                      positivePercent: q3PositivePercent,
                      color: "bg-sand-500",
                    },
                    {
                      name: "Low Energy, High Stimulation",
                      count: q4,
                      percent: q4Percent,
                      positivePercent: q4PositivePercent,
                      color: "bg-blush-500",
                    },
                  ]

                  const dominantQuadrant = [...quadrants].sort((a, b) => b.count - a.count)[0]

                  return (
                    <>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-mint-500" style={{ width: `${q1Percent}%` }}></div>
                        <div className="h-full bg-lavender-500" style={{ width: `${q2Percent}%` }}></div>
                        <div className="h-full bg-sand-500" style={{ width: `${q3Percent}%` }}></div>
                        <div className="h-full bg-blush-500" style={{ width: `${q4Percent}%` }}></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-mint-500"></div>
                          <span>High Energy, Low Stim: {q1Percent}%</span>
                          <span className="text-xs text-muted-foreground">({q1PositivePercent}% positive)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-lavender-500"></div>
                          <span>High Energy, High Stim: {q2Percent}%</span>
                          <span className="text-xs text-muted-foreground">({q2PositivePercent}% positive)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-sand-500"></div>
                          <span>Low Energy, Low Stim: {q3Percent}%</span>
                          <span className="text-xs text-muted-foreground">({q3PositivePercent}% positive)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blush-500"></div>
                          <span>Low Energy, High Stim: {q4Percent}%</span>
                          <span className="text-xs text-muted-foreground">({q4PositivePercent}% positive)</span>
                        </div>
                      </div>

                      <p className="text-sm pt-2">
                        You spend most of your time in the <span className="font-medium">{dominantQuadrant.name}</span>{" "}
                        quadrant ({dominantQuadrant.percent}% of entries), with {dominantQuadrant.positivePercent}% of
                        those experiences being positive.
                      </p>
                    </>
                  )
                })()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">Add more entries to see quadrant analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
