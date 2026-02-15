/** @fileoverview Scatter plot showing energy vs stimulation correlation. */
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
} from "@/components/ui/Chart"

type CorrelationDataPoint = {
  energy: number
  stimulation: number
  type: string
  comfortable: boolean
}

interface EnergyStimulationScatterProps {
  data: CorrelationDataPoint[]
  colors: Record<string, string>
}

export function EnergyStimulationScatter({ data, colors }: EnergyStimulationScatterProps) {
  const generateInsights = () => {
    if (data.length <= 5) {
      return "Add more entries to see patterns in how your energy and stimulation levels relate to each other."
    }

    const insights = []

    // High energy, low stimulation, positive
    if (data.filter((d) => d.energy >= 7 && d.stimulation <= 3 && d.type === "positive").length > 0) {
      insights.push("You often experience high energy with low stimulation as positive - this may be an ideal state for focused work.")
    }

    // Low energy, high stimulation, negative  
    if (data.filter((d) => d.energy <= 3 && d.stimulation >= 7 && d.type === "negative").length > 0) {
      insights.push("You sometimes experience low energy with high stimulation as negative - this may indicate overstimulation that's draining your energy.")
    }

    // High energy, high stimulation, positive
    if (data.filter((d) => d.energy >= 7 && d.stimulation >= 7 && d.type === "positive").length > 0) {
      insights.push("When both energy and stimulation are high and rated positive - these are your 'flow state' moments.")
    }

    // Low energy, low stimulation, negative
    if (data.filter((d) => d.energy <= 3 && d.stimulation <= 3 && d.type === "negative").length > 0) {
      insights.push("Low energy and low stimulation periods rated as negative might indicate you need more rest or a change of environment.")
    }

    return insights.join(" ")
  }

  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
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
                  data={data.filter((d) => d.type === type)}
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
            {generateInsights()}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
} 