export const insightsPageCopy = {
  pageTitle: "Insights & Patterns",
  pageDescription: "Analyze your energy and stimulation data to identify patterns",
  
  timeRange: {
    label: "Select time range",
    options: {
      week: "Last 7 days",
      twoWeeks: "Last 14 days", 
      month: "Last 30 days",
      quarter: "Last 3 months",
      year: "Last year",
    },
  },

  export: {
    buttonText: "Export",
  },

  emptyState: {
    title: "No data available",
    description: "Start tracking your energy and stimulation levels to see insights here.",
    buttonText: "Start Tracking Now",
  },

  summaryCards: {
    entryCount: {
      title: "Entry Count",
      description: "Your tracking data",
      totalEntries: "Total entries",
      entriesThisWeek: "Entries this week",
      helpText: "Each entry helps you understand your patterns better",
    },
    energyLevel: {
      title: "Energy Level",
      average: "Average:",
      low: "Low",
      medium: "Medium", 
      high: "High",
    },
    stimulationLevel: {
      title: "Stimulation Level",
      average: "Average:",
      under: "Under",
      balanced: "Balanced",
      over: "Over",
      experienceLabel: "Stimulation Experience:",
      comfortable: "Comfortable",
      uncomfortable: "Uncomfortable",
    },
  },

  detectedPatterns: {
    title: "Detected Patterns",
    description: "Insights based on your tracking data",
  },

  tabs: {
    summary: "Summary",
    trends: "Trends", 
    patterns: "Patterns",
    triggers: "Triggers",
    correlation: "Correlation",
    calendar: "Calendar",
    recommendations: "Recommendations",
  },

  patternTypes: {
    highStimulationNegative: "You tend to experience overwhelming stimulation with:",
    highStimulationPositive: "You enjoy high stimulation with:",
    lowEnergy: "You often experience low energy during the",
    positiveExperience: "These activities often give you positive experiences:",
  },

  csvExport: {
    headers: [
      "Date",
      "Time", 
      "Energy Level",
      "Stimulation Level",
      "Experience Type",
      "Triggers",
      "Activities", 
      "Notes",
    ],
    filename: "overstimmed-data",
  },
}; 