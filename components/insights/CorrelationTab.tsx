"use client"

import { EnergyStimulationScatter, QuadrantAnalysis } from "./correlation"

type CorrelationDataPoint = {
  energy: number
  stimulation: number
  type: string
  comfortable: boolean
}

type CorrelationTabProps = {
  correlationData: CorrelationDataPoint[]
  colors: Record<string, string>
}

export default function CorrelationTab({ correlationData, colors }: CorrelationTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <EnergyStimulationScatter data={correlationData} colors={colors} />
      <QuadrantAnalysis data={correlationData} colors={colors} />
    </div>
  )
}
