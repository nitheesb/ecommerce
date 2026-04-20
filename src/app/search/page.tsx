import type { Metadata } from "next"
import { Search as SearchIcon } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"

export const metadata: Metadata = {
  title: "Search",
  description: "Search House of Thazhuval for sarees, collections, and more.",
}

export default function SearchPage() {
  return (
    <InnerPageShell>
        <section className="mx-auto max-w-2xl px-6 py-16 lg:px-12 lg:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Search" },
            ]}
            className="mb-8"
          />
          <h1 className="text-center font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Search
          </h1>
          <div className="mt-8 flex items-center gap-3 border-b border-foreground/20 pb-3 focus-within:border-foreground">
            <SearchIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search for sarees, fabrics, colors..."
              className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Try searching for &ldquo;silk&rdquo;, &ldquo;cotton&rdquo;, or &ldquo;festive&rdquo;
          </p>
        </section>
    </InnerPageShell>
  )
}
