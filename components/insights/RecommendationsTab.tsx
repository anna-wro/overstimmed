"use client"

/** @fileoverview Recommendations tab with personalized suggestions based on tracking data. */
import { Battery, Zap, Clock } from "lucide-react"
import { generateRecommendations } from "@/utils/recommendations"
import { RecommendationCard } from "./recommendations"

type RecommendationsTabProps = {
  filteredEntries: any[]
  balancedStatesData: any
  recoveryPatternsData: any
  environmentalFactorsData: any[]
}

export default function RecommendationsTab({
  filteredEntries,
  balancedStatesData,
  recoveryPatternsData,
  environmentalFactorsData,
}: RecommendationsTabProps) {
  const { energyRecommendations, stimulationRecommendations, routineRecommendations } = generateRecommendations({
    filteredEntries,
    balancedStatesData,
    recoveryPatternsData,
    environmentalFactorsData,
  })

  return (
    <div className="space-y-6">
      <RecommendationCard
        title="Energy Management"
        description="Recommendations for managing your energy levels"
        icon={<Battery className="h-5 w-5 text-sand-500" />}
        recommendations={energyRecommendations}
        emptyMessage="Continue tracking to receive personalized energy management recommendations."
      />

      <RecommendationCard
        title="Stimulation Management"
        description="Strategies for managing sensory input and stimulation"
        icon={<Zap className="h-5 w-5 text-lavender-500" />}
        recommendations={stimulationRecommendations}
        emptyMessage="Continue tracking to receive personalized stimulation management recommendations."
      />

      <RecommendationCard
        title="Routine Optimization"
        description="Suggestions for optimizing your daily and weekly routines"
        icon={<Clock className="h-5 w-5 text-mint-500" />}
        recommendations={routineRecommendations}
        emptyMessage="Continue tracking to receive personalized routine optimization recommendations."
      />
    </div>
  )
}
