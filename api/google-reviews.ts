import type { IncomingMessage, ServerResponse } from "node:http";

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
    // Dynamically import to avoid hard-crash on module load in serverless runtime.
    const mod = await import("./_lib/googleReviews");
    const result = await mod.getGoogleReviewsNormalized();
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

