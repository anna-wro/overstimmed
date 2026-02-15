/** @fileoverview Individual recommendation card with icon and description. */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

interface Recommendation {
  title: string
  description: string
  icon: React.ReactNode
}

interface RecommendationCardProps {
  title: string
  description: string
  icon: React.ReactNode
  recommendations: Recommendation[]
  emptyMessage: string
}

export default function RecommendationCard({
  title,
  description,
  icon,
  recommendations,
  emptyMessage,
}: RecommendationCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-lavender-950/30 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-0.5">{rec.icon}</div>
                <div>
                  <h3 className="font-medium mb-1">{rec.title}</h3>
                  <p className="text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 