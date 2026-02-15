/** @fileoverview Journal page header. */
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { journalPageCopy } from "@/copy/journal"

export function JournalHeader() {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <Link href="/">
          <h1 className="mb-3 bg-linear-to-r from-lavender-600 to-sand-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-lavender-400 dark:to-sand-300 high-contrast:text-foreground high-contrast:bg-clip-border cursor-pointer">
            {journalPageCopy.pageTitle}
          </h1>
        </Link>
      </div>
      <Link href="/" className="inline-flex items-center">
        <ChevronLeft className="mr-2 h-4 w-4" />
        {journalPageCopy.navigation.backToDashboard}
      </Link>
    </div>
  )
} 