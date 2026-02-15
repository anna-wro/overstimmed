import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "@/components/ui/Chart"

type StimulationTypes = Record<string, number>

interface ExperienceTypeChartProps {
  stimulationTypes: StimulationTypes
  colors: Record<string, string>
}

export function ExperienceTypeChart({ stimulationTypes, colors }: ExperienceTypeChartProps) {
  const data = [
    { name: "Positive", value: stimulationTypes.positive || 0 },
    { name: "Neutral", value: stimulationTypes.neutral || 0 },
    { name: "Negative", value: stimulationTypes.negative || 0 },
  ]

  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle>Experience Type Distribution</CardTitle>
        <CardDescription>Breakdown of your positive, neutral, and negative experiences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
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
  )
} 