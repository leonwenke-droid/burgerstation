# Google Reviews (Places API) Setup

This project integrates Google Reviews via the **official Google Places API**.

## What was implemented

- **Frontend section**: `client/src/components/GoogleReviewsSection.tsx`
  - Fetches reviews **only from the internal endpoint** (`/api/google-reviews`)
  - Loading / error / empty states
  - Shows rating, review count, up to 5 review cards
  - Reviewer name + profile link (if returned)
  - Reviewer photo (if returned) with initials fallback
  - Visible attribution: **“Bewertungen stammen von Google.”**
  - CTAs:
    - Alle Bewertungen ansehen
    - Bewertung schreiben

- **Selection config**: `client/src/config/googleReviews.ts`
  - `maxDisplayedReviews` (max 5)
  - `minimumRating` (default 4; keeps at least 3 reviews if possible)
  - optional preferred author/text matching

- **Server-side endpoint (Vercel Function)**: `api/google-reviews.ts`
  - Calls Places API server-side (no key in browser)
  - Normalizes response
  - CDN caching via `Cache-Control` (TTL configurable)

- **Server-side endpoint (Express runtime)**: `server/index.ts`
  - Also exposes `/api/google-reviews` when running `npm run start`

- **Local dev API server**: `server/dev.ts`
  - Run it locally to serve `/api/google-reviews` on port **8787**

- **Place ID finder script**: `scripts/find-google-place-id.ts`
  - Queries Places **Text Search (New)** using name+address
  - Prints candidate matches and a suggested `GOOGLE_PLACE_ID=...` line

## Environment variables

Copy `.env.example` → `.env.local` (or edit the existing `.env.local`).

Required:

- `GOOGLE_PLACES_API_KEY=...` (server-side only)
- `GOOGLE_PLACE_ID=...` (server-side only)

Optional:

- `GOOGLE_REVIEWS_CACHE_TTL_SECONDS=86400`
- `VITE_GOOGLE_REVIEWS_URL=...` (public CTA URL)
- `VITE_GOOGLE_WRITE_REVIEW_URL=...` (public CTA URL)

## How to find the Place ID

1. Put your key into `.env.local`:

   - `GOOGLE_PLACES_API_KEY=YOUR_REAL_KEY`

2. Run:

   - `npm run google:find-place`

3. Copy the printed `GOOGLE_PLACE_ID=...` into `.env.local`.

## How to run locally

You need **two terminals**:

1. API (server-side):

   - `npm run dev:api`

2. Frontend:

   - `npm run dev`

Vite proxies `/api/*` to `http://localhost:8787` (see `vite.config.ts`).

## Deployment (Vercel)

- The production `/api/google-reviews` endpoint is provided by `api/google-reviews.ts`.
- Set env vars in Vercel Project Settings:
  - `GOOGLE_PLACES_API_KEY`
  - `GOOGLE_PLACE_ID`
  - `GOOGLE_REVIEWS_CACHE_TTL_SECONDS` (optional)
  - `VITE_GOOGLE_REVIEWS_URL` (optional)
  - `VITE_GOOGLE_WRITE_REVIEW_URL` (optional)

## Caching behavior

- Defaults to **24 hours** (`GOOGLE_REVIEWS_CACHE_TTL_SECONDS=86400`)
- The serverless function sets:
  - `s-maxage=<ttl>`
  - `stale-while-revalidate=3600`

## Limitations (by Google)

Google Places returns **up to 5 reviews** for a place. This integration displays **3–5** and does not paginate.

## Troubleshooting

- **401/403**: API key invalid, billing/Places API not enabled, or key restrictions too strict
- **Missing place id**: run `npm run google:find-place` and set `GOOGLE_PLACE_ID`
- **No reviews**: Google sometimes returns none; CTAs still work

