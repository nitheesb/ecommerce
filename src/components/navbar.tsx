"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, User, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { categories } from "@/lib/products"

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:h-16 md:px-8">
        {/* Left: Mobile menu + desktop nav */}
        <div className="flex items-center gap-1">
          <MobileNav scrolled={scrolled} />
          <nav className="hidden items-center gap-0.5 lg:flex">
            {categories.map((cat) => (
              <button
                key={cat.title}
                onMouseEnter={() => setOpenMenu(cat.title)}
                onFocus={() => setOpenMenu(cat.title)}
                className={cn(
                  "relative px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                  openMenu === cat.title
                    ? textColor
                    : cn(textMuted, scrolled ? "hover:text-foreground" : "hover:text-background")
                )}
                aria-expanded={openMenu === cat.title}
              >
                {cat.title}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-px transition-transform duration-300 origin-left",
                    scrolled ? "bg-foreground" : "bg-background",
                    openMenu === cat.title ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            ))}
            <Link
              href="/atelier"
              className={cn(
                "px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                textMuted,
                scrolled ? "hover:text-foreground" : "hover:text-background"
              )}
            >
              Atelier
            </Link>
            <Link
              href="/journal"
              className={cn(
                "px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                textMuted,
                scrolled ? "hover:text-foreground" : "hover:text-background"
              )}
            >
              Journal
            </Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 select-none text-center"
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
            House of the Embrace
          </div>
        </Link>

        {/* Right: actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className={cn("h-9 w-9 transition-colors duration-300", textColor, iconHover)}
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account"
            className={cn("hidden h-9 w-9 transition-colors duration-300 md:inline-flex", textColor, iconHover)}
          >
            <User className="h-[17px] w-[17px]" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className={cn("snipcart-checkout relative h-9 w-9 transition-colors duration-300", textColor, iconHover)}
          >
            <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
            <span className="snipcart-items-count absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-medium leading-none text-background" />
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
      className={cn(
        "absolute inset-x-0 top-full hidden overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur-xl transition-all duration-500 lg:block",
        openMenu
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      )}
      onMouseLeave={onClose}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-8 py-12">
        {active && (
          <>
            <div className="col-span-3">
              <p className="font-serif text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                {active.title}
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-balance">
                {active.blurb}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                A curated selection of our finest {active.title.toLowerCase()}{" "}
                weaves, hand-picked by our atelier.
              </p>
              <Link
                href={active.href}
                className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] hover:text-foreground/70"
              >
                Shop all {active.title}
                <span aria-hidden>—</span>
              </Link>
            </div>

            <div className="col-span-4">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                By Weave
              </p>
              <ul className="space-y-3">
                {active.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between border-b border-transparent py-1 font-serif text-lg transition-colors hover:border-foreground/30"
                    >
                      {item.label}
                      <span className="translate-x-[-4px] text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                        —
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-5 grid grid-cols-2 gap-4">
              <Link
                href={active.href}
                className="group relative block overflow-hidden bg-muted"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/saree-4-a.jpg"
                    alt="Featured bridal Kanjeevaram"
                    fill
                    sizes="(max-width: 1024px) 0vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-x-5 bottom-5 text-background">
                  <p className="text-[10px] uppercase tracking-[0.28em] opacity-80">
                    The Bridal Edit
                  </p>
                  <p className="mt-1 font-serif text-lg">Anaika, in ivory</p>
                </div>
              </Link>
              <Link
                href="/collections/heritage/patola"
                className="group relative block overflow-hidden bg-muted"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/saree-7-a.jpg"
                    alt="Featured Patola heritage weave"
                    fill
                    sizes="(max-width: 1024px) 0vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-x-5 bottom-5 text-background">
                  <p className="text-[10px] uppercase tracking-[0.28em] opacity-80">
                    Limited Edition
                  </p>
                  <p className="mt-1 font-serif text-lg">The Patan Archive</p>
                </div>
              </Link>
            </div>
          </>
        )}
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
              The Art of the Embrace
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
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
                <Link href="/atelier" className="block font-serif text-base">
                  Atelier
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/journal" className="block font-serif text-base">
                  Journal
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/appointment" className="block font-serif text-base">
                  Book an Appointment
                </Link>
              </SheetClose>
            </div>
          </div>
          <div className="border-t border-border/60 px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Concierge
            </p>
            <p className="mt-2 font-serif text-sm">
              +91 80 4567 8901 · care@thazhuval.com
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
