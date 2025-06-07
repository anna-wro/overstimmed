"use client"

import { RecentStatusCard, ExperienceBreakdownCard, KeyInsightsCard } from "./summary"

type SummaryTabProps = {
  filteredEntries: any[]
  avgEnergyLevel: number
  avgStimulationLevel: number
  stimulationTypes: Record<string, number>
  balancedStatesData: any
  patterns: any[]
}

export default function SummaryTab({
  filteredEntries,
  avgEnergyLevel,
  avgStimulationLevel,
  stimulationTypes,
  balancedStatesData,
  patterns,
}: SummaryTabProps) {
  // Calculate percentages for stimulation types
  const totalEntries = filteredEntries.length
  const positivePercent = Math.round(((stimulationTypes.positive || 0) / totalEntries) * 100) || 0
  const neutralPercent = Math.round(((stimulationTypes.neutral || 0) / totalEntries) * 100) || 0
  const negativePercent = Math.round(((stimulationTypes.negative || 0) / totalEntries) * 100) || 0

  // Get most recent entry
  const mostRecentEntry =
    filteredEntries.length > 0
      ? filteredEntries.reduce((latest, entry) => {
          return new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest
        }, filteredEntries[0])
      : null

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentStatusCard mostRecentEntry={mostRecentEntry} />
        <ExperienceBreakdownCard 
          positivePercent={positivePercent}
          neutralPercent={neutralPercent}
          negativePercent={negativePercent}
        />
      </div>

      {/* Key Insights */}
      <KeyInsightsCard 
        patterns={patterns}
        balancedStatesData={balancedStatesData}
      />
    </div>
  )
}
