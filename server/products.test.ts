import { describe, expect, it } from "vitest";
import { PRODUCTS, exportProductsForSumUp, getProductsMissingSumUp } from "../shared/products";

describe("product catalog", () => {
  it("assigns every product a unique SKU", () => {
    const skus = PRODUCTS.map((product) => product.sku);

    expect(skus.every(Boolean)).toBe(true);
    expect(new Set(skus).size).toBe(PRODUCTS.length);
  });

  it("uses the required SKU naming system", () => {
    expect(Object.fromEntries(PRODUCTS.map(({ name, sku }) => [name, sku]))).toMatchObject({
      "Single Smash": "SNG-SMSH-001",
      "Double Smash": "DBL-SMSH-002",
      "Long Chili Cheese": "LCC-SMSH-003",
      "BBQ Smash": "BBQ-SMSH-004",
      "Croissant Smash": "CRS-SMSH-005",
      "Sucuk Burger": "SCK-SMSH-006",
      "Classic Chicken": "CLS-CHKN-001",
      "Garlic Chicken": "GRL-CHKN-002",
      "Long Chicken": "LNG-CHKN-003",
      "Vegan Burger": "VGN-BRGR-001",
      "Falafel Burger": "FLF-BRGR-002",
      Fries: "FRS-SIDE-001",
      "Beef & Cheese Fries": "BCF-SIDE-002",
      "Sweet Potato Fries": "SPF-SIDE-003",
      "8 Chicken Nuggets": "NGT-SIDE-004",
      "Chicken Tenders": "TND-SIDE-005",
      "Onion Rings": "ONR-SIDE-006",
      "Chocolate Shake": "CHC-DRNK-001",
      "Vanilla Shake": "VNL-DRNK-002",
      Water: "WTR-DRNK-003",
      "Fritz Limo": "FTZ-DRNK-004",
    });
  });

  it("exports only the internal SumUp product fields", () => {
    const [product] = exportProductsForSumUp(PRODUCTS.slice(0, 1));

    expect(product).toEqual({
      sku: "SNG-SMSH-001",
      name: "Single Smash",
      price: 6.9,
      category: "Smash Burgers",
    });
  });

  it("links every Smash Burger to SumUp", () => {
    const missing = getProductsMissingSumUp(["Smash Burgers"]);
    expect(missing).toEqual([]);
  });
});
