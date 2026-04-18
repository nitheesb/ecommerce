export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground" />
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  )
}
