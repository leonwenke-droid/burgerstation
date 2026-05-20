export const googleReviewsConfig = {
  maxDisplayedReviews: 5,

  /**
   * Hard floor: reviews below this rating are NEVER shown, regardless of how
   * few reviews remain after filtering. Set to 4 to show only 4- and 5-star
   * reviews.
   */
  minimumRating: 4,

  preferredAuthorNames: [] as string[],
  preferredTextSnippets: [] as string[],

  /**
   * Static fallback reviews shown when the Google API returns fewer than
   * `minimumFallbackCount` reviews that pass the rating filter.
   *
   * HOW TO USE:
   *   1. Copy your best real Google reviews here (text, author, rating).
   *   2. Set `minimumFallbackCount` to the minimum you want to show in the grid.
   *   3. Fallback cards are appended to fill the gap — they look identical to
   *      live cards but carry no `authorProfileUrl` (no avatar link needed).
   *
   * EXAMPLE (uncomment and fill in real data):
   *
   * fallbackReviews: [
   *   {
   *     id: "static-1",
   *     authorName: "Max Mustermann",
   *     authorProfileUrl: "",
   *     authorPhotoUrl: "",
   *     rating: 5 as const,
   *     relativeTime: "vor 2 Wochen",
   *     publishTime: "",
   *     text: "Bester Smash-Burger in Leer! Die Patties sind perfekt gesmasht und der Brioche-Bun einfach toll.",
   *     language: "de",
   *   },
   * ],
   */
  fallbackReviews: [] as {
    id: string;
    authorName: string;
    authorProfileUrl: string;
    authorPhotoUrl: string;
    rating: 4 | 5;
    relativeTime: string;
    publishTime: string;
    text: string;
    language: string;
  }[],

  /** Pad with fallback cards if live filtered results drop below this count. */
  minimumFallbackCount: 3,
} as const;

export type GoogleReviewsConfig = typeof googleReviewsConfig;

