import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Calendar, Download } from "lucide-react"
import { insightsPageCopy } from "@/copy/insights"

interface InsightsHeaderProps {
  timeRange: string
  onTimeRangeChange: (value: string) => void
  onExport: () => void
  hasData: boolean
}

export function InsightsHeader({ timeRange, onTimeRangeChange, onExport, hasData }: InsightsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold">{insightsPageCopy.pageTitle}</h1>
        <p className="text-muted-foreground">{insightsPageCopy.pageDescription}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={insightsPageCopy.timeRange.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{insightsPageCopy.timeRange.options.week}</SelectItem>
              <SelectItem value="14">{insightsPageCopy.timeRange.options.twoWeeks}</SelectItem>
              <SelectItem value="30">{insightsPageCopy.timeRange.options.month}</SelectItem>
              <SelectItem value="90">{insightsPageCopy.timeRange.options.quarter}</SelectItem>
              <SelectItem value="365">{insightsPageCopy.timeRange.options.year}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={!hasData}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{insightsPageCopy.export.buttonText}</span>
        </Button>
      </div>
    </div>
  )
} 