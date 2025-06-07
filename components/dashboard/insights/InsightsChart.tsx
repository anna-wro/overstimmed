import { LineChart } from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '@/components/ui/Chart'
import { dashboardCopy } from '@/copy/dashboard'

type ChartDataPoint = {
  date: string
  energy: number
  stimulation: number
}

type InsightsChartProps = {
  recentEntries: ChartDataPoint[]
}

export const InsightsChart = ({ recentEntries }: InsightsChartProps) => {
  if (recentEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <LineChart className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{dashboardCopy.emptyStates.noChart}</p>
      </div>
    )
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={recentEntries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis domain={[0, 10]} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#57b185"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name={dashboardCopy.insights.chartLegend.energy}
          />
          <Line
            type="monotone"
            dataKey="stimulation"
            stroke="#8b5cf6"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name={dashboardCopy.insights.chartLegend.stimulation}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
} 