import express from "express";
import { getGoogleReviewsNormalized } from "./googleReviews";
import { loadEnvLocal } from "./loadEnvLocal";
import { handleCreateCheckout, handleSumUpWebhook, handleVerifyCheckout } from "./sumupHelpers";
import { handleCreatePosOrder } from "./posHelpers";

const port = Number(process.env.GOOGLE_REVIEWS_DEV_PORT || 8787);

async function main() {
  loadEnvLocal();
  const app = express();
  app.use(express.json());

  // ── SumUp routes ──────────────────────────────────────────────────────────
  app.post("/api/create-sandbox-checkout", handleCreateCheckout);
  app.post("/api/webhooks/sumup", handleSumUpWebhook);
  app.get("/api/verify-checkout/:checkoutId", handleVerifyCheckout);
  app.post("/api/create-pos-order", handleCreatePosOrder);
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

