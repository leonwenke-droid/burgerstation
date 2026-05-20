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
