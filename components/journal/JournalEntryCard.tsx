import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Clock, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { journalPageCopy } from "@/copy/journal"
import type { JournalEntry } from "@/hooks/useJournalEntries"

interface JournalEntryCardProps {
  entry: JournalEntry
  onEdit: (entry: JournalEntry) => void
  onDelete: (id: string) => void
}

export function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{entry.title}</CardTitle>
        <CardDescription className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {format(new Date(entry.timestamp), "PPP p")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm">{entry.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(entry)}
        >
          {journalPageCopy.previousEntries.editButton}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 