export type ProductCategory =
  | "Smash Burgers"
  | "Chicken Burgers"
  | "Vegan"
  | "Sides & Snacks"
  | "Shakes & Drinks"
  | "Sauces";

export type TaxCategory = "food" | "drink";
export type ProductAllergen = "gluten" | "lactose" | "egg" | "fish" | "nuts";

export interface Product {
  sku: string;
  name: string;
  category: ProductCategory;
  taxCategory: TaxCategory;
  price: number;
  description?: string;
  badge?: string;
  allergens?: ProductAllergen[];
  image?: string;
  sumup?: {
    catalogId: string;
    variantId: string;
    posProductId?: string;
  };
}

export interface SumUpProductExport {
  sku: string;
  name: string;
  price: number;
  category: ProductCategory;
}

/**
 * Single source of truth for all customer-orderable products.
 * SKUs are internal identifiers and must never be rendered in customer UI.
 */
export const PRODUCTS: Product[] = [
  {
    sku: "SNG-SMSH-001",
    name: "Single Smash",
    category: "Smash Burgers",
    taxCategory: "food",
    price: 6.9,
    description: "Brioche Bun, Single Beef Patty, Cheddar, Onion, Lettuce, Pickles, Burger Sauce",
    allergens: ["gluten", "lactose", "egg"],
    image: "/images/menu/single-smash.png",
    sumup: {
      catalogId: "94531fb0-8a0a-4ea5-b049-79b560d32fbc",
      variantId: "2048c6ff-7450-4d2f-8444-aa64726cfcbf",
    },
  },
  {
    sku: "DBL-SMSH-002",
    name: "Double Smash",
    category: "Smash Burgers",
    taxCategory: "food",
    price: 9.4,
    description: "Doppeltes Beef Patty, geschmolzener Cheddar, Pickles, Burger Sauce",
    badge: "Top Seller",
    allergens: ["gluten", "lactose", "egg"],
    image: "/images/menu/double-smash.png",
    sumup: {
      catalogId: "32b94cb2-f2a0-4f76-a838-01def30e62bf",
      variantId: "1873af29-5382-4ca0-bafd-064fa03e181f",
      posProductId: "GOODTILL_ID_DOUBLE_SMASH",
    },
  },
  {
    sku: "LCC-SMSH-003",
    name: "Long Chili Cheese",
    category: "Smash Burgers",
    taxCategory: "food",
    price: 11.9,
    description: "Doppeltes Beef, Chili Cheese, Jalapeños, Burger Sauce",
    badge: "Spicy",
    allergens: ["gluten", "lactose", "egg"],
    image: "/images/menu/long-chili-cheese.png",
    sumup: {
      catalogId: "bbece028-bb1c-4187-a560-0857ca24fa43",
      variantId: "2b53f6ff-0b54-467d-8a3a-8cc21a300eaf",
      posProductId: "GOODTILL_ID_LONG_CHILI",
    },
  },
  {
    sku: "BBQ-SMSH-004",
    name: "BBQ Smash",
    category: "Smash Burgers",
    taxCategory: "food",
    price: 9.9,
    description: "Beef Patty, Bacon, Cheddar, Onion Rings, BBQ Sauce",
    badge: "Smoky",
    allergens: ["gluten", "lactose", "egg"],
    image: "/images/menu/bbq-smash.png",
    sumup: {
      catalogId: "17c0189d-5547-49f9-981f-45d1cd00220f",
      variantId: "90f14b3b-df99-48a7-be19-37a74c3fa66c",
    },
  },
  {
    sku: "CRS-SMSH-005",
    name: "Croissant Smash",
    category: "Smash Burgers",
    taxCategory: "food",
    price: 11.4,
    description: "Croissant Bun, doppeltes Beef Patty, Cheddar, Burger Sauce",
    badge: "Signature",
    allergens: ["gluten", "lactose", "egg"],
    image: "/images/menu/croissant-smash.png",
    sumup: {
      catalogId: "7bde6a11-ebee-478f-aedd-d1140e39fd5b",
      variantId: "1981aeec-0dc7-4cec-b6d2-64b4caa94489",
    },
  },
  {
    sku: "SCK-SMSH-006",
    name: "Sucuk Burger",
    category: "Smash Burgers",
    taxCategory: "food",
    price: 8.9,
    description: "Sucuk, Cheddar, Onion, Lettuce, Pickles, Garlic Sauce",
    allergens: ["gluten", "lactose"],
    image: "/images/menu/sucuk-burger.png",
    sumup: {
      catalogId: "656599de-cef3-4e06-9fe3-9d5c61defecc",
      variantId: "ea5be7a9-1623-469e-81b0-e4d2db7a7325",
    },
  },
  {
    sku: "CLS-CHKN-001",
    name: "Classic Chicken",
    category: "Chicken Burgers",
    taxCategory: "food",
    price: 9,
    description: "Knuspriges Chicken Patty, Buttermilk-Mariniert, Cheddar, Lettuce, Pickles, Burger Sauce",
    allergens: ["gluten", "egg"],
  },
  {
    sku: "GRL-CHKN-002",
    name: "Garlic Chicken",
    category: "Chicken Burgers",
    taxCategory: "food",
    price: 9,
    description: "Chicken Patty, Cheddar, Garlic Sauce",
    allergens: ["gluten", "egg"],
  },
  {
    sku: "LNG-CHKN-003",
    name: "Long Chicken",
    category: "Chicken Burgers",
    taxCategory: "food",
    price: 11.5,
    description: "Doppelt Chicken Patty, Cheddar, Lettuce, Onion, Pickles, Burger Sauce",
    allergens: ["gluten", "egg"],
  },
  {
    sku: "VGN-BRGR-001",
    name: "Vegan Burger",
    category: "Vegan",
    taxCategory: "food",
    price: 8.7,
    description: "Vegan Patty, Lettuce, Onion, Pickles, Vegan Sauce",
    allergens: ["gluten"],
  },
  {
    sku: "FLF-BRGR-002",
    name: "Falafel Burger",
    category: "Vegan",
    taxCategory: "food",
    price: 8.7,
    description: "Hausgemachte Falafel, Lettuce, Onion, Pickles, Vegan Sauce",
    allergens: ["gluten"],
  },
  {
    sku: "FRS-SIDE-001",
    name: "Fries",
    category: "Sides & Snacks",
    taxCategory: "food",
    price: 3.5,
    allergens: ["gluten"],
  },
  {
    sku: "BCF-SIDE-002",
    name: "Beef & Cheese Fries",
    category: "Sides & Snacks",
    taxCategory: "food",
    price: 7.9,
    description: "Fries mit Smash Beef und Cheese Sauce",
    allergens: ["gluten", "lactose"],
  },
  {
    sku: "SPF-SIDE-003",
    name: "Sweet Potato Fries",
    category: "Sides & Snacks",
    taxCategory: "food",
    price: 4.5,
  },
  {
    sku: "NGT-SIDE-004",
    name: "8 Chicken Nuggets",
    category: "Sides & Snacks",
    taxCategory: "food",
    price: 6,
    allergens: ["gluten", "egg"],
  },
  {
    sku: "TND-SIDE-005",
    name: "Chicken Tenders",
    category: "Sides & Snacks",
    taxCategory: "food",
    price: 6.6,
    allergens: ["gluten", "egg"],
  },
  {
    sku: "ONR-SIDE-006",
    name: "Onion Rings",
    category: "Sides & Snacks",
    taxCategory: "food",
    price: 6.2,
    allergens: ["gluten", "egg"],
  },
  {
    sku: "CHC-DRNK-001",
    name: "Chocolate Shake",
    category: "Shakes & Drinks",
    taxCategory: "drink",
    price: 4,
    description: "Cremig, kalt, klassisch",
    allergens: ["lactose", "egg"],
  },
  {
    sku: "VNL-DRNK-002",
    name: "Vanilla Shake",
    category: "Shakes & Drinks",
    taxCategory: "drink",
    price: 4,
    description: "Vanille, dick, eiskalt",
    allergens: ["lactose", "egg"],
  },
  {
    sku: "WTR-DRNK-003",
    name: "Water",
    category: "Shakes & Drinks",
    taxCategory: "drink",
    price: 2,
    description: "Wasser",
  },
  {
    sku: "FTZ-DRNK-004",
    name: "Fritz Limo",
    category: "Shakes & Drinks",
    taxCategory: "drink",
    price: 3.3,
    description: "Cola · Orange · Zitrone",
  },
  {
    sku: "BGR-SAUCE-001",
    name: "Burger Sauce",
    category: "Sauces",
    taxCategory: "food",
    price: 1.5,
  },
  {
    sku: "CHS-SAUCE-002",
    name: "Cheese Sauce",
    category: "Sauces",
    taxCategory: "food",
    price: 4,
  },
  {
    sku: "GAR-SAUCE-003",
    name: "Garlic Sauce",
    category: "Sauces",
    taxCategory: "food",
    price: 1.5,
  },
  {
    sku: "SWS-SAUCE-004",
    name: "Sweet & Sour Sauce",
    category: "Sauces",
    taxCategory: "food",
    price: 1.5,
  },
  {
    sku: "KTP-SAUCE-005",
    name: "Ketchup",
    category: "Sauces",
    taxCategory: "food",
    price: 0.6,
  },
  {
    sku: "MAY-SAUCE-006",
    name: "Mayo",
    category: "Sauces",
    taxCategory: "food",
    price: 0.6,
  },
];

