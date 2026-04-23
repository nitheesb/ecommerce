"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function SectionDivider() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const paths = svg.querySelectorAll<SVGPathElement>(".zari-motif")

    paths.forEach((path) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    })

    const trigger = ScrollTrigger.create({
      trigger: svg,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.6,
          stagger: 0.15,
          ease: "power2.inOut",
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-10" aria-hidden>
      <svg
        ref={svgRef}
        viewBox="0 0 1200 32"
        className="h-8 w-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center line */}
        <line
          x1="0" y1="16" x2="1200" y2="16"
          stroke="hsl(38 48% 52%)"
          strokeWidth="0.5"
          opacity="0.2"
        />

        {/* Repeating diamond/temple motifs across the width */}
        {Array.from({ length: 12 }).map((_, i) => {
          const cx = 50 + i * 100
          return (
            <g key={i}>
              {/* Diamond shape — classic zari motif */}
              <path
                className="zari-motif"
                d={`M${cx} 4 L${cx + 12} 16 L${cx} 28 L${cx - 12} 16 Z`}
                stroke="hsl(38 48% 52%)"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              {/* Inner diamond */}
              <path
                className="zari-motif"
                d={`M${cx} 8 L${cx + 7} 16 L${cx} 24 L${cx - 7} 16 Z`}
                stroke="hsl(38 48% 58%)"
                strokeWidth="0.7"
                fill="none"
                opacity="0.35"
              />
              {/* Small dot at center */}
              <circle
                cx={cx}
                cy={16}
                r="1.5"
                fill="hsl(38 48% 52%)"
                opacity="0.4"
              />
              {/* Connecting arcs between diamonds */}
              {i < 11 && (
                <path
                  className="zari-motif"
                  d={`M${cx + 12} 16 Q${cx + 50} 6, ${cx + 88} 16`}
                  stroke="hsl(38 48% 52%)"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.25"
                />
              )}
              {i < 11 && (
                <path
                  className="zari-motif"
                  d={`M${cx + 12} 16 Q${cx + 50} 26, ${cx + 88} 16`}
                  stroke="hsl(38 48% 52%)"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.25"
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
