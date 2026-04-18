"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const defaultMessages = [
  "Complimentary Worldwide Shipping on Orders Above ₹25,000",
  "The Archive — New Heritage Weaves Have Arrived",
  "Atelier Appointments · Jayanagar, Bengaluru",
  "Hand-Woven · Ethically Sourced · Naturally Dyed",
  "Register for The Thazhuval Trousseau Concierge",
]

export function Marquee({
  messages = defaultMessages,
  className,
}: {
  messages?: string[]
  className?: string
}) {
  const [dismissed, setDismissed] = useState(false)
  const items = [...messages, ...messages]

  if (dismissed) return null

  return (
    <div
      className={cn(
        "group/marquee relative flex overflow-hidden border-y border-border/60 bg-[hsl(var(--slate-deep))] text-background",
        className
      )}
      aria-label="Brand announcements"
    >
      <div className="flex animate-marquee whitespace-nowrap will-change-transform group-hover/marquee:[animation-play-state:paused]">
        {items.map((m, i) => (
          <span
            key={i}
            className="mx-10 flex items-center gap-10 py-3 text-[11px] font-medium uppercase tracking-[0.28em]"
          >
            {m}
            <span
              aria-hidden
              className="inline-block h-[5px] w-[5px] rounded-full bg-background/60"
            />
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcements"
        className="absolute right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-background/60 transition-colors hover:text-background"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
