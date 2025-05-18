"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Save, Clock, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import Link from "next/link"

type JournalEntry = {
  id: string
  title: string
  content: string
  timestamp: string
  copingStrategies: string
}

export default function JournalPage() {
  const { toast } = useToast()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [copingStrategies, setCopingStrategies] = useState("")

  useEffect(() => {
    // Load journal entries from localStorage
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveEntry = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title for your journal entry",
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
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))

    // Reset form
    setTitle("")
    setContent("")
    setCopingStrategies("")

    toast({
      title: "Journal entry saved",
      description: "Your journal entry has been saved successfully.",
    })
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))

    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Link href="/">
          <h1 className="mb-3 bg-gradient-to-r from-lavender-600 to-sand-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
            Overstimmed
          </h1>
        </Link>
      </div>
      <Link href="/" className="inline-flex items-center mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Journal Entry</CardTitle>
            <CardDescription>Record your thoughts, feelings, and experiences</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Entry Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>

            <div>
              <Textarea
                placeholder="What's on your mind today? How are you feeling?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Coping Strategies Used</h3>
              <Textarea
                placeholder="What strategies helped you today? (deep breathing, stimming, quiet time, etc.)"
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
              Save Journal Entry
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Previous Entries</h2>
          {entries.length === 0 ? (
            <p className="text-muted-foreground">No journal entries yet. Start writing to see your entries here.</p>
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
                        title: "Entry loaded",
                        description: "You can now edit this entry.",
                      })
                    }}
                  >
                    Edit
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
  \
    <div className="fixed top-6 right-6 z-50">
      <ThemeToggle />
    </div>
  )
}
