import Image from "next/image"

const chapters = [
  {
    label: "Chapter I",
    title: "Where It Begins",
    image: "/images/hero.jpg",
    alt: "Raw silk threads in golden light",
    text: "Every saree begins as a single thread — raw, humble, full of possibility. Sourced from the finest regions of India, each fibre carries the promise of something extraordinary.",
  },
  {
    label: "Chapter II",
    title: "The Hands Behind the Weave",
    image: "/images/editorial-2.jpg",
    alt: "Master weaver working on a traditional loom",
    text: "In the hands of master weavers, threads become poetry. Each pattern is a language passed down through generations — one shuttle, one row, one story at a time.",
  },
  {
    label: "Chapter III",
    title: "From Loom to Life",
    image: "/images/editorial-1.jpg",
    alt: "Saree fabric being finished by artisan hands",
    text: "Dyeing, finishing, folding — each step is guided by care, patience, and a deep love for the craft. No shortcuts, no compromises, just devotion to the art.",
  },
  {
    label: "Chapter IV",
    title: "Six Yards of Belonging",
    image: "/images/saree-4-a.jpg",
    alt: "Woman draped in an elegant Kanjeevaram saree",
    text: "More than a saree — it's an embrace. Six yards of comfort, tradition, and individuality. When you drape a Thazhuval, you carry a piece of someone's heart.",
  },
]

export function WeaveJourney() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 border-b border-border/40 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              The weave journey
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
              From first thread to final drape
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            The story is easier to follow as a sequence of still moments than as a pinned horizontal animation.
          </p>
        </div>

        <div className="space-y-8">
          {chapters.map((ch, i) => (
            <article
              key={ch.title}
              className="grid gap-6 rounded-[32px] border border-border/50 bg-secondary/20 p-5 md:grid-cols-[0.95fr_1.05fr] md:items-center md:p-6 lg:gap-10 lg:p-8"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-muted">
                  <Image
                    src={ch.image}
                    alt={ch.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  {ch.label}
                </p>
                <h3 className="mt-4 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                  {ch.title}
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                  {ch.text}
                </p>
                {i === chapters.length - 1 && (
                  <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/60">
                    This is Thazhuval.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
