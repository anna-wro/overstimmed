import { Card, CardContent } from "@/components/ui/Card"
import { format } from "date-fns"
import { getExperienceTypeText, getExperienceTypeColor } from "@/utils/experienceTypeHelpers"

interface EntryListProps {
  entries: any[]
}

export default function EntryList({ entries }: EntryListProps) {
  return (
    <div className="space-y-4">
      {entries.map((entry: any, index: number) => (
        <Card key={index} className="bg-white/80 dark:bg-lavender-950/30 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">{format(new Date(entry.timestamp), "h:mm a")}</div>
              <div className={`text-sm font-medium ${getExperienceTypeColor(entry.stimulationType)}`}>
                {getExperienceTypeText(entry.stimulationType)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Energy</span>
                  <span className="text-sm font-medium">{entry.energyLevel}/10</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-sand-500"
                    style={{ width: `${entry.energyLevel * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Stimulation</span>
                  <span className="text-sm font-medium">{entry.stimulationLevel}/10</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-lavender-500"
                    style={{ width: `${entry.stimulationLevel * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {(entry.triggers || entry.activities || entry.notes) && (
              <div className="mt-4 pt-4 border-t">
                {entry.triggers && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Triggers</div>
                    <div className="text-sm">{entry.triggers}</div>
                  </div>
                )}

                {entry.activities && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Activities</div>
                    <div className="text-sm">{entry.activities}</div>
                  </div>
                )}

                {entry.notes && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Notes</div>
                    <div className="text-sm">{entry.notes}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 