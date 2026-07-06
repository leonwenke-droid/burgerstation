import { describe, expect, it } from "vitest";
import { sanitizePosItems } from "./posHelpers";

describe("sanitizePosItems", () => {
  it("accepts Smash Burgers linked to SumUp even without Good Till product id", () => {
    const result = sanitizePosItems([
      {
        variant_id: "2048c6ff-7450-4d2f-8444-aa64726cfcbf",
        sku: "SNG-SMSH-001",
        name: "Single Smash",
        quantity: 1,
        price: 0,
        tax_rate: 7,
      },
    ]);

    expect(result.error).toBeUndefined();
    expect(result.items).toEqual([
      {
        variant_id: "2048c6ff-7450-4d2f-8444-aa64726cfcbf",
        sku: "SNG-SMSH-001",
        name: "Single Smash",
        quantity: 1,
        price: 6.9,
        tax_rate: 7,
      },
    ]);
  });

  it("rejects Smash Burgers sent without variant_id", () => {
    const result = sanitizePosItems([
      {
        sku: "SNG-SMSH-001",
        name: "Single Smash",
        quantity: 1,
        price: 6.9,
        tax_rate: 7,
      },
    ]);

    expect(result.items).toBeUndefined();
    expect(result.error).toContain("Single Smash");
  });
});
