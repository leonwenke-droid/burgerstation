import express from "express";
import { getGoogleReviewsNormalized } from "./googleReviews";
import { loadEnvLocal } from "./loadEnvLocal";
import { handleCreateCheckout, handleSumUpWebhook, handleVerifyCheckout } from "./sumupHelpers";
import { handleCreatePosOrder } from "./posHelpers";
import { handleRequestCode, handleConfirmOrder } from "./orderVerification";
import { handleStoreStatus, handleSetStoreOverride } from "./storeStatusHelper";
import { handleSnapshot, handleCartSync, handleHeartbeat, handleDisconnect, trackActiveUser } from "./analyticsHelper";

const port = Number(process.env.GOOGLE_REVIEWS_DEV_PORT || 8787);

async function main() {
  loadEnvLocal();
  const app = express();
  app.use(express.json());
  app.use(trackActiveUser);

  app.get("/api/store-status",              handleStoreStatus);
  app.post("/api/admin/store-override",     handleSetStoreOverride);
  app.get("/api/analytics/snapshot",        handleSnapshot);
  app.post("/api/analytics/heartbeat",      handleHeartbeat);
  app.post("/api/analytics/disconnect",     handleDisconnect);
  app.post("/api/analytics/cart-sync",      handleCartSync);
  app.post("/api/create-sandbox-checkout",  handleCreateCheckout);
  app.post("/api/webhooks/sumup", handleSumUpWebhook);
  app.get("/api/verify-checkout/:checkoutId", handleVerifyCheckout);
  app.post("/api/create-pos-order", handleCreatePosOrder);
  app.post("/api/order/request-code", handleRequestCode);
  app.post("/api/order/confirm",      handleConfirmOrder);
  // ─────────────────────────────────────────────────────────────────────────

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

  app.listen(port, () => {
    console.log(`Google Reviews dev API listening on http://localhost:${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

