import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        Page Not Found
      </p>
      <h1 className="mt-5 font-serif text-5xl tracking-tight md:text-6xl">404</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/"
          className="bg-foreground px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-foreground/90"
        >
          Back to Home
        </Link>
        <Link
          href="/collections/all-sarees"
          className="border border-foreground px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Browse Sarees
        </Link>
      </div>
    </main>
  )
}
