# Payments, Orders, Notifications, and SEO

This guide is the production operating checklist for House of Thazhuval. Never paste API secrets into source files, Sanity fields, browser code, Git commits, or support messages.

## Current Checkout Status

The storefront currently uses Snipcart for its visible cart and checkout. The repository now also contains the secure Razorpay order APIs, signed webhook handler, Sanity `Order` schema, inventory adjustment, and Resend notification logic.

Do not remove Snipcart or enable a live Razorpay button until the Razorpay **Test Mode** checkout has completed the test checklist below. The `razorpay.me` payment handle is useful for manual payments, but it is not the ecommerce checkout because it does not securely bind a payment to server-validated cart prices and inventory.

## Razorpay Dashboard Setup

1. Complete Razorpay account activation/KYC and bank-account verification.
2. Switch the Dashboard to **Test Mode**.
3. Open **Account & Settings → API Keys** and generate a test Key ID and Key Secret.
4. Add the environment variables listed below to `.env.local` and to the Vercel Preview environment.
5. In Razorpay payment capture settings, use automatic capture. A successful browser response is not enough; the order becomes paid only from a signed capture webhook.
6. Add this test webhook URL in Razorpay:

```text
https://YOUR-VERCEL-PREVIEW-DOMAIN/api/webhooks/razorpay
```

7. Generate a strong, unique webhook secret in Razorpay and save the same value as `RAZORPAY_WEBHOOK_SECRET` in Vercel.
8. Subscribe the webhook to `order.paid` and `payment.failed`. The code also safely understands `payment.captured`, but subscribing to both success events is unnecessary.
9. After the complete test checklist passes, switch Razorpay to **Live Mode**, generate separate live keys, add the live production webhook `https://thazhuval.com/api/webhooks/razorpay`, and replace only the Production environment values in Vercel.

Official references:

- https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
- https://razorpay.com/docs/webhooks/
- https://razorpay.com/docs/webhooks/payments/
- https://razorpay.com/docs/payments/dashboard/test-live-modes/?preferred-country=IN

## Required Environment Variables

```bash
# Public identifier. Safe for Razorpay Checkout, but still manage it through Vercel.
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

# Server-only secrets. Never prefix these with NEXT_PUBLIC_.
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
SANITY_API_TOKEN=...

# Paid-order emails
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=House of Thazhuval <orders@thazhuval.com>
RESEND_REPLY_TO_EMAIL=houseofthazhuval@gmail.com
ORDER_NOTIFICATION_EMAIL=houseofthazhuval@gmail.com

# Shipping amounts in INR
SHIPPING_FEE_INR=0
FREE_SHIPPING_THRESHOLD_INR=2000

NEXT_PUBLIC_SITE_URL=https://thazhuval.com
```

Add them in **Vercel → Project → Settings → Environment Variables**. Test keys belong in Development/Preview; live keys belong only in Production. Redeploy after changing environment variables.

The Sanity token needs permission to create/update orders and update product inventory. Use a dedicated production token rather than a personal administrator token.

## How the Payment Flow Works

1. The browser sends only product IDs, selected variant SKUs, quantities, customer details, and delivery address to `POST /api/checkout/create-order`.
2. The server reads current published products from Sanity and recalculates price and stock. Browser-supplied prices are never trusted.
3. The server creates a Razorpay Order in paise and stores an immutable order snapshot in Sanity.
4. Razorpay Checkout returns payment IDs and a signature to the browser.
5. `POST /api/checkout/verify` verifies the HMAC signature on the server for immediate customer feedback.
6. Razorpay sends `order.paid` to `POST /api/webhooks/razorpay`.
7. The signed webhook marks the Sanity order paid, adjusts inventory once, and sends customer/admin emails through Resend.

The webhook is the final source for fulfilment. Do not pack an order based only on a customer screenshot or browser success message.

## Where Orders Are Managed

### Razorpay

Use **Razorpay Dashboard → Transactions** for payment status, payment method, captures, refunds, disputes, and payment IDs. Use **Settlements** to reconcile when money reaches the bank account.

### Sanity Studio

Use **Sanity Studio → Orders** for day-to-day fulfilment:

