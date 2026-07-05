import { describe, it, expect, beforeEach } from "vitest";
import {
  isValidEmail,
  isDisposableDomain,
  generateCode,
  storeCode,
  verifyOrderCode,
} from "./emailHelpers";

beforeEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

describe("isValidEmail", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("kunde@example.com")).toBe(true);
  });
  it("rejects malformed input", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isDisposableDomain", () => {
  it("flags a known throwaway domain", () => {
    expect(isDisposableDomain("x@mailinator.com")).toBe(true);
  });
  it("passes a normal domain", () => {
    expect(isDisposableDomain("x@gmail.com")).toBe(false);
  });
});

describe("generateCode", () => {
  it("returns a 6-digit numeric string", () => {
    for (let i = 0; i < 50; i++) {
      const c = generateCode();
      expect(c).toMatch(/^\d{6}$/);
    }
  });
});

describe("storeCode + verifyOrderCode", () => {
  it("accepts the correct code once and rejects reuse", async () => {
    await storeCode("kunde@example.com", "123456");
    expect(await verifyOrderCode("kunde@example.com", "123456")).toEqual({ ok: true });
    // consumed → second attempt fails
    const again = await verifyOrderCode("kunde@example.com", "123456");
    expect(again.ok).toBe(false);
  });

  it("rejects a wrong code", async () => {
    await storeCode("k2@example.com", "111111");
    const r = await verifyOrderCode("k2@example.com", "999999");
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("invalidates after 5 wrong attempts", async () => {
    await storeCode("k3@example.com", "222222");
    for (let i = 0; i < 5; i++) await verifyOrderCode("k3@example.com", "000000");
    // even the correct code is now rejected (code was invalidated)
    const r = await verifyOrderCode("k3@example.com", "222222");
    expect(r.ok).toBe(false);
  });
});
