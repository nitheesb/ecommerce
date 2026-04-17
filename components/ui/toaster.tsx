"use client"
import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "bg-background border border-border text-foreground font-sans rounded-none shadow-xl",
          title: "text-sm tracking-wide",
          description: "text-xs text-muted-foreground",
        },
      }}
    />
  )
}
