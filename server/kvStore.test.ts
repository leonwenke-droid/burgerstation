import { describe, it, expect, beforeEach } from "vitest";
import { kvSetEx, kvGet, kvDel } from "./kvStore";

describe("kvSetEx (in-memory fallback)", () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("stores and reads back a value", async () => {
    await kvDel("t:1");
    await kvSetEx("t:1", "hello", 600);
    expect(await kvGet("t:1")).toBe("hello");
  });
});
