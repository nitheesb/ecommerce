import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Silk",
    tagline: "Kanchipuram · Banaras · Chanderi",
    image: "/images/saree-1-a.jpg",
    href: "/collections/silk",
  },
  {
    name: "Cotton",
    tagline: "Handloom · Jamdani · Khadi",
    image: "/images/saree-2-a.jpg",
    href: "/collections/cotton",
  },
  {
    name: "Heritage",
    tagline: "Patola · Paithani · Baluchari",
    image: "/images/saree-7-a.jpg",
    href: "/collections/heritage",
  },
]

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            The Collections
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            A weave for every chapter
            <br className="hidden md:block" />
            <span className="italic text-muted-foreground">of your life.</span>
          </h2>
        </div>
        <Link
          href="/collections"
          className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
        >
          Explore All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative block overflow-hidden bg-muted"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={cat.image || "/placeholder.svg"}
                alt={`${cat.name} saree collection`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent"
                aria-hidden
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-background md:p-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-background/80">
                  {cat.tagline}
                </p>
                <h3 className="mt-2 font-serif text-3xl leading-none tracking-tight md:text-4xl">
                  {cat.name}
                </h3>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-background/50 bg-background/10 backdrop-blur transition-all group-hover:bg-background group-hover:text-foreground">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
