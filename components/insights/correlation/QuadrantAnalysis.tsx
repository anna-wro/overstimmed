import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
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

interface QuadrantAnalysisProps {
  data: CorrelationDataPoint[]
  colors: Record<string, string>
}

// Helper function to calculate quadrant statistics
const calculateQuadrantStats = (data: CorrelationDataPoint[]) => {
  const quadrants = {
    q1: { positive: 0, neutral: 0, negative: 0, total: 0 }, // High Energy, Low Stimulation
    q2: { positive: 0, neutral: 0, negative: 0, total: 0 }, // High Energy, High Stimulation  
    q3: { positive: 0, neutral: 0, negative: 0, total: 0 }, // Low Energy, Low Stimulation
    q4: { positive: 0, neutral: 0, negative: 0, total: 0 }, // Low Energy, High Stimulation
  }

  data.forEach((point) => {
    let quadrant: keyof typeof quadrants
    
    if (point.energy >= 5 && point.stimulation < 5) quadrant = 'q1'
    else if (point.energy >= 5 && point.stimulation >= 5) quadrant = 'q2'
    else if (point.energy < 5 && point.stimulation < 5) quadrant = 'q3'
    else quadrant = 'q4'

    quadrants[quadrant][point.type as keyof typeof quadrants.q1]++
    quadrants[quadrant].total++
  })

  const total = data.length
  
  return {
    quadrants: [
      {
        name: "High Energy, Low Stimulation",
        ...quadrants.q1,
        percent: Math.round((quadrants.q1.total / total) * 100),
        positivePercent: quadrants.q1.total > 0 ? Math.round((quadrants.q1.positive / quadrants.q1.total) * 100) : 0,
        color: "bg-mint-500",
      },
      {
        name: "High Energy, High Stimulation", 
        ...quadrants.q2,
        percent: Math.round((quadrants.q2.total / total) * 100),
        positivePercent: quadrants.q2.total > 0 ? Math.round((quadrants.q2.positive / quadrants.q2.total) * 100) : 0,
        color: "bg-lavender-500",
      },
      {
        name: "Low Energy, Low Stimulation",
        ...quadrants.q3, 
        percent: Math.round((quadrants.q3.total / total) * 100),
        positivePercent: quadrants.q3.total > 0 ? Math.round((quadrants.q3.positive / quadrants.q3.total) * 100) : 0,
        color: "bg-sand-500",
      },
      {
        name: "Low Energy, High Stimulation",
        ...quadrants.q4,
        percent: Math.round((quadrants.q4.total / total) * 100), 
        positivePercent: quadrants.q4.total > 0 ? Math.round((quadrants.q4.positive / quadrants.q4.total) * 100) : 0,
        color: "bg-blush-500",
      },
    ],
    total,
  }
}

export function QuadrantAnalysis({ data, colors }: QuadrantAnalysisProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
        <CardHeader>
          <CardTitle>Quadrant Analysis</CardTitle>
          <CardDescription>Understanding your energy-stimulation patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">Add more entries to see quadrant analysis.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = calculateQuadrantStats(data)
  const dominantQuadrant = [...stats.quadrants].sort((a, b) => b.total - a.total)[0]

  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
      <CardHeader>
        <CardTitle>Quadrant Analysis</CardTitle>
        <CardDescription>Understanding your energy-stimulation patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quadrant Visualization */}
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
              {[
                "High Energy\nLow Stimulation",
                "High Energy\nHigh Stimulation", 
                "Low Energy\nLow Stimulation",
                "Low Energy\nHigh Stimulation"
              ].map((label, index) => (
                <div key={index} className="flex items-center justify-center p-2">
                  <div className="text-xs font-medium text-center text-opacity-80">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Scatter plot overlay */}
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
                      data={data.filter((d) => d.type === type)}
                      fill={colors[type as keyof typeof colors]}
                    />
                  ))}
                  <ReferenceLine x={5} stroke="#888" strokeDasharray="3 3" />
                  <ReferenceLine y={5} stroke="#888" strokeDasharray="3 3" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quadrant Statistics */}
          <div className="space-y-3">
            {/* Distribution Bar */}
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
              {stats.quadrants.map((q, index) => (
                <div 
                  key={index}
                  className={`h-full ${q.color}`} 
                  style={{ width: `${q.percent}%` }}
                ></div>
              ))}
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {stats.quadrants.map((quadrant, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${quadrant.color}`}></div>
                  <span>{quadrant.name.split(',')[0]}, {quadrant.name.split(',')[1]}: {quadrant.percent}%</span>
                  <span className="text-xs text-muted-foreground">({quadrant.positivePercent}% positive)</span>
                </div>
              ))}
            </div>

            {/* Summary Insight */}
            <p className="text-sm pt-2">
              You spend most of your time in the <span className="font-medium">{dominantQuadrant.name}</span>{" "}
              quadrant ({dominantQuadrant.percent}% of entries), with {dominantQuadrant.positivePercent}% of
              those experiences being positive.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 