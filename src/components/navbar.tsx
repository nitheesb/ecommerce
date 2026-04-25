"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingBag } from "lucide-react"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { categories } from "@/lib/products"

const WORDMARK = "THAZHUVAL"

export function Navbar({
  solid = false,
  overlay = false,
}: {
  solid?: boolean
  overlay?: boolean
}) {
  const [scrolled, setScrolled] = React.useState(solid)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const cartBtnRef = React.useRef<HTMLButtonElement>(null)
  const badgeRef = React.useRef<HTMLSpanElement>(null)
  const wordmarkRef = React.useRef<HTMLDivElement>(null)
  const wordmarkLinkRef = React.useRef<HTMLAnchorElement>(null)
  const subtitleRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (solid) return // Always use solid styling
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [solid])

  React.useEffect(() => {
    if (!openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [openMenu])

  // Cart add-to-cart micro-interaction
  React.useEffect(() => {
    const badge = badgeRef.current
    const btn = cartBtnRef.current
    if (!badge || !btn) return

    let lastCount = badge.textContent ?? ""

    const observer = new MutationObserver(() => {
      const newCount = badge.textContent ?? ""
      if (newCount === lastCount) return
      const wasEmpty = lastCount === "" || lastCount === "0"
      lastCount = newCount
      if (wasEmpty && (newCount === "0" || newCount === "")) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      const icon = btn.querySelector("svg")
      if (icon) {
        gsap.fromTo(icon, { y: 0 }, { y: -4, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 })
      }
      gsap.fromTo(badge, { scale: 0.5 }, { scale: 1, duration: 0.3, ease: "back.out(3)" })
    })

    observer.observe(badge, { childList: true, characterData: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  // Center wordmark — fun animation: per-letter wave entrance, gentle float loop,
  // and a hover wave-bounce.
  React.useEffect(() => {
    const root = wordmarkRef.current
    const link = wordmarkLinkRef.current
    const subtitle = subtitleRef.current
    if (!root || !link) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-letter]"))
    if (letters.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(letters, { yPercent: 120, opacity: 0, rotate: -6 })
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 6, letterSpacing: "0.5em" })

      const intro = gsap.timeline({ delay: 0.25 })
      intro.to(letters, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.85,
        ease: "back.out(2.4)",
        stagger: 0.045,
      })
      if (subtitle) {
        intro.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.38em",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        )
      }
      intro.add(() => {
        // Gentle floating loop on the whole wordmark after entrance
        gsap.to(root, {
          y: -2,
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      })
    }, root)

    const onEnter = () => {
      gsap.to(letters, {
        keyframes: [
          { yPercent: -28, rotate: -4, duration: 0.18, ease: "power2.out" },
          { yPercent: 0, rotate: 0, duration: 0.42, ease: "elastic.out(1, 0.45)" },
        ],
        stagger: 0.04,
      })
    }

    link.addEventListener("mouseenter", onEnter)
    link.addEventListener("focus", onEnter)
    return () => {
      link.removeEventListener("mouseenter", onEnter)
      link.removeEventListener("focus", onEnter)
      ctx.revert()
    }
  }, [])

  const textColor = scrolled
    ? "text-foreground"
    : overlay
      ? "text-foreground md:text-background"
      : "text-background"
  const textMuted = scrolled
    ? "text-foreground/72"
    : overlay
      ? "text-foreground/72 md:text-background/82"
      : "text-background/82"
  const iconHover = scrolled
    ? "hover:bg-foreground/5"
    : overlay
      ? "hover:bg-foreground/5 md:hover:bg-background/10"
      : "hover:bg-background/10"

  return (
    <header
      className={cn(
        "top-0 z-40 w-full transition-all duration-500",
        overlay ? "sticky md:fixed md:inset-x-0" : "sticky",
        scrolled
          ? "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 border-b border-border/40 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          : overlay
            ? "border-b border-border/30 bg-background/95 md:border-transparent md:bg-transparent"
            : "bg-transparent"
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8",
          scrolled ? "h-[60px] md:h-[68px]" : "h-[70px] md:h-[82px]"
        )}
      >
        {/* Left: Mobile menu + desktop nav */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            aria-label="House of Thazhuval — home"
            className="mr-1 hidden shrink-0 items-center sm:inline-flex"
          >
            <Image
              src="/images/logo-01.png"
              alt="House of Thazhuval"
              width={140}
              height={48}
              priority
              className={cn(
                "h-7 w-auto select-none transition-[filter,opacity] duration-500 md:h-8",
                scrolled
                  ? "opacity-90"
                  : overlay
                    ? "opacity-90 md:opacity-95 md:[filter:invert(1)_brightness(1.05)]"
                    : "opacity-95 [filter:invert(1)_brightness(1.05)]"
              )}
            />
          </Link>
          <MobileNav scrolled={scrolled} />
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              onMouseEnter={() => setOpenMenu(null)}
              className={cn(
                "px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                textMuted,
                scrolled ? "hover:text-foreground" : "hover:text-background"
              )}
            >
              Home
            </Link>
            <button
              onMouseEnter={() => setOpenMenu("Shop")}
              onFocus={() => setOpenMenu("Shop")}
              aria-haspopup="true"
              aria-expanded={openMenu === "Shop"}
              className={cn(
                "relative whitespace-nowrap px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                openMenu === "Shop"
                  ? textColor
                  : cn(textMuted, scrolled ? "hover:text-foreground" : "hover:text-background")
              )}
            >
              Shop
              <span
                className={cn(
                  "absolute inset-x-3 bottom-[5px] h-px transition-transform duration-300 origin-left",
                  scrolled ? "bg-foreground" : "bg-background",
                  openMenu === "Shop" ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          </nav>
        </div>

        {/* Center: Logo */}
        <Link
          ref={wordmarkLinkRef}
          href="/"
          className="select-none px-4 py-2 text-center md:px-6"
          aria-label="Thazhuval home"
        >
          <div
            ref={wordmarkRef}
            className={cn(
              "font-serif text-[23px] leading-none tracking-[0.22em] transition-colors duration-500 md:text-[30px]",
              "inline-flex overflow-hidden",
              textColor
            )}
            aria-hidden
          >
            {WORDMARK.split("").map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                data-letter
                className="inline-block will-change-transform"
              >
                {ch}
              </span>
            ))}
          </div>
          <span className="sr-only">{WORDMARK}</span>
          <div
            ref={subtitleRef}
            className={cn(
              "mt-1 hidden text-[8px] uppercase tracking-[0.38em] transition-all duration-300 md:block",
              scrolled
                ? "pointer-events-none -translate-y-0.5 opacity-0 text-foreground/50"
                : "text-background/72 opacity-100"
            )}
          >
            House of Thazhuval
          </div>
        </Link>

        {/* Right: Our Story + actions */}
        <div className="flex items-center justify-end gap-0.5">
          <Link
            href="/our-story"
            onMouseEnter={() => setOpenMenu(null)}
            className={cn(
              "hidden whitespace-nowrap px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 lg:inline-flex",
              textMuted,
              scrolled ? "hover:text-foreground" : "hover:text-background"
            )}
          >
            Our Story
          </Link>
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Search"
            className={cn("h-9 w-9 md:h-10 md:w-10 transition-colors duration-300", textColor, iconHover)}
          >
            <Link href="/search">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
          </Button>
          <Button
            ref={cartBtnRef}
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className={cn("snipcart-checkout relative h-9 w-9 md:h-10 md:w-10 transition-colors duration-300", textColor, iconHover)}
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span ref={badgeRef} className={cn(
              "snipcart-items-count absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-medium leading-none transition-colors duration-300",
              scrolled ? "bg-foreground text-background" : "bg-background text-foreground"
            )} />
          </Button>
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu openMenu={openMenu} onClose={() => setOpenMenu(null)} />
    </header>
  )
}

function MegaMenu({
  openMenu,
  onClose,
}: {
  openMenu: string | null
  onClose: () => void
}) {
  if (openMenu !== "Shop") return null

  return (
    <div
      role="menu"
      className={cn(
        "absolute inset-x-0 top-full z-30 transition-all duration-300 ease-out",
        openMenu ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
      )}
      onMouseLeave={onClose}
    >
      {/* Dark frosted panel */}
      <div className="border-b border-background/10 bg-foreground/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-10 px-8 py-10 md:grid-cols-4 md:gap-12">
          {categories.map((cat) => (
            <div key={cat.title} className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/50">
                {cat.title}
              </p>
              <Link
                href={cat.href}
                className="mt-3 inline-flex items-center gap-2 font-serif text-base text-background transition-colors hover:text-background/70"
              >
                Shop All
                <span className="text-background/40" aria-hidden>→</span>
              </Link>
              <ul className="mt-4 flex flex-col gap-2.5">
                {cat.items.slice(0, 8).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[11px] font-medium uppercase tracking-[0.18em] text-background/70 transition-colors duration-200 hover:text-background"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileNav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 lg:hidden transition-colors duration-300",
            scrolled ? "text-foreground hover:bg-foreground/5" : "text-background hover:bg-background/10"
          )}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm p-0">
        <div className="flex h-full flex-col">
          <div className="border-b border-border/60 px-6 py-5">
            <Image
              src="/images/logo-02.png"
              alt="House of Thazhuval"
              width={220}
              height={156}
              className="h-20 w-auto"
              priority
            />
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              The Embrace
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <SheetClose asChild>
              <Link href="/" className="mb-4 block font-serif text-base">
                Home
              </Link>
            </SheetClose>
            <Accordion type="single" collapsible className="w-full">
              {categories.map((cat) => (
                <AccordionItem key={cat.title} value={cat.title}>
                  <AccordionTrigger className="font-serif text-base normal-case tracking-normal">
                    {cat.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-3 pl-1">
                      {cat.items.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="text-sm text-foreground/80 hover:text-foreground"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 space-y-4">
              <SheetClose asChild>
                <Link href="/our-story" className="block font-serif text-base">
                  Our Story
                </Link>
              </SheetClose>
            </div>
          </div>
          <div className="border-t border-border/60 px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Contact Us
            </p>
            <p className="mt-2 font-serif text-sm">
              houseofthazhuval@gmail.com
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
