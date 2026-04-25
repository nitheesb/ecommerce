import Image from "next/image"
import Link from "next/link"

export function HeroMobile() {
  return (
    <section className="relative -mt-14 md:hidden" aria-label="Welcome to House of Thazhuval">
      {/* Background image — compact, not full viewport */}
      <div className="relative h-[55vh] min-h-[360px] max-h-[480px] overflow-hidden">
        <Image
          src="/images/hero-cover.jpg"
          alt="A woman in a red and gold saree standing in a golden mustard field"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Vignette overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-foreground/75"
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center text-background animate-fade-up">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-background/80">
            House of Thazhuval
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-[1.08] tracking-[-0.01em]">
            More than a saree...
            <br />
            <span className="italic text-[hsl(var(--sand))]">it&apos;s an embrace.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-background/80">
            Soft fabrics, thoughtful craftsmanship, pieces that hold you.
          </p>
          <Image
            src="/images/logo-03.png"
            alt="The comfort that embraces you"
            width={520}
            height={72}
            priority
            className="mx-auto mt-5 h-auto w-[min(82vw,360px)] select-none [filter:invert(1)_brightness(1.05)]"
          />
          <div className="mt-5 flex gap-3">
            <Link
              href="/collections/all-sarees"
              className="bg-background px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-background/90"
            >
              Shop Now
            </Link>
            <Link
              href="/our-story"
              className="border border-background/50 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-background transition-colors hover:bg-background/10"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
