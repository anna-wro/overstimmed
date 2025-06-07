"use client"

import { useTrackForm } from "@/hooks/features/track/useTrackForm"
import { CustomDateTimePicker } from "@/components/track/CustomDateTimePicker"
import { LevelSlider } from "@/components/track/LevelSlider"
import { TagMultiSelectInput, createTagMultiSelectCopy } from "@/components/tags/TagMultiSelectInput"
import { UnsavedChangesDialog } from "@/components/track/UnsavedChangesDialog"
import { ExperienceRating } from "@/components/track/ExperienceRating"
import { LowSpoonModeToggle } from "@/components/track/LowSpoonModeToggle"
import { Battery, Zap, } from "lucide-react"
import { ActivityInput } from "@/components/track/ActivityInput"
import { NotesInput } from "@/components/track/NotesInput"
import { TrackFormCard } from "@/components/track/TrackFormCard"
import { trackingPageCopy } from "@/copy/track"
import { SaveEntryButton } from "@/components/track/SaveEntryButton"
import { DEFAULT_FEELINGS, FEELING_CATEGORIES } from "@/consts/feelingConstants"
import { TRIGGER_CATEGORIES } from "@/consts/triggerConstants"
import { useState } from "react"
import { useAppSettings } from "@/hooks/features/settings/useAppSettings"

export default function TrackPage() {
  const [dateTimeValue, setDateTimeValue] = useState<string>("")
  const [settings, setSettings] = useAppSettings()
 
  const handleLowSpoonModeToggle = (checked: boolean) => {
    setSettings({ ...settings, lowSpoonMode: checked })
  }
  
  const {
    energyLevel,
    setEnergyLevel,
    stimulationLevel,
    setStimulationLevel,
    stimulationType,
    setStimulationType,
    triggerTags,
    setTriggerTags,
    feelingTags,
    setFeelingTags,
    activities,
    setActivities,
    notes,
    setNotes,
    formModified,
    showUnsavedDialog,
    setShowUnsavedDialog,
    handleUnsavedDialogAction,
    handleSave,
  } = useTrackForm(dateTimeValue)
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8 high-contrast:bg-white dark:high-contrast:bg-black">
  
      <div className="container mx-auto max-w-3xl">
        <TrackFormCard
          title={settings.lowSpoonMode ? "Quick Check-in" : trackingPageCopy.cardTitle}
          footer={
            <SaveEntryButton onClick={handleSave} disabled={!formModified} />
          }
        >
          <LowSpoonModeToggle 
            lowSpoonMode={settings.lowSpoonMode}
            onToggle={handleLowSpoonModeToggle}
          />

          <CustomDateTimePicker onChange={setDateTimeValue} lowSpoonMode={settings.lowSpoonMode} />
          
          <LevelSlider
            value={energyLevel}
            setValue={setEnergyLevel}
            min={0}
            max={10}
            icon={<Battery className="mr-2 h-5 w-5 text-lavender-500" />}
            label={trackingPageCopy.energy.label}
            type="energy"
          />
          <LevelSlider
            value={stimulationLevel}
            setValue={setStimulationLevel}
            min={0}
            max={10}
            icon={<Zap className="mr-2 h-5 w-5 text-sand-500" />}
            label={trackingPageCopy.stimulation.label}
            type="stimulation"
          />
          <ExperienceRating value={stimulationType} onChange={setStimulationType} />
            
          {!settings.lowSpoonMode && (
            <>
              <TagMultiSelectInput 
                value={triggerTags} 
                onChange={setTriggerTags} 
                copy={createTagMultiSelectCopy(trackingPageCopy.trigger)}
                inputId="triggers"
                storageKey="triggerTags"
                categories={TRIGGER_CATEGORIES}
              />
              <TagMultiSelectInput 
                value={feelingTags} 
                onChange={setFeelingTags} 
                copy={createTagMultiSelectCopy(trackingPageCopy.feeling)}
                inputId="feelings"
                storageKey="feelingTags"
                defaultTags={DEFAULT_FEELINGS}
                categories={FEELING_CATEGORIES}
              />
              <ActivityInput value={activities} onChange={e => setActivities(e.target.value)} />
              <NotesInput value={notes} onChange={e => setNotes(e.target.value)} />
            </>
          )}
        </TrackFormCard>
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onAction={handleUnsavedDialogAction}
      />
    </div>
  )
}
