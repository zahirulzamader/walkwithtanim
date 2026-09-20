'use client'

import { useEffect } from 'react'

// Water-ripple cursor effect: expanding concentric rings trail the pointer and
// a larger ring bursts on click. Rings use the live accent color so they cycle
// along with the rest of the site. Purely decorative + pointer-events:none, and
// skipped on touch devices.
export default function CursorRipple() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const layer = document.createElement('div')
    layer.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden'
    document.body.appendChild(layer)

    const spawn = (x: number, y: number, size: number, opacity: number) => {
      const r = document.createElement('span')
      r.style.cssText =
        `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
        `margin-left:${-size / 2}px;margin-top:${-size / 2}px;border-radius:50%;` +
        `border:2px solid hsl(var(--primary));opacity:${opacity};transform:scale(0.25);` +
        `transition:transform .85s cubic-bezier(0.22,1,0.36,1), opacity .85s ease-out;will-change:transform,opacity;`
      layer.appendChild(r)
      requestAnimationFrame(() => {
        r.style.transform = 'scale(1)'
        r.style.opacity = '0'
      })
      window.setTimeout(() => r.remove(), 900)
    }

    let last = 0
    const onMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - last < 90) return
      last = now
      spawn(e.clientX, e.clientY, 38, 0.55)
    }
    const onClick = (e: MouseEvent) => spawn(e.clientX, e.clientY, 90, 0.7)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      layer.remove()
    }
  }, [])

  return null
}
