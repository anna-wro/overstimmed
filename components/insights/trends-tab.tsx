"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "@/components/ui/chart"

type ChartDataPoint = {
  date: string
  energy: number
  stimulation: number
  timestamp: string
  type: string
}

type TrendsTabProps = {
  chartData: ChartDataPoint[]
  colors: Record<string, string>
}

export default function TrendsTab({ chartData, colors }: TrendsTabProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
      <CardHeader>
        <CardTitle>Energy & Stimulation Trends</CardTitle>
        <CardDescription>Track how your energy and stimulation levels change over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded p-2 text-xs shadow-sm">
                        <p className="font-medium">{label}</p>
                        <p>Energy: {data.energy}</p>
                        <p>Stimulation: {data.stimulation}</p>
                        <p>Experience: {data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="energy"
                stroke={colors.energy}
                name="Energy Level"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="stimulation"
                stroke={colors.stimulation}
                name="Stimulation Level"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  // Color the dot based on the experience type
                  const fill = colors[payload.type as keyof typeof colors]
                  return <circle cx={cx} cy={cy} r={4} fill={fill} stroke={colors.stimulation} strokeWidth={1} />
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
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
  )
}
