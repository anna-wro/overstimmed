/**
 * Types and helpers for user profile (name, theme prefs) stored in Supabase.
 */

export type Profile = {
  id: string
  name: string | null
  theme: string
  high_contrast_mode: boolean
  font_size: number
  updated_at: string
}

export type ProfileUpdate = {
  name?: string | null
  theme?: string
  high_contrast_mode?: boolean
  font_size?: number
}
