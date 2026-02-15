"use client"

/** @fileoverview next-themes provider with system, light, and dark mode support. */

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme {...props}>
      {children}
    </NextThemesProvider>
  )
}
