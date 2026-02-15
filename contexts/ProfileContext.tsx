"use client"

/** @fileoverview React context providing the authenticated user's display name profile. */

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile, ProfileUpdate } from "@/lib/profile"

type ProfileContextValue = {
  profile: Profile | null
  loading: boolean
  refetch: () => Promise<void>
  updateProfile: (updates: ProfileUpdate) => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    if (error && error.code !== "PGRST116") {
      setProfile(null)
      setLoading(false)
      return
    }
    setProfile(
      data
        ? {
            id: data.id,
            name: data.name ?? null,
            theme: data.theme ?? "system",
            high_contrast_mode: data.high_contrast_mode ?? false,
            font_size: data.font_size ?? 16,
            updated_at: data.updated_at,
          }
        : null
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      const row = {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.theme !== undefined && { theme: updates.theme }),
        ...(updates.high_contrast_mode !== undefined && { high_contrast_mode: updates.high_contrast_mode }),
        ...(updates.font_size !== undefined && { font_size: updates.font_size }),
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase.from("profiles").upsert(
        { id: user.id, ...row },
        { onConflict: "id" }
      )
      if (error) throw error
      await refetch()
    },
    [refetch]
  )

  return (
    <ProfileContext.Provider value={{ profile, loading, refetch, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider")
  return ctx
}
