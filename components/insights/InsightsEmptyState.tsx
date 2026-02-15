/** @fileoverview Empty state for the insights page when no data is available. */
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { insightsPageCopy } from "@/copy/insights"

export function InsightsEmptyState() {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <h2 className="text-xl font-medium mb-2">{insightsPageCopy.emptyState.title}</h2>
        <p className="text-muted-foreground mb-6">
          {insightsPageCopy.emptyState.description}
        </p>
        <Link href="/track">
          <Button>{insightsPageCopy.emptyState.buttonText}</Button>
        </Link>
      </CardContent>
    </Card>
  )
} 