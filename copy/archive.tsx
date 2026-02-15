/** @fileoverview UI copy strings for the archive page. */
export const archivePageCopy = {
  pageTitle: "Overstimmed",
  navigation: {
    backToDashboard: "Back to Dashboard",
  },
  header: {
    title: "Entry Archive",
    description: "View and analyze your past tracking entries",
  },
  filters: {
    timeRange: {
      label: "Select time range",
      options: {
        all: "All time",
        week: "Last 7 days",
        month: "Last 30 days",
        quarter: "Last 3 months",
      },
    },
    sort: {
      label: "Sort by",
      options: {
        newest: "Newest first",
        oldest: "Oldest first",
      },
    },
    search: {
      placeholder: "Search entries by triggers, activities, or notes...",
    },
  },
  viewModes: {
    compact: "Compact View",
    detailed: "Detailed View",
  },
  entryCard: {
    energy: "Energy:",
    stimulation: "Stimulation:",
    deleteConfirm: "Are you sure you want to delete this entry?",
    deleteButton: "Delete entry",
  },
  experienceTypes: {
    positive: "Positive",
    neutral: "Neutral/Balanced",
    negative: "Negative",
  },
  detailedView: {
    energyLevel: "Energy Level",
    stimulationLevel: "Stimulation Level",
    overallExperience: "Overall Experience:",
    triggers: "Triggers",
    activities: "Activities",
    notes: "Notes",
    noDetails: "No additional details provided",
  },
  emptyState: {
    title: "No entries found",
    description: {
      noEntries: "Start tracking your energy and stimulation levels to see your data here",
      noResults: "Try changing your filters to see more entries",
    },
    createButton: "Create Your First Entry",
  },
  summary: {
    showing: "Showing",
    entry: "entry",
    entries: "entries",
  },
  toasts: {
    entryDeleted: {
      title: "Entry deleted",
      description: "The tracking entry has been removed.",
    },
  },
}; 