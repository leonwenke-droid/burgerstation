import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { getGoogleReviewsNormalized } from "./googleReviews";
import { loadEnvLocal } from "./loadEnvLocal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  loadEnvLocal();
  const app = express();
  const server = createServer(app);

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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
