"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTrackUnsaved } from "@/contexts/TrackUnsavedContext"
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
  const router = useRouter()
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
    saving,
    showUnsavedDialog,
    setShowUnsavedDialog,
    setPendingNavigation,
    handleUnsavedDialogAction,
    handleSave,
  } = useTrackForm(dateTimeValue)

  const { setTrackUnsaved } = useTrackUnsaved() ?? {}
  const openDialogRef = useRef((path: string) => {
    setPendingNavigation(path)
    setShowUnsavedDialog(true)
  })
  openDialogRef.current = (path: string) => {
    setPendingNavigation(path)
    setShowUnsavedDialog(true)
  }
  useEffect(() => {
    if (!setTrackUnsaved) return
    setTrackUnsaved({
      hasUnsaved: formModified,
      openDialog: (path) => openDialogRef.current(path),
    })
    return () => setTrackUnsaved(null)
  }, [formModified, setTrackUnsaved])

  useEffect(() => {
    if (!formModified) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    const handlePopState = () => {
      router.push("/track")
      setPendingNavigation("__back__")
      setShowUnsavedDialog(true)
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [formModified, router, setPendingNavigation, setShowUnsavedDialog])

  return (
    <div className="min-h-screen bg-linear-to-b from-sand-50 to-lavender-50 dark:from-lavender-950 dark:to-sand-950 px-4 py-8 high-contrast:bg-white dark:high-contrast:bg-black">
  
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
        saving={saving}
      />
    </div>
  )
}
