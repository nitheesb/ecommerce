"use client"

import { useState } from "react"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { label: "Search", href: "/search" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Information", href: "/contact" },
]

export function Footer() {
  const [email, setEmail] = useState("")

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    toast.success("Thank you for subscribing!", {
      description: "You\u2019ll hear from us soon.",
    })
    setEmail("")
  }

  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-16">
          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium text-background">Quick Links</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 underline-offset-4 transition-colors hover:text-background hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-base font-medium text-background">Contact Us</h3>
            <a
              href="mailto:houseofthazhuval@gmail.com"
              className="mt-5 block text-sm text-background/70 underline-offset-4 transition-colors hover:text-background hover:underline"
            >
              houseofthazhuval@gmail.com
            </a>
          </div>

          {/* Our Mission */}
          <div>
            <h3 className="text-base font-medium text-background">Our Mission</h3>
            <p className="mt-5 text-sm leading-relaxed text-background/70">
              To create handcrafted sarees that celebrate tradition, craftsmanship, and
              individuality &mdash; bringing timeless elegance and comfort to every woman.
            </p>
          </div>
        </div>

        <Separator className="my-10 bg-background/15" />

        {/* Subscribe + Instagram */}
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <form className="w-full max-w-sm" onSubmit={handleSubscribe}>
            <p className="text-sm font-medium text-background">Subscribe to our emails</p>
            <div className="mt-3 flex items-center gap-0 border border-background/40 focus-within:border-background">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-background placeholder:text-background/50 focus:outline-none"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="shrink-0 px-3 text-background hover:bg-background/10 hover:text-background"
                aria-label="Subscribe"
              >
                &rarr;
              </Button>
            </div>
          </form>

          <a
            href="https://instagram.com/houseofthazhuval"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-background/70 transition-colors hover:text-background"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>

        <div className="mt-8 text-xs text-background/50">
          <p>&copy; {new Date().getFullYear()} House of Thazhuval. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
