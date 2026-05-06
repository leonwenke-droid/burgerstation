type GoogleReview = {
  id: string;
  authorName: string;
  authorProfileUrl: string;
  authorPhotoUrl: string;
  rating: 1 | 2 | 3 | 4 | 5;
  relativeTime: string;
  publishTime: string;
  text: string;
  language: string;
};

export type NormalizedGoogleReviewsResponse = {
  source: "google";
  placeName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  reviewsUrl: string;
  writeReviewUrl: string;
  reviews: GoogleReview[];
  updatedAt: string;
};

function envInt(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function computeLinks(placeId: string) {
  const reviewsUrl =
    process.env.VITE_GOOGLE_REVIEWS_URL ||
    `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  const writeReviewUrl =
    process.env.VITE_GOOGLE_WRITE_REVIEW_URL ||
    `https://search.google.com/local/writereview?placeid=${placeId}`;
  return { reviewsUrl, writeReviewUrl };
}

type PlacesPlaceDetailsResponse = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    name?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    text?: { text?: string; languageCode?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }>;
};

let cache:
  | {
      value: NormalizedGoogleReviewsResponse;
      expiresAtMs: number;
    }
  | undefined;

export async function getGoogleReviewsNormalized(): Promise<
  | { ok: true; value: NormalizedGoogleReviewsResponse; cacheTtlSeconds: number }
  | { ok: false; status: number; error: string }
> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
  const placeId = process.env.GOOGLE_PLACE_ID || "";
  const ttlSeconds = envInt("GOOGLE_REVIEWS_CACHE_TTL_SECONDS", 86400);

  // #region agent log
  fetch("http://127.0.0.1:7795/ingest/66c2885f-1421-4d80-ad50-1c0a8d3bdcd6", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "734526" },
    body: JSON.stringify({
      sessionId: "734526",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "api/_lib/googleReviews.ts:env",
      message: "Env presence (no secrets)",
      data: {
        hasApiKey: Boolean(apiKey),
        hasPlaceId: Boolean(placeId),
        ttlSeconds,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!apiKey) return { ok: false, status: 500, error: "Missing GOOGLE_PLACES_API_KEY" };
  if (!placeId) return { ok: false, status: 500, error: "Missing GOOGLE_PLACE_ID" };

  const now = Date.now();
  if (cache && cache.expiresAtMs > now) {
    // #region agent log
    fetch("http://127.0.0.1:7795/ingest/66c2885f-1421-4d80-ad50-1c0a8d3bdcd6", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "734526" },
      body: JSON.stringify({
        sessionId: "734526",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "api/_lib/googleReviews.ts:cache-hit",
        message: "Returning cached value",
        data: { expiresInMs: cache.expiresAtMs - now },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return { ok: true, value: cache.value, cacheTtlSeconds: ttlSeconds };
  }

  const fieldMask = ["displayName", "rating", "userRatingCount", "googleMapsUri", "reviews"].join(",");
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=de`;

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
    });
  } catch (e) {
    return { ok: false, status: 502, error: `Network error: ${String(e)}` };
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    const status = resp.status || 502;
    return { ok: false, status, error: body || `Google Places error (${status})` };
  }

  const json = (await resp.json()) as PlacesPlaceDetailsResponse;
  const { reviewsUrl, writeReviewUrl } = computeLinks(placeId);

  const reviews: GoogleReview[] = (json.reviews || []).map((r, idx) => {
    const rating = Math.min(5, Math.max(1, Math.round(r.rating || 0))) as 1 | 2 | 3 | 4 | 5;
    const id = r.name || `review-${idx}`;
    return {
      id,
      authorName: r.authorAttribution?.displayName || "Google Nutzer",
      authorProfileUrl: r.authorAttribution?.uri || "",
      authorPhotoUrl: r.authorAttribution?.photoUri || "",
      rating,
      relativeTime: r.relativePublishTimeDescription || "",
      publishTime: r.publishTime || "",
      text: r.text?.text || "",
      language: r.text?.languageCode || "",
    };
  });

  const value: NormalizedGoogleReviewsResponse = {
    source: "google",
    placeName: json.displayName?.text || "Burger Station",
    rating: typeof json.rating === "number" ? json.rating : null,
    userRatingsTotal: typeof json.userRatingCount === "number" ? json.userRatingCount : null,
    reviewsUrl: json.googleMapsUri || reviewsUrl,
    writeReviewUrl,
    reviews,
    updatedAt: new Date().toISOString(),
  };

  cache = { value, expiresAtMs: now + ttlSeconds * 1000 };
  return { ok: true, value, cacheTtlSeconds: ttlSeconds };
}

