"use client"

import {
  TimeOfDayChart,
  DayOfWeekChart,
  ExperienceTypeChart,
  BalancedStatesCard,
  RecoveryPatternsCard,
  EnvironmentalFactorsCard,
} from "./patterns"

type TimeOfDayData = {
  time: string
  energy: number
  stimulation: number
  count: number
  positivePercent: number
  comfortableStimPercent: number
}

type DayOfWeekData = {
  day: string
  energy: number
  stimulation: number
  count: number
  positivePercent: number
  comfortableStimPercent: number
}

type BalancedStatesData = {
  count: number
  timeOfDay: string | null
  dayOfWeek: string | null
  activities: Array<{ activity: string; count: number }>
}

type RecoveryPatternsData = {
  count: number
  avgRecoveryTime: number
  activities: Array<{ activity: string; count: number }>
}

type EnvironmentalFactorsData = Array<{
  environment: string
  count: number
  energy: number
  stimulation: number
  positivePercent: number
  neutralPercent: number
  negativePercent: number
}>

type StimulationTypes = Record<string, number>

type PatternsTabProps = {
  timeOfDayData: TimeOfDayData[]
  dayOfWeekData: DayOfWeekData[]
  balancedStatesData: BalancedStatesData
  recoveryPatternsData: RecoveryPatternsData
  environmentalFactorsData: EnvironmentalFactorsData
  stimulationTypes: StimulationTypes
  colors: Record<string, string>
}

export default function PatternsTab({
  timeOfDayData,
  dayOfWeekData,
  balancedStatesData,
  recoveryPatternsData,
  environmentalFactorsData,
  stimulationTypes,
  colors,
}: PatternsTabProps) {
  return (
    <>
      {/* Time and Day Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TimeOfDayChart data={timeOfDayData} colors={colors} />
        <DayOfWeekChart data={dayOfWeekData} colors={colors} />
      </div>

      {/* Experience Distribution and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ExperienceTypeChart stimulationTypes={stimulationTypes} colors={colors} />
        <BalancedStatesCard data={balancedStatesData} />
      </div>

      {/* Recovery and Environmental Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecoveryPatternsCard data={recoveryPatternsData} />
        <EnvironmentalFactorsCard data={environmentalFactorsData} />
      </div>
    </>
  )
} 
