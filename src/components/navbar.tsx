"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { categories } from "@/lib/products"

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = React.useState(solid)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)

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

  const textColor = scrolled ? "text-foreground" : "text-background"
  const textMuted = scrolled ? "text-foreground/70" : "text-background/70"
  const iconHover = scrolled ? "hover:bg-foreground/5" : "hover:bg-background/10"

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 border-b border-border/40 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
          : "bg-transparent"
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:h-16 md:px-8">
        {/* Left: Mobile menu + desktop nav */}
        <div className="flex items-center gap-1">
          <MobileNav scrolled={scrolled} />
          <nav className="hidden items-center gap-0.5 lg:flex">
            <Link
              href="/"
              onMouseEnter={() => setOpenMenu(null)}
              className={cn(
                "px-2 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
                textMuted,
                scrolled ? "hover:text-foreground" : "hover:text-background"
              )}
            >
              Home
            </Link>
            {categories.map((cat) =>
              cat.items.length > 0 ? (
                <button
                  key={cat.title}
                  onMouseEnter={() => setOpenMenu(cat.title)}
                  onFocus={() => setOpenMenu(cat.title)}
                  aria-haspopup="true"
                  className={cn(
                    "relative whitespace-nowrap px-2 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
                    openMenu === cat.title
                      ? textColor
                      : cn(textMuted, scrolled ? "hover:text-foreground" : "hover:text-background")
                  )}
                  aria-expanded={openMenu === cat.title}
                >
                  {cat.title}
                  <span
                    className={cn(
                      "absolute inset-x-2 -bottom-0.5 h-px transition-transform duration-300 origin-left",
                      scrolled ? "bg-foreground" : "bg-background",
                      openMenu === cat.title ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              ) : (
                <Link
                  key={cat.title}
                  href={cat.href}
                  onMouseEnter={() => setOpenMenu(null)}
                  className={cn(
                    "whitespace-nowrap px-2 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
                    textMuted,
                    scrolled ? "hover:text-foreground" : "hover:text-background"
                  )}
                >
                  {cat.title}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="select-none px-6 text-center"
          aria-label="Thazhuval home"
        >
          <div
            className={cn(
              "font-serif text-[20px] leading-none tracking-[0.22em] transition-colors duration-500 md:text-[24px]",
              textColor
            )}
          >
            THAZHUVAL
          </div>
          <div
            className={cn(
              "mt-0.5 hidden text-[8px] uppercase tracking-[0.4em] transition-all duration-500 md:block",
              scrolled
                ? "text-muted-foreground opacity-100"
                : "text-background/60 opacity-0"
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
              "hidden whitespace-nowrap px-2.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 lg:inline-flex",
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
            className={cn("h-9 w-9 transition-colors duration-300", textColor, iconHover)}
          >
            <Link href="/search">
              <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className={cn("snipcart-checkout relative h-9 w-9 transition-colors duration-300", textColor, iconHover)}
          >
            <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
            <span className={cn(
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
  const active = categories.find((c) => c.title === openMenu)

  return (
    <div
      role="menu"
      className={cn(
        "transition-all duration-300 ease-out",
        openMenu
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      )}
      onMouseLeave={onClose}
    >
      {/* Dark frosted panel */}
      <div className="border-b border-background/10 bg-foreground/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-start gap-16 px-8 py-8">
          {active && (
            <>
              {/* Left: category + shop all link */}
              <div className="min-w-[160px] shrink-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/50">
                  {active.title}
                </p>
                <Link
                  href={active.href}
                  className="mt-3 inline-flex items-center gap-2 font-serif text-lg text-background transition-colors hover:text-background/70"
                >
                  Shop All
                  <span className="text-background/40" aria-hidden>→</span>
                </Link>
              </div>

              {/* Vertical separator */}
              <div className="h-20 w-px bg-background/10 self-center" />

              {/* Right: weave links in a horizontal flow */}
              <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3">
                {active.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-background/70 transition-colors duration-200 hover:text-background"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          )}
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
            <p className="font-serif text-lg tracking-[0.22em]">THAZHUVAL</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
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
