/**
 * Vercel Serverless Function — handles all /api/* routes.
 *
 * Vercel routes every request matching /api/* here (see vercel.json).
 * Express handles internal path-based routing from there.
 * loadEnvLocal() is NOT called — Vercel injects env vars via dashboard.
 */
import express from "express";
import { handleCreateCheckout, handleSumUpWebhook, handleVerifyCheckout } from "../server/sumupHelpers";
import { handleCreatePosOrder } from "../server/posHelpers";
import { getGoogleReviewsNormalized } from "../server/googleReviews";

const app = express();
app.use(express.json());

// #region agent log – request diagnostics
app.use((req, _res, next) => {
  console.log(`[API] ${req.method} ${req.url} | path=${req.path}`);
  next();
});
// #endregion

// Health check — lets us verify the function is reachable at all
app.get(["/api/health", "/health"], (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.post("/api/create-sandbox-checkout", handleCreateCheckout);
app.post("/api/webhooks/sumup",           handleSumUpWebhook);
app.get("/api/verify-checkout/:checkoutId", handleVerifyCheckout);
app.post("/api/create-pos-order",         handleCreatePosOrder);

app.get("/api/google-reviews", async (_req, res) => {
  const result = await getGoogleReviewsNormalized();
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", `public, max-age=0, s-maxage=${result.cacheTtlSeconds}`);
  res.status(200).send(JSON.stringify(result.value));
});

export default app;
