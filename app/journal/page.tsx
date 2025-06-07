"use client"

import { useJournalEntries } from "@/hooks/useJournalEntries"
import {
  JournalHeader,
  JournalEntryForm,
  JournalEntriesList,
} from "@/components/journal"

export default function JournalPage() {
  const {
    // State
    entries,
    title,
    content,
    copingStrategies,
    
    // State setters
    setTitle,
    setContent,
    setCopingStrategies,
    
    // Actions
    saveEntry,
    deleteEntry,
    loadEntry,
  } = useJournalEntries()

  return (
    <div className="container mx-auto px-4 py-8">
      <JournalHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <JournalEntryForm
          title={title}
          content={content}
          copingStrategies={copingStrategies}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCopingStrategiesChange={setCopingStrategies}
          onSave={saveEntry}
        />

        <JournalEntriesList
          entries={entries}
          onEditEntry={loadEntry}
          onDeleteEntry={deleteEntry}
        />
      </div>
    </div>
  )
}
