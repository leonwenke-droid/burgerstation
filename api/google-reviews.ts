import type { IncomingMessage, ServerResponse } from "node:http";
import { getGoogleReviewsNormalized } from "../server/googleReviews";

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
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

