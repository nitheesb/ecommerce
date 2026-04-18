import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "Silk Sarees", href: "/collections/silk" },
      { label: "Cotton Sarees", href: "/collections/cotton" },
      { label: "Heritage Sarees", href: "/collections/heritage" },
      { label: "Bridal", href: "/collections/bridal" },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "House of Thazhuval",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "The Artisans", href: "/artisans" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Private Consultations", href: "/consultations" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Saree Care", href: "/care" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.3fr_2fr] md:gap-20">
          <div>
            <Link href="/" className="inline-flex items-baseline gap-2">
              <span className="font-serif text-4xl leading-none tracking-tight">Thazhuval</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-background/60">
                Est. 2019
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-pretty text-base leading-relaxed text-background/70">
              House of Thazhuval &mdash; a sanctuary for the handwoven saree. We preserve the quiet
              art of the embrace, one thread at a time.
            </p>
            <form className="mt-10 max-w-sm">
              <label
                htmlFor="newsletter"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-background/60"
              >
                Letters from the Loom
              </label>
              <div className="mt-3 flex items-center gap-0 border-b border-background/40 focus-within:border-background">
                <input
                  id="newsletter"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent py-2 text-sm text-background placeholder:text-background/50 focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-background hover:bg-background/10 hover:text-background"
                >
                  Subscribe
                </Button>
              </div>
              <p className="mt-3 text-xs text-background/50">
                Stories, new arrivals, and invitations to private previews.
              </p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-background/60">
                  {col.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-background/85 underline-offset-4 transition-colors hover:text-background hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12 bg-background/15" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-background/60 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} House of Thazhuval. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-background">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-background">
              Terms
            </Link>
            <Link href="/accessibility" className="hover:text-background">
              Accessibility
            </Link>
            <span className="uppercase tracking-[0.28em]">Crafted in India</span>
            <span>Designed by nitheesbalaji</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
