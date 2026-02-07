export const settingsPageCopy = {
  pageTitle: "Settings",
  pageDescription: "Customize your experience and manage your data",
  saveButton: "Save",
  savingButton: "Saving…",

  importError: {
    title: "Import Error",
  },

  appearance: {
    title: "Appearance",
    description: "Customize how the application looks",
    displayName: {
      label: "Display name",
      placeholder: "Your name",
    },
    theme: {
      label: "Theme",
      placeholder: "Select theme",
      options: {
        light: "Light",
        dark: "Dark",
        system: "System",
      },
    },
    highContrast: {
      label: "High Contrast Mode",
      description: "Increase contrast for better visibility",
    },
    fontSize: {
      label: "Font Size",
      small: "Small",
      medium: "Medium",
      large: "Large",
    },
  },

  reminders: {
    title: "Reminders",
    description: "Configure when and how you receive reminders",
    enable: {
      label: "Enable Reminders",
      description: "Get notifications to track your energy and stimulation levels",
    },
    frequency: {
      label: "Reminder Frequency",
      placeholder: "Select frequency",
      options: {
        hourly: "Hourly",
        daily: "Daily",
        weekly: "Weekly",
      },
    },
  },

  accessibility: {
    title: "Accessibility",
    description: "Simplify your tracking experience",
    lowSpoonMode: {
      label: "Low-Spoon Mode",
      description: "Simplify tracking to just energy, stimulation, and overall experience",
    },
  },

  dataManagement: {
    title: "Data Management",
    description: "Export, import, and clear your data",
    exportFormat: {
      label: "Export Format",
      placeholder: "Select export format",
      options: {
        json: "JSON (with settings)",
        csv: "CSV (data only)",
      },
      helpText: "JSON includes settings and all data. CSV includes only tracking entries.",
    },
    buttons: {
      export: "Export Data",
      import: "Import Data",
      clear: "Clear All Data",
    },
  },

  confirmations: {
    replaceData: "Do you want to replace your existing data? Click 'OK' to replace or 'Cancel' to merge with existing data.",
    clearAllData: "Are you sure you want to delete all your data? This action cannot be undone.",
  },

  toasts: {
    settingsSaved: {
      title: "Settings saved",
      description: "Your preferences have been updated.",
    },
    settingsSaveFailed: {
      title: "Could not save",
      description: "Your changes could not be saved. Try again.",
    },
    dataExported: {
      title: "Data exported",
      description: (format: string) => `Your data has been exported successfully as ${format.toUpperCase()}.`,
    },
    dataImportedCSV: {
      title: "Data imported",
      description: (count: number) => `Successfully imported ${count} entries from CSV.`,
    },
    dataImportedJSON: {
      title: "Data imported",
      description: (count: number) => `Successfully imported ${count} entries.`,
    },
    dataCleared: {
      title: "Data cleared",
      description: "All your data has been deleted.",
    },
  },

  errors: {
    invalidCSV: "Invalid CSV format",
    noValidEntries: "No valid entries found in the CSV file",
    invalidDataFormat: "Invalid data format: Missing or invalid tracking entries",
    invalidEntryFormat: "Invalid entry format: Missing required fields",
    importFailed: "Failed to import data",
  },
};
