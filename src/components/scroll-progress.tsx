"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    const shell = shellRef.current
    if (!bar || !shell) return

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      bar.style.transform = `scaleX(${progress})`
      shell.style.opacity = progress > 0.04 ? "1" : "0"
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div ref={shellRef} className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-px opacity-0 transition-opacity duration-300">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-[hsl(var(--gold))]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
