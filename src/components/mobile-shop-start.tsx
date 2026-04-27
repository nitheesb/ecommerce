import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { categories } from "@/lib/products"

const categoryImages: Record<(typeof categories)[number]["title"], string> = {
  Sarees: "/images/saree-1-a.jpg",
  "Shop by Prints": "/images/saree-6-b.jpg",
  "Shop by Occasion": "/images/saree-4-a.jpg",
  "Shop by Colors": "/images/saree-3-a.jpg",
}

export function MobileShopStart() {
  return (
    <section className="border-b border-border/40 bg-background px-4 pb-5 pt-4 md:hidden">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Start shopping
          </p>
          <h2 className="mt-1 font-serif text-2xl leading-tight">
            Browse the house
          </h2>
        </div>
        <Link
          href="/collections/all-sarees"
          className="inline-flex items-center gap-1 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground"
        >
          All sarees
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl bg-foreground text-background"
          >
            <Image
              src={categoryImages[category.title]}
              alt=""
              fill
              sizes="144px"
              className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/84 via-foreground/24 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-background/68">
                {category.items.length} paths
              </p>
              <h3 className="mt-1 font-serif text-lg leading-none">
                {category.title.replace("Shop by ", "")}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
