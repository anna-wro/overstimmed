import { JournalEntryCard } from "./JournalEntryCard"
import { journalPageCopy } from "@/copy/journal"
import type { JournalEntry } from "@/hooks/features/journal/useJournalEntries"

interface JournalEntriesListProps {
  entries: JournalEntry[]
  onEditEntry: (entry: JournalEntry) => void
  onDeleteEntry: (id: string) => void
}

export function JournalEntriesList({ entries, onEditEntry, onDeleteEntry }: JournalEntriesListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{journalPageCopy.previousEntries.heading}</h2>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">{journalPageCopy.previousEntries.emptyState}</p>
      ) : (
        entries.map((entry) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
          />
        ))
      )}
    </div>
  )
} 