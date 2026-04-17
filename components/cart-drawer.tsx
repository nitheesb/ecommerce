"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { formatCurrency } from "@/lib/utils"

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count } = useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <div className="flex flex-row items-center justify-between border-b border-border/60 px-6 py-5">
          <h2 className="font-serif text-xl tracking-tight">
            Your Bag{" "}
            <span className="ml-1 text-sm font-sans font-normal text-muted-foreground">({count})</span>
          </h2>
        </div>

        {items.length === 0 ? (
          <EmptyCart onClose={() => setOpen(false)} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="flex flex-col gap-6">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {item.category}
                          </p>
                          <p className="mt-1 font-serif text-base leading-tight">{item.name}</p>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="inline-flex items-center border border-border/80">
                          <button
                            onClick={() => setQty(item.id, item.quantity - 1)}
                            className="px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQty(item.id, item.quantity + 1)}
                            className="px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-base">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/60 bg-secondary/40 px-6 py-5">
              <div className="flex items-center justify-between pb-1">
                <span className="font-sans text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-xl">{formatCurrency(subtotal)}</span>
              </div>
              <p className="pb-4 text-xs text-muted-foreground">
                Shipping & taxes calculated at checkout.
              </p>
              <Separator className="mb-4" />
              <div className="flex flex-col gap-2">
                <Button size="lg" className="w-full">
                  Checkout
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-secondary/70" aria-hidden />
        <div
          className="absolute inset-2 rounded-full border border-dashed border-border"
          aria-hidden
        />
        <ShoppingBag className="relative h-8 w-8 text-muted-foreground" strokeWidth={1.25} />
      </div>
      <h3 className="mt-6 font-serif text-2xl tracking-tight">Your bag awaits.</h3>
      <p className="mt-2 max-w-xs text-balance text-sm leading-relaxed text-muted-foreground">
        Every heirloom begins with a single thread. Discover sarees woven with soul, stitched with story.
      </p>
      <Button asChild className="mt-8" size="lg" onClick={onClose}>
        <Link href="/collections/silk">Explore the Collection</Link>
      </Button>
      <Link
        href="/heritage"
        onClick={onClose}
        className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Read our story
      </Link>
    </div>
  )
}
