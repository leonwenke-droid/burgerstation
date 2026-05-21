/**
 * Tiny KV abstraction — backed by Upstash Redis REST API (zero npm dependencies).
 * Falls back to an in-memory Map when UPSTASH_REDIS_REST_URL is not set (local dev).
 *
 * Setup (one-time, free):
 *   1. https://console.upstash.com → create a Redis database → copy REST URL + token
 *   2. Add to Vercel: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 *   3. Add to .env.local for local dev (optional — in-memory fallback is used otherwise)
 */

const mem = new Map<string, string>(); // in-memory fallback for local dev

function upstashEnabled(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashReq(command: unknown[]): Promise<unknown> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res   = await fetch(url, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify(command),
  });
  const data = await res.json() as { result: unknown };
  return data.result;
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (upstashEnabled()) {
    await upstashReq(["SET", key, value]);
  } else {
    mem.set(key, value);
  }
}

export async function kvGet(key: string): Promise<string | null> {
  if (upstashEnabled()) {
    const result = await upstashReq(["GET", key]);
    return typeof result === "string" ? result : null;
  }
  return mem.get(key) ?? null;
}

export async function kvDel(key: string): Promise<void> {
  if (upstashEnabled()) {
    await upstashReq(["DEL", key]);
  } else {
    mem.delete(key);
  }
}
