"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSystemDetector() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      // Force re-render when system theme changes
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [mounted, theme])

  if (!mounted) return null

  return null
}
