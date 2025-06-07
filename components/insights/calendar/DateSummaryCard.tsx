import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Battery, Zap, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface DateSummaryCardProps {
  selectedDate: Date
  entries: any[]
}

// Helper functions
const getExperienceTypeText = (type: string) => {
  if (type === "positive") return "Positive/Energizing"
  if (type === "neutral") return "Neutral/Balanced"
  return "Negative/Draining"
}

const getExperienceTypeColor = (type: string) => {
  if (type === "positive") return "text-mint-600 dark:text-mint-400"
  if (type === "neutral") return "text-sand-600 dark:text-sand-400"
  return "text-blush-600 dark:text-blush-400"
}

export default function DateSummaryCard({ selectedDate, entries }: DateSummaryCardProps) {
  // Calculate averages
  const avgEnergyLevel = entries.length > 0
    ? Math.round((entries.reduce((sum, entry) => sum + entry.energyLevel, 0) / entries.length) * 10) / 10
    : 0

  const avgStimulationLevel = entries.length > 0
    ? Math.round((entries.reduce((sum, entry) => sum + entry.stimulationLevel, 0) / entries.length) * 10) / 10
    : 0

  // Count experience types
  const experienceTypes = entries.reduce((acc, entry) => {
    acc[entry.stimulationType] = (acc[entry.stimulationType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get most common experience type
  const sortedTypes = Object.entries(experienceTypes).sort((a, b) => (b[1] as number) - (a[1] as number))
  const mostCommonExperienceType = sortedTypes.length > 0 ? sortedTypes[0][0] : "neutral"

  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
      <CardHeader>
        <CardTitle>{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
        <CardDescription>
          {entries.length} {entries.length === 1 ? "entry" : "entries"} on this date
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-lavender-50/50 dark:bg-lavender-900/20">
            <Battery className="h-6 w-6 text-sand-500 mb-2" />
            <div className="text-2xl font-bold">{avgEnergyLevel}</div>
            <div className="text-sm text-muted-foreground">Avg. Energy</div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-lavender-50/50 dark:bg-lavender-900/20">
            <Zap className="h-6 w-6 text-lavender-500 mb-2" />
            <div className="text-2xl font-bold">{avgStimulationLevel}</div>
            <div className="text-sm text-muted-foreground">Avg. Stimulation</div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-lavender-50/50 dark:bg-lavender-900/20">
            <AlertCircle className="h-6 w-6 text-blush-500 mb-2" />
            <div className={`text-lg font-bold ${getExperienceTypeColor(mostCommonExperienceType)}`}>
              {getExperienceTypeText(mostCommonExperienceType)}
            </div>
            <div className="text-sm text-muted-foreground">Most Common</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 