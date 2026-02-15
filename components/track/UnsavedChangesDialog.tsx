/** @fileoverview Confirmation dialog warning about unsaved tracking form changes. */
import React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, X, Save, AlertCircle } from "lucide-react"
import { trackingPageCopy } from "@/copy/track"

interface UnsavedChangesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction: (action: "save" | "discard" | "cancel") => void
  saving?: boolean
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({ open, onOpenChange, onAction, saving = false }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-lavender-700 dark:text-lavender-300">{trackingPageCopy.dialogs.unsavedChanges.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {trackingPageCopy.dialogs.unsavedChanges.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border border-sand-300 bg-sand-50 p-4 text-sand-800 dark:bg-sand-900/30 dark:text-sand-200 dark:border-sand-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 text-blush-500 dark:text-blush-400" />
              <div>
                <p className="font-medium">{trackingPageCopy.dialogs.unsavedChanges.warningTitle}</p>
                <p className="text-sm mt-1">
                  {trackingPageCopy.dialogs.unsavedChanges.warningDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => onAction("cancel")}
              className="justify-center border-lavender-300 text-lavender-700 hover:bg-lavender-50 dark:border-lavender-700 dark:text-lavender-300 dark:hover:bg-lavender-900/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {trackingPageCopy.dialogs.unsavedChanges.keepEditing}
            </Button>
            <Button
              variant="outline"
              onClick={() => onAction("discard")}
              className="justify-center border-blush-300 text-blush-700 hover:bg-blush-50 hover:text-blush-800 dark:border-blush-700 dark:text-blush-300 dark:hover:bg-blush-900/20"
            >
              <X className="mr-2 h-4 w-4" />
              {trackingPageCopy.dialogs.unsavedChanges.discardEntry}
            </Button>
            <Button
              onClick={() => onAction("save")}
              disabled={saving}
              className="justify-center bg-mint-500 hover:bg-mint-600 text-white dark:bg-mint-600 dark:hover:bg-mint-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : trackingPageCopy.dialogs.unsavedChanges.saveEntry}
            </Button> 
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 