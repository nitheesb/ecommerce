import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      aria-label="The Art of the Embrace"
      className="relative -mt-16 flex min-h-[100svh] items-center justify-center overflow-hidden md:-mt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-kenburns">
          <Image
            src="/images/hero.jpg"
            alt="An editorial portrait of a woman draped in an ivory silk saree"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Subtle cinematic vignette */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(17,22,30,0.35)_100%)]"
        />
      </div>

      {/* Top hairline + eyebrow */}
      <div className="absolute inset-x-0 top-24 z-10 flex justify-center md:top-28">
        <div className="flex items-center gap-4 text-background/85">
          <span className="h-px w-10 bg-background/70" />
          <span className="text-[10px] font-medium uppercase tracking-[0.42em]">
            Autumn / Winter Edit · MMXXVI
          </span>
          <span className="h-px w-10 bg-background/70" />
        </div>
      </div>

      {/* Centered copy */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-background animate-fade-up">
        <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.015em] md:text-7xl lg:text-[88px] text-balance">
          The Art of the
          <span className="block italic text-[hsl(var(--sand))]">Embrace</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-background/85 md:text-base text-pretty">
          Heirloom sarees, hand-woven by master artisans. Each weave a quiet
          embrace — of memory, of ritual, of the wearer.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" variant="ivory" className="min-w-[220px]">
            <Link href="/collections/heritage">Explore the Heritage Edit</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-w-[200px] border-background/70 text-background hover:bg-background hover:text-foreground"
          >
            <Link href="/collections/silk">Shop Silk</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-background/85">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.38em]">Scroll</span>
          <div className="relative h-10 w-[18px] rounded-full border border-background/60">
            <span className="absolute left-1/2 top-2 h-1.5 w-[2px] -translate-x-1/2 rounded-full bg-background/85 animate-scroll-indicator" />
          </div>
        </div>
      </div>
    </section>
  )
}
