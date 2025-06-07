"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Input } from "@/components/ui/Input"
import { ChevronLeft, Save, Clock, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { journalPageCopy } from "@/copy/journal"

type JournalEntry = {
  id: string
  title: string
  content: string
  timestamp: string
  copingStrategies: string
}

export default function JournalPage() {
  const { toast } = useToast()
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("journalEntries", [])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [copingStrategies, setCopingStrategies] = useState("")

  const saveEntry = () => {
    if (!title.trim()) {
      toast({
        title: journalPageCopy.toasts.titleRequired.title,
        description: journalPageCopy.toasts.titleRequired.description,
        variant: "destructive",
      })
      return
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      copingStrategies,
      timestamp: new Date().toISOString(),
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)

    // Reset form
    setTitle("")
    setContent("")
    setCopingStrategies("")

    toast({
      title: journalPageCopy.toasts.entrySaved.title,
      description: journalPageCopy.toasts.entrySaved.description,
    })
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)

    toast({
      title: journalPageCopy.toasts.entryDeleted.title,
      description: journalPageCopy.toasts.entryDeleted.description,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Link href="/">
          <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
            {journalPageCopy.pageTitle}
          </h1>
        </Link>
      </div>
      <Link href="/" className="inline-flex items-center mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        {journalPageCopy.navigation.backToDashboard}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>

            <div>
              <Textarea
                placeholder={journalPageCopy.entryForm.contentPlaceholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">{journalPageCopy.entryForm.copingStrategiesHeading}</h3>
              <Textarea
                placeholder={journalPageCopy.entryForm.copingStrategiesPlaceholder}
                value={copingStrategies}
                onChange={(e) => setCopingStrategies(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={saveEntry} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {journalPageCopy.entryForm.saveButton}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">{journalPageCopy.previousEntries.heading}</h2>
          {entries.length === 0 ? (
            <p className="text-muted-foreground">{journalPageCopy.previousEntries.emptyState}</p>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
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
                    onClick={() => {
                      setTitle(entry.title)
                      setContent(entry.content)
                      setCopingStrategies(entry.copingStrategies)
                      toast({
                        title: journalPageCopy.toasts.entryLoaded.title,
                        description: journalPageCopy.toasts.entryLoaded.description,
                      })
                    }}
                  >
                    {journalPageCopy.previousEntries.editButton}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
    // <div className="fixed top-6 right-6 z-50">
    //   <ThemeToggle />
    // </div>
  )
}
