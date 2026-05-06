import type { IncomingMessage, ServerResponse } from "node:http";
import { getGoogleReviewsNormalized } from "./_lib/googleReviews";

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  // #region agent log
  fetch("http://127.0.0.1:7795/ingest/66c2885f-1421-4d80-ad50-1c0a8d3bdcd6", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "734526" },
    body: JSON.stringify({
      sessionId: "734526",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "api/google-reviews.ts:handler",
      message: "Handler entry",
      data: { nodeEnv: process.env.NODE_ENV || null },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const result = await getGoogleReviewsNormalized();
  if (!result.ok) {
    res.statusCode = result.status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: result.error }));
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Vercel/CDN caching (24h default, configurable)
  res.setHeader(
    "Cache-Control",
    `public, max-age=0, s-maxage=${result.cacheTtlSeconds}, stale-while-revalidate=3600`,
  );
  res.end(JSON.stringify(result.value));
}

