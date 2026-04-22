"use client"

import { useRef, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { X, Clock } from "lucide-react"
import gsap from "gsap"
import { useUiStore } from "@/hooks/use-ui-store"
import { formatCurrency } from "@/lib/utils"

export function RecentlyViewedDrawer() {
  const recentlyViewed = useUiStore((s) => s.recentlyViewed)
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (open) {
      gsap.to(panel, { x: 0, duration: 0.35, ease: "power3.out" })
    } else {
      gsap.to(panel, { x: "100%", duration: 0.25, ease: "power2.in" })
    }
  }, [open])

  const shouldRender = mounted && pathname.startsWith("/product/") && recentlyViewed.length > 1

  useEffect(() => {
    if (!shouldRender && open) {
      setOpen(false)
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  return (
    <>
      {/* Tab — desktop only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-0 top-[42%] z-30 hidden -translate-y-1/2 items-center gap-1.5 rounded-l-sm bg-foreground/92 px-2 py-3 text-background shadow-lg transition-opacity hover:opacity-90 xl:flex"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        aria-label="Open recently viewed"
      >
        <Clock className="h-3.5 w-3.5 rotate-90" strokeWidth={1.5} />
        <span className="text-[9px] font-medium uppercase tracking-[0.2em]">Recently Viewed</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-50 flex h-full w-72 translate-x-full flex-col border-l border-border/40 bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Recently Viewed
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-4">
            {recentlyViewed.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                onClick={() => setOpen(false)}
                className="group/rv flex gap-3"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover/rv:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    {item.collection}
                  </p>
                  <p className="mt-0.5 truncate font-serif text-sm leading-tight group-hover/rv:underline">
                    {item.name}
                  </p>
                  <p className="mt-1 font-serif text-sm text-muted-foreground">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
