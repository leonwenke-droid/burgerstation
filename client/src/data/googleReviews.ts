// Manually curated Google reviews (no scraping, no API, no auto-sync).
//
// TODO: Paste 5 real approved Google reviews here.
// TODO: Replace fallback links with direct Google profile/review links where available.
// TODO: Do not use fake reviews in production.

export const googleReviews = {
  averageRating: "4,8",
  reviewCount: "XX",
  reviewsUrl: "https://share.google/iEiigXqw0ldw2wlly",
  writeReviewUrl: "https://share.google/iEiigXqw0ldw2wlly",
  reviews: [] as GoogleReview[],
};

export type GoogleReview = {
  authorName: string;
  authorInitials: string;
  authorProfileUrl: string;
  reviewUrl: string;
  rating: 1 | 2 | 3 | 4 | 5;
  relativeTime: string;
  text: string;
};

/*
Example entry (keep manually curated only):
{
  authorName: "REAL_REVIEWER_NAME",
  authorInitials: "AB",
  authorProfileUrl: "",
  reviewUrl: "https://share.google/iEiigXqw0ldw2wlly",
  rating: 5,
  relativeTime: "vor 2 Wochen",
  text: "REAL_GOOGLE_REVIEW_TEXT",
}
*/

