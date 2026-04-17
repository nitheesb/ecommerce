import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-foreground text-background",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline:
          "text-foreground border-foreground/20 bg-background/70 backdrop-blur",
        gold: "border-transparent bg-[hsl(var(--gold))] text-background",
        heritage:
          "border-transparent bg-[hsl(var(--slate-deep))] text-background",
        sand: "border-transparent bg-sand text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
