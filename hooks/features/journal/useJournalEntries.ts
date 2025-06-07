import { useState } from "react"
import { useToast } from "@/hooks/useToast"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { journalPageCopy } from "@/copy/journal"

export type JournalEntry = {
  id: string
  title: string
  content: string
  timestamp: string
  copingStrategies: string
}

export function useJournalEntries() {
  const { toast } = useToast()
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("journalEntries", [])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [copingStrategies, setCopingStrategies] = useState("")

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCopingStrategies("")
  }

  const saveEntry = () => {
    if (!title.trim()) {
      toast({
        title: journalPageCopy.toasts.titleRequired.title,
        description: journalPageCopy.toasts.titleRequired.description,
        variant: "destructive",
      })
      return false
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
    resetForm()

    toast({
      title: journalPageCopy.toasts.entrySaved.title,
      description: journalPageCopy.toasts.entrySaved.description,
    })

    return true
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)

    toast({
      title: journalPageCopy.toasts.entryDeleted.title,
      description: journalPageCopy.toasts.entryDeleted.description,
    })
  }

  const loadEntry = (entry: JournalEntry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setCopingStrategies(entry.copingStrategies)

    toast({
      title: journalPageCopy.toasts.entryLoaded.title,
      description: journalPageCopy.toasts.entryLoaded.description,
    })
  }

  return {
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
    resetForm,
  }
} 