import fs from "node:fs";
import path from "node:path";

type Candidate = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
};

async function main() {
  // Minimal .env.local loader (keeps API key server-side; avoids extra deps)
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
  if (!apiKey) {
    console.error("Missing GOOGLE_PLACES_API_KEY in .env.local");
    process.exit(1);
  }

  const textQuery = "Burger Station, Bahnhofsring 30, 26789 Leer";

  const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount",
    },
    body: JSON.stringify({
      textQuery,
      languageCode: "de",
      maxResultCount: 5,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.error(`Google Places searchText failed (${resp.status})`);
    console.error(body || "(no body)");
    process.exit(1);
  }

  const json = (await resp.json()) as { places?: Candidate[] };
  const places = json.places || [];

  if (places.length === 0) {
    console.log("No matches found.");
    process.exit(0);
  }

  console.log("Possible matches:");
  places.forEach((p, idx) => {
    const name = p.displayName?.text || "(no name)";
    const addr = p.formattedAddress || "(no address)";
    const rating = p.rating != null ? String(p.rating).replace(".", ",") : "—";
    const count = p.userRatingCount != null ? String(p.userRatingCount) : "—";
    console.log(`\n${idx + 1}. ${name}`);
    console.log(`   ${addr}`);
    console.log(`   rating: ${rating} (${count})`);
    console.log(`   place_id: ${p.id}`);
  });

  const selected = places[0];
  console.log("\nSelected (first match):");
  console.log(`GOOGLE_PLACE_ID=${selected.id}`);
  console.log("\nAdd this exact line to .env.local:");
  console.log(`GOOGLE_PLACE_ID=${selected.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