- **New Paid Orders**: payment confirmed, ready to process.
- **Processing & Packed**: being prepared.
- **Shipped**: courier/tracking entered.
- **Payment Problems**: pending or failed attempts; do not fulfil these.

For each paid order, confirm the matching Razorpay payment ID before dispatch, then update fulfilment status, courier, tracking number, and tracking URL in Sanity. Product names/prices in an order are snapshots and will not change when a saree is edited later.

Refund money in Razorpay first, then update the operational order record in Sanity. Inventory restocking is a deliberate manual decision because returned goods may need inspection.

## Notifications

After a valid paid webhook:

- The customer receives an order confirmation at the checkout email.
- `ORDER_NOTIFICATION_EMAIL` receives a new-paid-order email.
- Customer replies are sent to `RESEND_REPLY_TO_EMAIL`, so a paid mailbox for `orders@thazhuval.com` is not required.
- The order appears under **New Paid Orders** in Sanity.
- The payment appears in Razorpay Transactions.

If Resend is not configured, payment and Sanity order processing still work, but emails are skipped. After adding Resend DNS records, use a sender on the verified domain such as `orders@thazhuval.com`.

## Test Checklist Before Going Live

1. Place a Test Mode order with one in-stock saree.
2. Confirm the amount in Razorpay exactly matches Sanity price plus configured shipping.
3. Confirm a new Sanity order is created as payment pending before payment.
4. Complete the Razorpay test payment.
5. Confirm the webhook is HTTP 200 in Razorpay webhook logs.
6. Confirm the order becomes Paid and appears under New Paid Orders.
7. Confirm stock decreases exactly once, including after replaying the webhook.
8. Confirm customer and admin emails arrive once.
9. Try an invalid signature and confirm it is rejected.
10. Try an out-of-stock item and confirm order creation is rejected.
11. Test payment failure/cancellation and confirm the order is not fulfilment-ready.
12. Repeat on mobile and desktop before replacing Snipcart in production.

Before enabling the public Razorpay checkout, add request-rate protection for `/api/checkout/create-order` using Vercel Firewall or a durable rate-limit store. The route validates all server-side prices and stock, but rate limiting prevents automated creation of large numbers of unpaid Razorpay/Sanity orders.

## SEO Already Implemented

- Canonical URLs for the homepage, collections, and products.
- Open Graph and Twitter social previews.
- Organization, WebSite SearchAction, and Product structured data.
- Product availability and INR offer data.
- Dynamic `sitemap.xml` for public pages, collections, and published products.
- `robots.txt` that excludes the internal search-results page.
- Sanity fields for product SEO title, description, social image, and image alt text.

## SEO Launch Checklist

1. Add `thazhuval.com` as a **Domain property** in Google Search Console and verify it with the DNS TXT record at Namecheap.
2. Submit `https://thazhuval.com/sitemap.xml` in Search Console.
3. Inspect the homepage and several product URLs in Search Console after the production deployment.
4. Add the same domain to Bing Webmaster Tools; it can import the Search Console property.
5. Complete every active Sanity product's SEO title, meta description, image alt text, SKU, price, stock, and social image.
6. Keep product slugs stable. If a slug must change, add a permanent redirect before publishing it.
7. Use descriptive collection/product copy; do not repeat generic keyword blocks.
8. Compress product images before upload, use correct hotspots, and avoid uploading near-identical files repeatedly.
9. Add Google Merchant Center only after live prices, inventory, shipping, and returns are consistently accurate.
10. Review Search Console indexing, Core Web Vitals, and structured-data reports monthly.

Useful live checks:

```text
https://thazhuval.com/robots.txt
https://thazhuval.com/sitemap.xml
https://search.google.com/test/rich-results
https://search.google.com/search-console
```

## Deploying These Changes

Code changes deploy from `main` through Vercel. Sanity schema changes require a separate Studio deployment:

```bash
pnpm exec next lint
pnpm exec tsc --noEmit
pnpm exec next build
pnpm run sanity:deploy
git add .
git commit -m "Add Razorpay orders and SEO foundations"
git push origin main
```

Deploying the Studio schema does not turn on Razorpay payments. The live checkout changes only after production keys, webhook, email sender, and end-to-end tests are complete.
