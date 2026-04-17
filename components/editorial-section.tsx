import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function EditorialSection() {
  return (
    <section className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 lg:px-12 lg:py-28">
        <div className="relative order-2 aspect-[4/5] overflow-hidden md:order-1">
          <Image
            src="/images/editorial-2.jpg"
            alt="Artisan weaver at a traditional handloom"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute bottom-6 left-6 rounded-sm bg-background/90 px-4 py-3 backdrop-blur">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Chapter I
            </p>
            <p className="font-serif text-lg">The Hands Behind the Weave</p>
          </div>
        </div>
        <div className="order-1 flex flex-col justify-center md:order-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            The Art of the Embrace
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Six yards of poetry, woven across generations.
          </h2>
          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Every Thazhuval saree is a quiet conversation between the weaver and the wearer. We work
            directly with master craftsmen across Kanchipuram, Banaras, and Chanderi — preserving
            techniques that are centuries old, and stories that are uniquely yours.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <Link
              href="/heritage"
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
            >
              Our Heritage
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/artisans"
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground underline-offset-8 hover:text-foreground hover:underline"
            >
              Meet the Artisans
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border/60 pt-10">
            <div>
              <p className="font-serif text-3xl tracking-tight">42</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Master Weavers
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl tracking-tight">1,200+</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Hours per Saree
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl tracking-tight">12</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Heritage Regions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
