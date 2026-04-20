export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Silk thread drawing animation */}
        <svg
          viewBox="0 0 120 60"
          className="h-16 w-32 animate-thread-draw"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 45 Q30 5, 50 30 T90 25 Q100 20, 110 30"
            stroke="hsl(var(--gold))"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="thread-path"
          />
          <path
            d="M5 50 Q25 10, 45 35 T85 30 Q95 25, 115 20"
            stroke="hsl(var(--gold))"
            strokeWidth="0.8"
            strokeLinecap="round"
            className="thread-path-secondary"
            opacity="0.4"
          />
        </svg>
        <p className="animate-thread-text text-[11px] font-serif uppercase tracking-[0.32em] text-muted-foreground">
          Thazhuval
        </p>
      </div>
    </div>
  )
}
