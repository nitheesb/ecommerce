import Image from "next/image"
import Link from "next/link"

export function HeroMobile() {
  return (
    <section className="relative md:hidden" aria-label="Welcome to House of Thazhuval">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/images/hero-cover.jpg"
          alt="A woman in a red and gold saree standing in a golden mustard field"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-foreground/55 via-foreground/28 to-foreground/82"
        />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 pt-24 text-background animate-fade-up">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-background/80">
            House of Thazhuval
          </p>
          <h1 className="mt-4 max-w-xs font-serif text-4xl leading-[1.02] tracking-[-0.02em]">
            Sarees with
            <br />
            <span className="text-[hsl(var(--sand))]">quiet grandeur.</span>
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/82">
            Thoughtful drapes and heirloom weaves for days that ask for softness and presence.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/collections/all-sarees"
              className="bg-background px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-background/90"
            >
              Shop now
            </Link>
            <Link
              href="/our-story"
              className="border border-background/50 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-background transition-colors hover:bg-background/10"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
