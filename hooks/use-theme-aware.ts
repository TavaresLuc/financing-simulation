"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeAware() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === "dark" : false
  const isLight = mounted ? resolvedTheme === "light" : true

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark,
    isLight,
    mounted,
  }
}
