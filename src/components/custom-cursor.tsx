"use client"

import { useEffect, useRef, useCallback } from "react"
import gsap from "gsap"

const TRAIL_LENGTH = 20
const TRAIL_THROTTLE = 16 // ~60fps

interface Point {
  x: number
  y: number
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const trailRef = useRef<Point[]>([])
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef(0)
  const isHoveringRef = useRef(false)

  const buildPath = useCallback((points: Point[]): string => {
    if (points.length < 2) return ""
    const [first, ...rest] = points
    let d = `M${first.x},${first.y}`
    for (let i = 0; i < rest.length - 1; i++) {
      const cx = (rest[i].x + rest[i + 1].x) / 2
      const cy = (rest[i].y + rest[i + 1].y) / 2
      d += ` Q${rest[i].x},${rest[i].y} ${cx},${cy}`
    }
    const last = rest[rest.length - 1]
    d += ` L${last.x},${last.y}`
    return d
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    const svg = svgRef.current
    const path = pathRef.current
    if (!dot || !svg || !path) return

    // Hide on touch devices or reduced motion
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      dot.style.display = "none"
      svg.style.display = "none"
      return
    }

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastTimeRef.current < TRAIL_THROTTLE) return
      lastTimeRef.current = now

      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" })

      trailRef.current.push({ x: e.clientX, y: e.clientY })
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.shift()
      }

      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        const d = buildPath(trailRef.current)
        if (d) path.setAttribute("d", d)
      })
    }

    const onEnterInteractive = () => {
      isHoveringRef.current = true
      gsap.to(path, { attr: { "stroke-width": 2.5 }, opacity: 0.8, duration: 0.3 })
      gsap.to(dot, { scale: 0.5, duration: 0.3 })
    }

    const onLeaveInteractive = () => {
      isHoveringRef.current = false
      gsap.to(path, { attr: { "stroke-width": 1.5 }, opacity: 1, duration: 0.3 })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    document.addEventListener("mousemove", onMove)

    const interactives = document.querySelectorAll("a, button, [role='button'], input, textarea, select")
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive)
      el.addEventListener("mouseleave", onLeaveInteractive)
    })

    // Fade trail on idle
    const fadeInterval = setInterval(() => {
      if (trailRef.current.length > 2) {
        trailRef.current.shift()
        const d = buildPath(trailRef.current)
        if (d) path.setAttribute("d", d)
      }
    }, 50)

    return () => {
      document.removeEventListener("mousemove", onMove)
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive)
        el.removeEventListener("mouseleave", onLeaveInteractive)
      })
      clearInterval(fadeInterval)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [buildPath])

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground mix-blend-difference lg:block"
      />
      {/* Golden thread trail */}
      <svg
        ref={svgRef}
        className="pointer-events-none fixed inset-0 z-[9998] hidden h-full w-full lg:block"
        style={{ mixBlendMode: "difference" }}
      >
        <defs>
          <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(38 48% 52%)" stopOpacity="0" />
            <stop offset="40%" stopColor="hsl(38 48% 52%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(38 48% 62%)" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#thread-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  )
}
