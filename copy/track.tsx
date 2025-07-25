export const trackingPageCopy = {
  lowSpoonMode: {
    label: {
      enabled: "Low-Spoon Mode",
      disabled: "Feeling overwhelmed?"
    },
    description: {
      enabled: "Tracking just the essentials",
      disabled: "You can just track the essentials instead"
    },
    infoMessage: "You're in low-spoon mode - tracking just the basics today. That's perfectly okay! Toggle above anytime to access more options when you're ready.",
    helpText: "Choose the tracking experience that feels right for you today"
  },
  experienceRating: {
    label: "How would you describe your overall experience right now?",
    positive: "Positive/Energizing",
    neutral: "Neutral/Balanced",
    negative: "Negative/Draining",
  },
  energy: {
    label: "Energy Level",
    descriptions: [
      "No energy - completely exhausted, unable to perform basic tasks",
      "Very low energy - severely drained, basic tasks require significant effort",
      "Low energy - noticeably tired, difficult to focus or be productive",
      "Below average energy - somewhat tired, can function but not at full capacity",
      "Slightly low energy - a bit tired, but can handle most tasks",
      "Moderate energy - balanced state, neither energized nor tired",
      "Slightly high energy - somewhat energized, good productivity",
      "Above average energy - noticeably energized, very productive",
      "High energy - very energized, highly motivated and focused",
      "Very high energy - extremely energized, may feel slightly restless",
      "Maximum energy - intensely energized, may feel hyperactive or restless",
    ],
  },
  stimulation: {
    label: "Stimulation Level",
    descriptions: [
      "No stimulation - complete sensory deprivation, may feel disconnected",
      "Very low stimulation - minimal sensory input, may feel bored or isolated",
      "Low stimulation - quiet environment, may feel understimulated",
      "Below average stimulation - calm environment, may seek more input",
      "Slightly low stimulation - comfortable but quiet, good for focus",
      "Moderate stimulation - balanced sensory input, typically comfortable",
      "Slightly high stimulation - noticeable sensory input, may start feeling intense",
      "Above average stimulation - significant sensory input, approaching threshold",
      "High stimulation - intense sensory input, may be overwhelming",
      "Very high stimulation - very intense input, likely overwhelming",
      "Maximum stimulation - extreme sensory overload, overwhelming",
    ],
  },
  trigger: {
    label: "What triggers or sensory inputs are you experiencing?",
    placeholder: "Search or add tags...",
    placeholderMore: "Search or add more tags...",
    showSuggestions: "Show suggestions",
    hideSuggestions: "Hide suggestions",
    removeTag: "Remove {tag}",
    tabHint: "(Tab)",
    enterHint: "(Enter)",
    noMatch: "No matching triggers found",
    addCustom: 'Add "{tag}" as custom tag',
    typeToSearch: "Type to search or filter by category",
    helpText: "Press Enter to add a tag. Use ↑ and ↓ arrow keys to navigate suggestions.",
  },
  activity: {
    label: "What are you doing right now?",
    placeholder: "Current or recent activities",
  },
  notes: {
    label: "Additional notes (optional)",
    placeholder: "Any other thoughts, feelings, or observations",
  },
  cardTitle: "How are you feeling?",
  saveButton: "Save Entry",
  dialogs: {
    unsavedChanges: {
      title: "Wait a moment!",
      description: "You've made changes to your tracking entry that haven't been saved yet.",
      warningTitle: "Your tracking information will be lost",
      warningDescription: "If you leave without saving, all the information you've entered will be lost.",
      keepEditing: "Keep Editing",
      discardEntry: "Discard Entry",
      saveEntry: "Save Entry",
    },
    entrySaved: {
      title: "Entry saved",
      description: "Your tracking entry has been saved successfully.",
    },
    newTagCreated: {
      title: "New tag created",
      description: (tag: string) => `"${tag}" has been added to your custom tags.`,
    },
  },
  feeling: {
    label: "How are you feeling emotionally?",
    placeholder: "Search or add feelings...",
    placeholderMore: "Add more feelings...",
    showSuggestions: "Show feeling suggestions",
    hideSuggestions: "Hide feeling suggestions",
    removeTag: "Remove {tag}",
    tabHint: "(Tab)",
    enterHint: "(Enter)",
    noMatch: "No matching feelings found",
    addCustom: 'Add "{tag}" as custom feeling',
    typeToSearch: "Type to search or filter by feeling category",
    helpText: "Press Enter to add a feeling. Use ↑ and ↓ arrow keys to navigate suggestions.",
  },
}; 