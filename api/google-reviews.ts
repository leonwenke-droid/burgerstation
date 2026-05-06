import type { IncomingMessage, ServerResponse } from "node:http";

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

type NormalizedGoogleReviewsResponse = {
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

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const safeLog = (data: Record<string, unknown>) => {
    try {
      if (typeof fetch !== "function") return;
      // #region agent log
      fetch("http://127.0.0.1:7795/ingest/66c2885f-1421-4d80-ad50-1c0a8d3bdcd6", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "734526" },
        body: JSON.stringify({
          sessionId: "734526",
          runId: "pre-fix",
          hypothesisId: "H1",
          location: "api/google-reviews.ts:safeLog",
          message: "Debug log event",
          data,
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } catch {
      // ignore
    }
  };

  safeLog({ phase: "handler-entry", nodeEnv: process.env.NODE_ENV || null });

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
    const placeId = process.env.GOOGLE_PLACE_ID || "";
    const ttlSeconds = envInt("GOOGLE_REVIEWS_CACHE_TTL_SECONDS", 86400);

    safeLog({
      phase: "env-check",
      hasApiKey: Boolean(apiKey),
      hasPlaceId: Boolean(placeId),
      ttlSeconds,
      hasGlobalFetch: typeof fetch === "function",
    });

    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Missing GOOGLE_PLACES_API_KEY" }));
      return;
    }
    if (!placeId) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Missing GOOGLE_PLACE_ID" }));
      return;
    }

    const now = Date.now();
    if (cache && cache.expiresAtMs > now) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader(
        "Cache-Control",
        `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=3600`,
      );
      res.end(JSON.stringify(cache.value));
      return;
    }

    const fieldMask = ["displayName", "rating", "userRatingCount", "googleMapsUri", "reviews"].join(
      ",",
    );
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
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: `Network error: ${String(e)}` }));
      return;
    }

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      res.statusCode = resp.status || 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: body || `Google Places error (${resp.status})` }));
      return;
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

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=3600`,
    );
    res.end(JSON.stringify(value));
  } catch (e) {
    safeLog({
      phase: "handler-exception",
      error: e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : String(e),
    });
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: "Internal error",
        detail: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
      }),
    );
  }
}

