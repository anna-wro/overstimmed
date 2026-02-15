/** @fileoverview UI copy strings for the dashboard page. */
export const dashboardCopy = {
  // Main header
  header: {
    title: "Overstimmed",
    subtitle: "Track your energy levels and manage overstimulation",
    trackNowButton: "Track Now",
  },

  // Quick tracking section
  quickTracking: {
    ariaLabel: "Track now",
  },

  // Latest entry section
  latestEntry: {
    title: "Latest Entry",
    howYouFelt: "How You Felt",
    details: "Details",
    noAdditionalDetails: "No additional details provided",
    viewAllEntries: "View All Entries",
    
    // Experience type labels
    experienceTypes: {
      positive: "Positive",
      neutral: "Neutral", 
      negative: "Negative",
      positiveDescription: "Positive/Energizing",
      neutralDescription: "Neutral/Balanced",
      negativeDescription: "Negative/Draining",
    },

    // Energy levels
    energy: {
      label: "Energy Level",
      noEnergy: "No Energy",
      lowEnergy: "Low Energy", 
      moderateEnergy: "Moderate Energy",
      highEnergy: "High Energy",
      descriptions: {
        0: "You may feel completely exhausted",
        low: "You may feel tired or drained",
        moderate: "You feel balanced and steady",
        high: "You may feel very active or restless",
      },
    },

    // Stimulation levels
    stimulation: {
      label: "Stimulation Level",
      noStimulation: "No Stimulation",
      understimulated: "Understimulated",
      comfortable: "Comfortable", 
      overstimulated: "Overstimulated",
      descriptions: {
        0: "You may feel completely unstimulated",
        low: "You may feel bored or seeking input",
        moderate: "You feel comfortable with sensory input",
        high: "You may feel overwhelmed or need to reduce input",
      },
    },

    // Detail sections
    detailSections: {
      triggers: "Triggers",
      activities: "Activities", 
      notes: "Notes",
    },
  },

  // Supportive messages based on energy/stimulation combinations
  supportiveMessages: {
    overwhelmed: "You might be feeling overwhelmed right now. It's okay to step back and take a break.",
    depleted: "Your batteries seem low. Remember that rest is productive too.",
    managingLowEnergy: "You're managing input despite low energy. That takes strength.",
    needsQuietTime: "You might need some quiet time to process all this stimulation.",
    balanced: "You seem to be in a balanced state. This is a good time to engage in activities you enjoy.",
    seekingEngagement: "You might benefit from some engaging activities to match your energy level.",
    highIntensity: "You're experiencing high intensity. Remember to channel this energy constructively.",
    productive: "This could be a great time for focused work or creative activities.",
    restless: "You have energy that's looking for an outlet. What would feel good to do right now?",
    default: "Your experience is valid, whatever you're feeling right now.",
  },

  // Empty states
  emptyStates: {
    noEntries: {
      title: "No entries yet",
      description: "Start tracking your energy and stimulation levels to see your data here",
      buttonText: "Create Your First Entry",
    },
    noChart: "Add more entries to see your trends over time",
  },

  // Insights section
  insights: {
    title: "Your Insights",
    viewAllInsights: "View All Insights",
    chartTitle: "Energy & Stimulation Trends",
    
    // Stats labels
    stats: {
      totalEntries: "Total Entries",
      avgEnergy: "Avg. Energy",
      avgStimulation: "Avg. Stimulation",
    },

    // Chart legend
    chartLegend: {
      energy: "Energy",
      stimulation: "Stimulation",
    },

    // Quick insights
    quickInsights: {
      title: "Quick Insights",
      timeOfDay: {
        title: "Time of Day",
        description: (timeOfDay: string) => `Your energy tends to be highest during the ${timeOfDay}.`,
        fallback: "Track more entries to see patterns by time of day.",
      },
      commonTriggers: {
        title: "Common Triggers", 
        description: (triggers: string[]) => `Your most common triggers are: ${triggers.join(", ")}.`,
        fallback: "Add triggers when tracking to see patterns.",
      },
    },

    viewDetailedInsights: "View Detailed Insights",
    
    // Dynamic insight messages
    timeOfDayInsight: (timeOfDay: string) => `Your energy tends to be highest during the ${timeOfDay}.`,
    timeOfDayFallback: "Track more entries to see patterns by time of day.",
    commonTriggersInsight: (triggers: string[]) => `Your most common triggers are: ${triggers.join(", ")}.`,
    commonTriggersFallback: "Add triggers when tracking to see patterns.",
  },

  // Navigation cards
  navigationCards: {
    track: {
      title: "Track Now",
      description: "Log your current energy level and stimulation state",
      buttonText: "Start Tracking",
    },
    archive: {
      title: "Archive",
      description: "View and analyze your past tracking entries", 
      buttonText: "View Archive",
    },
    settings: {
      title: "Settings",
      description: "Customize your experience and manage your data",
      buttonText: "Open Settings",
    },
  },

  // Time periods for grouping
  timePeriods: {
    morning: "morning",
    afternoon: "afternoon", 
    evening: "evening",
    night: "night",
  },
} as const 