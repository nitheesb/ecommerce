"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      dot.style.display = "none"
      ring.style.display = "none"
      return
    }

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.25, ease: "power2.out" })
    }

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.3 })
      gsap.to(dot, { scale: 0.5, duration: 0.3 })
    }

    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    document.addEventListener("mousemove", onMove)

    const interactives = document.querySelectorAll("a, button, [role='button'], input, textarea, select")
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive)
      el.addEventListener("mouseleave", onLeaveInteractive)
    })

    return () => {
      document.removeEventListener("mousemove", onMove)
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive)
        el.removeEventListener("mouseleave", onLeaveInteractive)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground mix-blend-difference lg:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/40 mix-blend-difference lg:block"
      />
    </>
  )
}
