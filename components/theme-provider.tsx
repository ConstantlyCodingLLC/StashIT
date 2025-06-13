"use client"

import type * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  return <>{children}</>
}

export const useTheme = () => {
  return {
    theme: "light",
    setTheme: (theme: Theme) => {},
  }
}
