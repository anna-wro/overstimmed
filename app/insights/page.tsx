"use client"

import { useInsightsData } from "@/hooks/features/insights/useInsightsData"
import { useInsightsCalculations } from "@/hooks/features/insights/useInsightsCalculations"
import { usePatternDetection } from "@/hooks/features/insights/usePatternDetection"
import { useInsightsExport } from "@/hooks/features/insights/useInsightsExport"
import {
  InsightsHeader,
  SummaryCards,
  PatternDetectionCard,
  InsightsEmptyState,
  InsightsTabs,
} from "@/components/insights"

export default function InsightsPage() {
  // Custom hooks
  const { filteredEntries, timeRange, setTimeRange } = useInsightsData()
  const { exportCSV } = useInsightsExport()
  const { patterns } = usePatternDetection(filteredEntries)

  const {
    avgEnergyLevel,
    avgStimulationLevel,
    stimulationTypes,
    chartData,
    topTriggers,
    timeOfDayData,
    dayOfWeekData,
    correlationData,
    balancedStatesData,
    recoveryPatternsData,
    environmentalFactorsData,
  } = useInsightsCalculations(filteredEntries)

  // Calculate comfortable/uncomfortable percentages
  const comfortablePercent = correlationData.length > 0
    ? Math.round((correlationData.filter((d) => d.comfortable).length / correlationData.length) * 100)
    : 0
  const uncomfortablePercent = 100 - comfortablePercent

  const handleExport = () => exportCSV(filteredEntries)

  return (
    <div className="min-h-screen bg-linear-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        <InsightsHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onExport={handleExport}
          hasData={filteredEntries.length > 0}
        />

        {filteredEntries.length === 0 ? (
          <InsightsEmptyState />
        ) : (
          <>
            <SummaryCards
              entriesCount={filteredEntries.length}
              timeRange={timeRange}
              avgEnergyLevel={avgEnergyLevel}
              avgStimulationLevel={avgStimulationLevel}
              comfortablePercent={comfortablePercent}
              uncomfortablePercent={uncomfortablePercent}
            />

            <PatternDetectionCard patterns={patterns} />

            <InsightsTabs
              filteredEntries={filteredEntries}
              avgEnergyLevel={avgEnergyLevel}
              avgStimulationLevel={avgStimulationLevel}
              stimulationTypes={stimulationTypes}
              balancedStatesData={balancedStatesData}
              patterns={patterns}
              chartData={chartData}
              timeOfDayData={timeOfDayData}
              dayOfWeekData={dayOfWeekData}
              recoveryPatternsData={recoveryPatternsData}
              environmentalFactorsData={environmentalFactorsData}
              topTriggers={topTriggers}
              correlationData={correlationData}
            />
          </>
        )}
      </div>
    </div>
  )
}
