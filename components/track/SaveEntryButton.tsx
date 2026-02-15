import React from "react"
import { Button } from "@/components/ui/Button"
import { Save } from "lucide-react"
import { trackingPageCopy } from "@/copy/track"

interface SaveEntryButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const SaveEntryButton: React.FC<SaveEntryButtonProps> = ({ onClick, disabled }) => (
  <Button
    onClick={onClick}
    size="lg"
    disabled={disabled}
    className="relative overflow-hidden bg-linear-to-r from-lavender-500 to-sand-400 text-white transition-all hover:from-lavender-600 hover:to-sand-500 dark:from-lavender-600 dark:to-sand-500 dark:hover:from-lavender-700 dark:hover:to-sand-600 high-contrast:bg-primary high-contrast:from-primary high-contrast:to-primary"
  >
    <Save className="mr-2 h-4 w-4" />
    {trackingPageCopy.saveButton}
  </Button>
) 