# House of Thazhuval Ecommerce

Next.js storefront for House of Thazhuval, backed by Sanity Studio for product and homepage content.

## Project Stack

- Frontend: Next.js 14, React 18, Tailwind CSS
- CMS: Sanity project `njd3ihcc`, dataset `production`
- Studio: https://thazhuval.sanity.studio/
- Hosting: Vercel, deployed from the `main` branch
- Package manager: pnpm

Production payment, order fulfilment, notification, and SEO setup is documented in:

```text
docs/PAYMENTS_ORDERS_SEO.md
```

## Local Setup

Create `.env.local` from `.env.example` and fill the available values:

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

If port `3000` is busy, run:

```bash
pnpm exec next dev -p 3002
```

Useful checks before pushing:

```bash
pnpm exec next lint
pnpm exec tsc --noEmit
pnpm exec next build
```

## Sanity Studio

Run Studio locally:

```bash
pnpm run sanity:dev
```

Deploy Studio schema changes to the hosted Studio:

```bash
pnpm run sanity:deploy
```

The hosted Studio is:

```text
https://thazhuval.sanity.studio/
```

## Editing Store Content in Sanity

Products are managed in:

```text
Sarees
```

Global site and homepage media are managed in:

```text
Site Settings
```

Paid orders and fulfilment are managed in:

```text
Orders
```

Homepage images are managed in:

```text
Site Settings → Homepage Media
```

Editable homepage media fields:

- `Hero Cover Image`: desktop homepage cover picture.
- `Homepage Our Story Image`: image used in the homepage Our Story section.
- `Horizontal Collection Rail Images`: images for the auto-scrolling `Shop by collection` cards and mobile `Browse the house` cards.
- `Chapter Scroll Images`: images and copy for the horizontal `Chapter I / II / III / IV` Our Story journey.

After changing images/content in Sanity, publish the document. The storefront uses ISR and can take up to around 60 seconds to refresh.

## Seeding Sanity Media

To upload the current local homepage media defaults into Sanity, first make sure you are logged into Sanity CLI:

```bash
pnpm exec sanity login
```

Then run:

```bash
pnpm run sanity:seed-site-media
```

This seeds:

- Hero cover image
- Homepage Our Story image
- Horizontal collection rail images
- Chapter scroll images

For automation or CI, add a write token as `SANITY_API_TOKEN` in `.env.local`, then run:

```bash
pnpm run sanity:seed-site-media:token
```

## Making Schema Changes

When changing Sanity fields:

1. Update schema files in `src/sanity/schemas/`.
2. Update GROQ queries in `src/lib/sanity/queries.ts`.
3. Update frontend types in `src/types/` if the data shape changes.
4. Update the frontend component/page that consumes the data.
5. Run checks:

```bash
pnpm exec next lint
pnpm exec tsc --noEmit
pnpm exec next build
```

6. Deploy Studio:

```bash
pnpm run sanity:deploy
```

7. Seed or manually enter any required content in Sanity Studio.

## Pushing Changes

Check changed files:

```bash
git status --short
git diff --stat
```

Stage, commit, and push to production:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

Vercel deploys the production site from `main`.

## Notes

- Do not commit `.env.local` or API tokens.
- Product images and homepage media should be managed from Sanity once seeded.
- Keep local fallback images in `public/images/` so the site still renders safely if a Sanity field is empty.
- The storefront cart uses Razorpay Standard Checkout. Keep Test Mode keys active until the end-to-end checklist in `docs/PAYMENTS_ORDERS_SEO.md` is complete.
