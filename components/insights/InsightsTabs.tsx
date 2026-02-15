/** @fileoverview Tab container for all insights analysis views. */
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Lightbulb, 
  LayoutDashboard 
} from "lucide-react"
import TrendsTab from "@/components/insights/TrendsTab"
import PatternsTab from "@/components/insights/PatternsTab"
import TriggersTab from "@/components/insights/TriggersTab"
import CorrelationTab from "@/components/insights/CorrelationTab"
import SummaryTab from "@/components/insights/SummaryTab"
import CalendarTab from "@/components/insights/CalendarTab"
import RecommendationsTab from "@/components/insights/RecommendationsTab"
import { insightsPageCopy } from "@/copy/insights"

// Define the color constants
const COLORS = {
  energy: "#57b185",
  stimulation: "#8b5cf6",
  positive: "#57b185",
  neutral: "#b08c6c",
  negative: "#d27f97",
  comfortable: "#57b185",
  uncomfortable: "#d27f97",
}

interface InsightsTabsProps {
  filteredEntries: any[]
  avgEnergyLevel: number
  avgStimulationLevel: number
  stimulationTypes: Record<string, number>
  balancedStatesData: any
  patterns: any[]
  chartData: any[]
  timeOfDayData: any[]
  dayOfWeekData: any[]
  recoveryPatternsData: any
  environmentalFactorsData: any[]
  topTriggers: any[]
  correlationData: any[]
}

export function InsightsTabs({
  filteredEntries,
  avgEnergyLevel,
  avgStimulationLevel,
  stimulationTypes,
  balancedStatesData,
  patterns,
  chartData,
  timeOfDayData,
  dayOfWeekData,
  recoveryPatternsData,
  environmentalFactorsData,
  topTriggers,
  correlationData,
}: InsightsTabsProps) {
  const [selectedTab, setSelectedTab] = useState("summary")

  return (
    <Tabs defaultValue="summary" value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="mb-6 flex flex-wrap">
        <TabsTrigger value="summary">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.summary}
        </TabsTrigger>
        <TabsTrigger value="trends">
          <TrendingUp className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.trends}
        </TabsTrigger>
        <TabsTrigger value="patterns">
          <Clock className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.patterns}
        </TabsTrigger>
        <TabsTrigger value="triggers">
          <BarChart3 className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.triggers}
        </TabsTrigger>
        <TabsTrigger value="correlation">
          <PieChart className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.correlation}
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <Calendar className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.calendar}
        </TabsTrigger>
        <TabsTrigger value="recommendations">
          <Lightbulb className="mr-2 h-4 w-4" />
          {insightsPageCopy.tabs.recommendations}
        </TabsTrigger>
      </TabsList>

      {/* Summary Tab */}
      <TabsContent value="summary">
        <SummaryTab
          filteredEntries={filteredEntries}
          avgEnergyLevel={avgEnergyLevel}
          avgStimulationLevel={avgStimulationLevel}
          stimulationTypes={stimulationTypes}
          balancedStatesData={balancedStatesData}
          patterns={patterns}
        />
      </TabsContent>

      {/* Trends Tab */}
      <TabsContent value="trends">
        <TrendsTab chartData={chartData} colors={COLORS} />
      </TabsContent>

      {/* Patterns Tab */}
      <TabsContent value="patterns">
        <PatternsTab
          timeOfDayData={timeOfDayData}
          dayOfWeekData={dayOfWeekData}
          balancedStatesData={balancedStatesData}
          recoveryPatternsData={recoveryPatternsData}
          environmentalFactorsData={environmentalFactorsData}
          stimulationTypes={stimulationTypes}
          colors={COLORS}
        />
      </TabsContent>

      {/* Triggers Tab */}
      <TabsContent value="triggers">
        <TriggersTab topTriggers={topTriggers} filteredEntries={filteredEntries} colors={COLORS} />
      </TabsContent>

      {/* Correlation Tab */}
      <TabsContent value="correlation">
        <CorrelationTab correlationData={correlationData} colors={COLORS} />
      </TabsContent>

      {/* Calendar Tab */}
      <TabsContent value="calendar">
        <CalendarTab filteredEntries={filteredEntries} />
      </TabsContent>

      {/* Recommendations Tab */}
      <TabsContent value="recommendations">
        <RecommendationsTab
          filteredEntries={filteredEntries}
          balancedStatesData={balancedStatesData}
          recoveryPatternsData={recoveryPatternsData}
          environmentalFactorsData={environmentalFactorsData}
        />
      </TabsContent>
    </Tabs>
  )
} 