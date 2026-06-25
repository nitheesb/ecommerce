"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCartStore } from "@/hooks/use-cart-store";
import { cn, formatCurrency } from "@/lib/utils";

type CheckoutStep = "cart" | "delivery" | "success";
type DeliveryDetails = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  website: string;
};

const initialDetails: DeliveryDetails = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  website: "",
};

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout() {
  if (typeof window === "undefined") return Promise.reject(new Error("Checkout is unavailable."));
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    const script = existing ?? document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Secure checkout could not be loaded. Please try again."));
    };
    if (!existing) document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export function CartDrawer() {
  const open = useCartStore((state) => state.open);
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const remove = useCartStore((state) => state.remove);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clear = useCartStore((state) => state.clear);
  const [step, setStep] = React.useState<CheckoutStep>("cart");
  const [details, setDetails] = React.useState<DeliveryDetails>(initialDetails);
  const [loading, setLoading] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState("");
  const paymentActiveRef = React.useRef(false);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  React.useEffect(() => {
    if (paymentActiveRef.current) return;
    if (!open && step !== "success") setStep("cart");
  }, [open, step]);

  function releaseCheckoutDrawer() {
    paymentActiveRef.current = true;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setOpen(false);
  }

  function restoreCheckoutDrawer() {
    if (!paymentActiveRef.current) return;
    paymentActiveRef.current = false;
    setLoading(false);
    setStep("delivery");
    setOpen(true);
  }

  function updateDetails(event: React.ChangeEvent<HTMLInputElement>) {
    setDetails((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function startCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length || loading) return;
    setLoading(true);

    try {
      await loadRazorpayCheckout();
      const orderResponse = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantSku: item.variant?.sku,
            quantity: item.quantity,
          })),
          customer: { name: details.name, email: details.email, phone: details.phone },
          shippingAddress: {
            line1: details.line1,
            line2: details.line2,
            city: details.city,
            state: details.state,
            postalCode: details.postalCode,
            country: details.country,
          },
          website: details.website,
        }),
      });
      const order = (await orderResponse.json()) as {
        error?: string;
        keyId: string;
        orderId: string;
        orderNumber: string;
        amount: number;
        currency: string;
      };
      if (!orderResponse.ok) throw new Error(order.error || "Checkout could not be started.");
      if (!window.Razorpay) throw new Error("Secure checkout is unavailable.");

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "House of Thazhuval",
        description: `Order ${order.orderNumber}`,
        order_id: order.orderId,
        prefill: { name: details.name, email: details.email, contact: details.phone },
        notes: { orderNumber: order.orderNumber },
        theme: { color: "#26313b" },
        modal: { ondismiss: restoreCheckoutDrawer },
        handler: async (payment) => {
          try {
            const verificationResponse = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payment),
            });
            const verification = (await verificationResponse.json()) as {
              verified?: boolean;
              error?: string;
            };
            if (!verificationResponse.ok || !verification.verified) {
              throw new Error(verification.error || "Payment verification failed.");
            }

            setOrderNumber(order.orderNumber);
            clear();
            paymentActiveRef.current = false;
            setStep("success");
            setOpen(true);
            toast.success("Payment received", {
              description: "Your order confirmation will arrive by email shortly.",
            });
          } catch (error) {
            restoreCheckoutDrawer();
            toast.error(error instanceof Error ? error.message : "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
      });

      releaseCheckoutDrawer();
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      checkout.open();
    } catch (error) {
      if (paymentActiveRef.current) {
        restoreCheckoutDrawer();
      } else {
        setLoading(false);
      }
      toast.error(error instanceof Error ? error.message : "Checkout could not be started.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        title="Shopping bag"
        description="Review your cart and enter delivery details to continue to secure payment."
        className="flex w-full flex-col overflow-hidden border-l-border/70 bg-[#fbf8f1] p-0 sm:max-w-[540px]"
      >
        <div className="border-b border-border/70 px-6 pb-5 pt-7 sm:px-8">
          {step === "delivery" && (
            <button
              type="button"
              onClick={() => setStep("cart")}
              className="mb-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to cart
            </button>
          )}
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {step === "success" ? "Order confirmed" : step === "delivery" ? "Secure checkout" : "Your selections"}
          </p>
          <div className="mt-2 flex items-end justify-between gap-4 pr-8">
            <h2 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl">
              {step === "success" ? "Thank you." : step === "delivery" ? "Delivery details." : "Shopping bag."}
            </h2>
            {step === "cart" && count > 0 && (
              <span className="text-xs text-muted-foreground">{count} {count === 1 ? "piece" : "pieces"}</span>
            )}
          </div>
        </div>

        {step === "success" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <Check className="h-7 w-7" />
            </div>
            <p className="mt-7 max-w-sm text-base leading-7 text-muted-foreground">
              Payment was verified for <strong className="font-medium text-foreground">{orderNumber}</strong>. We will email your confirmation and keep you updated as your saree is prepared.
            </p>
            <button
              type="button"
              onClick={() => {
                setDetails(initialDetails);
                setStep("cart");
                setOpen(false);
              }}
              className="mt-8 rounded-full bg-foreground px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-background"
            >
              Continue shopping
            </button>
          </div>
        ) : step === "delivery" ? (
          <form onSubmit={startCheckout} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Contact</legend>
                <CheckoutInput label="Full name" name="name" value={details.name} onChange={updateDetails} autoComplete="name" className="sm:col-span-2" />
                <CheckoutInput label="Email" name="email" value={details.email} onChange={updateDetails} type="email" autoComplete="email" />
                <CheckoutInput label="Phone" name="phone" value={details.phone} onChange={updateDetails} type="tel" autoComplete="tel" />
              </fieldset>
              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Delivery address</legend>
                <CheckoutInput label="Address" name="line1" value={details.line1} onChange={updateDetails} autoComplete="address-line1" className="sm:col-span-2" />
                <CheckoutInput label="Apartment, landmark (optional)" name="line2" value={details.line2} onChange={updateDetails} autoComplete="address-line2" required={false} className="sm:col-span-2" />
                <CheckoutInput label="City" name="city" value={details.city} onChange={updateDetails} autoComplete="address-level2" />
                <CheckoutInput label="State" name="state" value={details.state} onChange={updateDetails} autoComplete="address-level1" />
                <CheckoutInput label="PIN code" name="postalCode" value={details.postalCode} onChange={updateDetails} inputMode="numeric" autoComplete="postal-code" />
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Country</span>
                  <div className="h-12 border border-border/80 bg-muted/30 px-4 py-3 text-sm text-foreground">India</div>
                </div>
              </fieldset>
              <input className="hidden" tabIndex={-1} autoComplete="off" name="website" value={details.website} onChange={updateDetails} />
            </div>
            <div className="border-t border-border/70 bg-background/70 px-6 py-5 backdrop-blur sm:px-8">
              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-foreground text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-opacity disabled:opacity-60"
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? "Opening secure payment" : "Continue to secure payment"}
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">Final stock, price, and shipping are verified securely before Razorpay opens.</p>
            </div>
          </form>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag className="h-10 w-10 stroke-[1.2] text-muted-foreground" />
            <p className="mt-5 font-serif text-2xl">Your bag is waiting.</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Explore the house and choose a saree that feels like yours.</p>
            <Link href="/collections/all" onClick={() => setOpen(false)} className="mt-7 border-b border-foreground pb-1 text-[10px] font-medium uppercase tracking-[0.22em]">Browse sarees</Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-3 sm:px-8">
              {items.map((item) => (
                <article key={`${item.productId}-${item.variant?._key ?? "base"}`} className="grid grid-cols-[92px_1fr] gap-4 border-b border-border/70 py-5">
                  <Link href={`/product/${item.slug}`} onClick={() => setOpen(false)} className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-muted">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="92px" className="object-cover object-top" />
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${item.slug}`} onClick={() => setOpen(false)} className="font-serif text-xl leading-tight hover:opacity-70">{item.title}</Link>
                        {item.variant && <p className="mt-1 text-xs text-muted-foreground">{[item.variant.color, item.variant.size].filter(Boolean).join(" · ")}</p>}
                      </div>
                      <button type="button" onClick={() => remove(item.productId, item.variant?._key)} aria-label={`Remove ${item.title}`} className="p-1 text-muted-foreground transition-colors hover:text-foreground"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <p className="mt-2 text-sm font-medium">{formatCurrency(item.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex h-9 items-center rounded-full border border-border bg-background">
                        <QuantityButton label={`Decrease ${item.title} quantity`} onClick={() => setQuantity(item.productId, item.quantity - 1, item.variant?._key)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></QuantityButton>
                        <span className="w-7 text-center text-xs tabular-nums">{item.quantity}</span>
                        <QuantityButton label={`Increase ${item.title} quantity`} onClick={() => setQuantity(item.productId, item.quantity + 1, item.variant?._key)} disabled={item.quantity >= Math.min(10, item.stockQuantity ?? 10)}><Plus className="h-3 w-3" /></QuantityButton>
                      </div>
                      <p className="text-sm font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="border-t border-border/70 bg-background/75 px-6 py-5 backdrop-blur sm:px-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <strong className="text-base font-medium tabular-nums">{formatCurrency(subtotal)}</strong>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Shipping is confirmed from your delivery details.</p>
              <button type="button" onClick={() => setStep("delivery")} className="mt-5 h-14 w-full rounded-full bg-foreground text-[11px] font-medium uppercase tracking-[0.22em] text-background">Continue to checkout</button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Secure payment by Razorpay</div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CheckoutInput({ label, className, required = true, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-xs text-muted-foreground">{label}</span>
      <input required={required} className="h-12 w-full rounded-none border-0 border-b border-border bg-transparent px-0 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground" {...props} />
    </label>
  );
}

function QuantityButton({ label, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button type="button" aria-label={label} className={cn("flex h-9 w-8 items-center justify-center transition-opacity disabled:opacity-25", className)} {...props} />;
}
