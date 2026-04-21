"use client"

import { useEffect, useState } from "react"

const COUNTDOWN_TARGET = "2026-10-03T00:00:00+05:30"
const COUNTDOWN_LABEL = "Navratri Collection Drop"

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    expired: diff <= 0,
  }
}

export function CountdownBanner() {
  const target = new Date(COUNTDOWN_TARGET).getTime()
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(() => getTimeLeft(target))

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => {
      const t = getTimeLeft(target)
      setTime(t)
      if (t.expired) clearInterval(id)
    }, 1_000)
    return () => clearInterval(id)
  }, [target])

  if (time.expired) return null

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="flex items-center justify-center gap-3 border-b border-border/40 bg-secondary/30 px-4 py-2 sm:gap-4">
      <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground sm:text-[10px]">
        {COUNTDOWN_LABEL}
      </p>
      <div className="flex items-center gap-0.5 font-serif text-sm tabular-nums tracking-wide sm:text-base">
        {mounted ? (
          <>
            <span>{time.days}<span className="text-[10px] text-muted-foreground/60">d</span></span>
            <span className="text-muted-foreground/40">:</span>
            <span>{pad(time.hours)}<span className="text-[10px] text-muted-foreground/60">h</span></span>
            <span className="text-muted-foreground/40">:</span>
            <span>{pad(time.minutes)}<span className="text-[10px] text-muted-foreground/60">m</span></span>
            <span className="text-muted-foreground/40">:</span>
            <span>{pad(time.seconds)}<span className="text-[10px] text-muted-foreground/60">s</span></span>
          </>
        ) : (
          <span className="text-muted-foreground/40">--:--:--:--</span>
        )}
      </div>
    </div>
  )
}
