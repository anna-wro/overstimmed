import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "@/components/ui/Chart"

type TimeOfDayData = {
  time: string
  energy: number
  stimulation: number
  count: number
  positivePercent: number
  comfortableStimPercent: number
}

interface TimeOfDayChartProps {
  data: TimeOfDayData[]
  colors: Record<string, string>
}

export function TimeOfDayChart({ data, colors }: TimeOfDayChartProps) {
  const highestEnergyTime = data.find((d) => d.energy === Math.max(...data.map((d) => d.energy)))?.time
  const mostComfortableTime = data.find(
    (d) => d.comfortableStimPercent === Math.max(...data.map((d) => d.comfortableStimPercent))
  )?.time

  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle>Time of Day Analysis</CardTitle>
        <CardDescription>How your energy and stimulation vary throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded p-2 text-xs shadow-xs">
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
                Your {highestEnergyTime} tends to have your highest energy levels. Your stimulation is most 
                comfortable during the {mostComfortableTime}.
              </>
            ) : (
              "Add more entries to see patterns throughout the day."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 