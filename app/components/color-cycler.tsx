'use client'

import { useEffect } from 'react'

// Auto-cycling accent palette. Each value is an HSL triple (no hsl() wrapper)
// so it can be dropped straight into the CSS custom properties the whole site
// reads via `hsl(var(--primary))`. All tuned to stay readable on the dark navy
// background with the existing dark foreground text.
const palette = [
  '0 84% 60%',    // red
  '142 71% 45%',  // green
  '212 92% 56%',  // blue
  '48 96% 53%',   // yellow
  '300 76% 58%',  // magenta
]

export default function ColorCycler() {
  useEffect(() => {
    const root = document.documentElement
    let i = 0

    const apply = () => {
      const c = palette[i % palette.length]
      root.style.setProperty('--primary', c)
      root.style.setProperty('--accent', c)
      root.style.setProperty('--ring', c)
      i++
    }

    apply()
    const id = setInterval(apply, 10000)
    return () => clearInterval(id)
  }, [])

  return null
}
