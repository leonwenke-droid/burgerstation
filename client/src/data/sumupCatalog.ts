import { getProductBySku, PRODUCTS, requiresSumUpForDelivery } from "@shared/products";

/** Client view of products already linked to real SumUp catalog variants. */
export const SUMUP_CATALOG_CLIENT = PRODUCTS.flatMap((product) =>
  product.sumup
    ? [
        {
          sumup_catalog_id: product.sumup.catalogId,
          variant_id: product.sumup.variantId,
          sku: product.sku,
          name: product.name,
        },
      ]
    : [],
);

/** Set of variant_ids that are cleared for online payment. */
export const ONLINE_ENABLED_VARIANTS = new Set(
  SUMUP_CATALOG_CLIENT.map((entry) => entry.variant_id),
);

export function isCartItemSumUpRequired(item: Pick<{ sku: string }, "sku">): boolean {
  const product = getProductBySku(item.sku);
  return product ? requiresSumUpForDelivery(product) : false;
}

/** True when a delivery order may include this cart line (Smash Burgers need SumUp). */
export function isCartItemDeliveryReady(
  item: Pick<{ sku: string; variant_id?: string }, "sku" | "variant_id">,
): boolean {
  if (!isCartItemSumUpRequired(item)) return true;
  return Boolean(item.variant_id && ONLINE_ENABLED_VARIANTS.has(item.variant_id));
}
