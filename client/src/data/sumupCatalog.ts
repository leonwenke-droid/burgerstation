/**
 * Client-side mirror of the SumUp catalog — only the fields the frontend needs.
 * Source of truth: server/sumupHelpers.ts → SUMUP_CATALOG.
 * Keep both in sync when adding new items.
 */
export interface CatalogItem {
  sumup_catalog_id: string;
  variant_id: string;
  sku: string;
  name: string;
}

export const SUMUP_CATALOG_CLIENT: CatalogItem[] = [
  {
    sumup_catalog_id: "c0b10e52-2f19-4614-9633-76e4da4228c3",
    variant_id:       "7569a6cd-268f-4d16-b86f-09676f4dcfaa",
    sku:              "DBL-SMSH-001",
    name:             "Double Smash",
  },
  {
    sumup_catalog_id: "0e9f1a01-c675-40d8-b12a-6bbcdeccd21a",
    variant_id:       "42194cc3-fe98-4a6d-b5fa-04d333730d96",
    sku:              "LNG-CHI-002",
    name:             "Long Chili Cheese",
  },
];

/** Set of variant_ids that are cleared for online payment. */
export const ONLINE_ENABLED_VARIANTS = new Set(
  SUMUP_CATALOG_CLIENT.map((e) => e.variant_id),
);
