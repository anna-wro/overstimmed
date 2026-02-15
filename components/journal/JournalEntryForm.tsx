/** @fileoverview Form for creating and editing journal entries. */
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Input } from "@/components/ui/Input"
import { Save } from "lucide-react"
import { journalPageCopy } from "@/copy/journal"

interface JournalEntryFormProps {
  title: string
  content: string
  copingStrategies: string
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onCopingStrategiesChange: (value: string) => void
  onSave: () => void
}

export function JournalEntryForm({
  title,
  content,
  copingStrategies,
  onTitleChange,
  onContentChange,
  onCopingStrategiesChange,
  onSave,
}: JournalEntryFormProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{journalPageCopy.entryForm.title}</CardTitle>
        <CardDescription>{journalPageCopy.entryForm.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder={journalPageCopy.entryForm.titlePlaceholder}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-lg font-medium"
          />
        </div>

        <div>
          <Textarea
            placeholder={journalPageCopy.entryForm.contentPlaceholder}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">{journalPageCopy.entryForm.copingStrategiesHeading}</h3>
          <Textarea
            placeholder={journalPageCopy.entryForm.copingStrategiesPlaceholder}
            value={copingStrategies}
            onChange={(e) => onCopingStrategiesChange(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={onSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {journalPageCopy.entryForm.saveButton}
        </Button>
      </CardFooter>
    </Card>
  )
} 