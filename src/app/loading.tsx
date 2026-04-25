import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-logo-breathe">
          <Image
            src="/images/logo-02.png"
            alt="House of Thazhuval"
            width={420}
            height={296}
            priority
            className="h-36 w-auto sm:h-44 md:h-52 lg:h-56"
          />
        </div>
        <p className="animate-thread-text text-[11px] font-serif uppercase tracking-[0.32em] text-muted-foreground">
          Thazhuval
        </p>
      </div>
    </div>
  )
}