/** Categories that must be linked to SumUp before any delivery order is accepted. */
export const SUMUP_REQUIRED_CATEGORIES: ProductCategory[] = ["Smash Burgers"];

export function requiresSumUpForDelivery(product: Product): boolean {
  return SUMUP_REQUIRED_CATEGORIES.includes(product.category);
}

export function isSumUpLinked(product: Product): boolean {
  return Boolean(product.sumup?.variantId);
}

export function getProductsMissingSumUp(
  categories: ProductCategory[] = SUMUP_REQUIRED_CATEGORIES,
): Product[] {
  return PRODUCTS.filter(
    (product) => categories.includes(product.category) && !isSumUpLinked(product),
  );
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((product) => product.category === category);
}

export function getProductBySku(sku: string): Product | undefined {
  return PRODUCTS.find((product) => product.sku === sku);
}

export function requireProduct(sku: string): Product {
  const product = getProductBySku(sku);
  if (!product) throw new Error(`Unknown product SKU: ${sku}`);
  return product;
}

/** Internal export shape for SumUp catalog/import tooling. */
export function exportProductsForSumUp(products: Product[] = PRODUCTS): SumUpProductExport[] {
  return products.map(({ sku, name, price, category }) => ({
    sku,
    name,
    price,
    category,
  }));
}

export function formatProductPrice(price: number): string {
  return price.toFixed(2).replace(".", ",");
}
