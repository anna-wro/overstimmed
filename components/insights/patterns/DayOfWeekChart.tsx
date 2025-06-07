import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "@/components/ui/Chart"

type DayOfWeekData = {
  day: string
  energy: number
  stimulation: number
  count: number
  positivePercent: number
  comfortableStimPercent: number
}

interface DayOfWeekChartProps {
  data: DayOfWeekData[]
  colors: Record<string, string>
}

export function DayOfWeekChart({ data, colors }: DayOfWeekChartProps) {
  const highestEnergyDay = data.find(
    (d) => d.energy === Math.max(...data.filter((d) => d.count > 0).map((d) => d.energy))
  )?.day

  const mostComfortableDay = data.find(
    (d) =>
      d.comfortableStimPercent ===
      Math.max(...data.filter((d) => d.count > 0).map((d) => d.comfortableStimPercent))
  )?.day

  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
      <CardHeader>
        <CardTitle>Day of Week Analysis</CardTitle>
        <CardDescription>How your energy and stimulation vary by day of week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
            {data.some((d) => d.count > 0) ? (
              <>
                Your energy tends to be highest on {highestEnergyDay}s. Your most comfortable days are{" "}
                {mostComfortableDay}s.
              </>
            ) : (
              "Add more entries to see weekly patterns."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 