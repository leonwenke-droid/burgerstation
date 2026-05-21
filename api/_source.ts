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
import { handleStoreStatus, handleSetStoreOverride, handleGetStoreConfig, handleSetHours } from "../server/storeStatusHelper";
import { handleSnapshot, handleCartSync, handleHeartbeat, handleDisconnect, trackActiveUser } from "../server/analyticsHelper";
import { getGoogleReviewsNormalized } from "../server/googleReviews";

const app = express();
app.use(express.json());
app.use(trackActiveUser);

app.get("/api/store-status",                handleStoreStatus);
app.post("/api/admin/store-override",       handleSetStoreOverride);
app.get("/api/admin/store-config",          handleGetStoreConfig);
app.post("/api/admin/set-hours",            handleSetHours);
app.get("/api/analytics/snapshot",          handleSnapshot);
app.post("/api/analytics/heartbeat",        handleHeartbeat);
app.post("/api/analytics/disconnect",       handleDisconnect);
app.post("/api/analytics/cart-sync",        handleCartSync);
app.post("/api/create-sandbox-checkout",    handleCreateCheckout);
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
