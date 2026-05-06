export const googleReviewsConfig = {
  maxDisplayedReviews: 5,
  minimumRating: 4,
  fallbackToReturnedOrder: true,
  preferredAuthorNames: [] as string[],
  preferredTextSnippets: [] as string[],
} as const;

export type GoogleReviewsConfig = typeof googleReviewsConfig;

