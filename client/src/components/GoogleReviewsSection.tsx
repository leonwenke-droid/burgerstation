import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { googleReviewsConfig } from "@/config/googleReviews";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type GoogleReview = {
  id: string;
  authorName: string;
  authorProfileUrl: string;
  authorPhotoUrl: string;
  rating: 1 | 2 | 3 | 4 | 5;
  relativeTime: string;
  publishTime: string;
  text: string;
  language: string;
};

type GoogleReviewsResponse = {
  source: "google";
  placeName: string;
  rating: number | null;
  userRatingsTotal: number | null;
  reviewsUrl: string;
  writeReviewUrl: string;
  reviews: GoogleReview[];
  updatedAt: string;
};

function initialsFromName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

function formatNumberDE(n: number) {
  return new Intl.NumberFormat("de-DE").format(n);
}

function selectReviews(reviews: GoogleReview[]) {
  const max = googleReviewsConfig.maxDisplayedReviews;
  const minRating = googleReviewsConfig.minimumRating;
  const preferNames = googleReviewsConfig.preferredAuthorNames.map((s) => s.toLowerCase());
  const preferSnippets = googleReviewsConfig.preferredTextSnippets.map((s) => s.toLowerCase());

  const scored = reviews.map((r) => {
    const name = r.authorName.toLowerCase();
    const text = r.text.toLowerCase();
    const nameMatch = preferNames.some((p) => p && name.includes(p));
    const snippetMatch = preferSnippets.some((p) => p && text.includes(p));
    const preferredScore = (nameMatch ? 2 : 0) + (snippetMatch ? 1 : 0);
    return { r, preferredScore };
  });

  const preferred = scored
    .filter((x) => x.preferredScore > 0)
    .sort((a, b) => b.preferredScore - a.preferredScore)
    .map((x) => x.r);

  const returnedOrder = reviews.slice();

  const baseOrder =
    preferred.length > 0
      ? [...preferred, ...returnedOrder.filter((r) => !preferred.includes(r))]
      : googleReviewsConfig.fallbackToReturnedOrder
        ? returnedOrder
        : returnedOrder;

  // Filter low ratings unless we'd drop below 3 reviews.
  const filtered = baseOrder.filter((r) => r.rating >= minRating);
  const finalList = (filtered.length >= 3 ? filtered : baseOrder).slice(0, max);

  return finalList;
}

function StarsRow({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, idx) => idx < rating);
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} von 5 Sternen`}>
      {stars.map((filled, i) => (
        <Star
          key={i}
          size={16}
          className={filled ? "text-bs-teal" : "text-bs-ink/25"}
          fill={filled ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function GoogleReviewsSection() {
  const [data, setData] = useState<GoogleReviewsResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setStatus("loading");
        setErrorMsg("");
        const res = await fetch("/api/google-reviews", { headers: { Accept: "application/json" } });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Request failed (${res.status})`);
        }
        const json = (await res.json()) as GoogleReviewsResponse;
        if (!cancelled) {
          setData(json);
          setStatus("idle");
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(e instanceof Error ? e.message : String(e));
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(() => selectReviews(data?.reviews ?? []), [data]);

  const reviewsUrl =
    (import.meta.env.VITE_GOOGLE_REVIEWS_URL as string | undefined) ||
    data?.reviewsUrl ||
    "https://share.google/iEiigXqw0ldw2wlly";

  const writeReviewUrl =
    (import.meta.env.VITE_GOOGLE_WRITE_REVIEW_URL as string | undefined) ||
    data?.writeReviewUrl ||
    "https://share.google/iEiigXqw0ldw2wlly";

  const ratingLabel =
    data?.rating != null ? String(data.rating).replace(".", ",") : "—";
  const countLabel =
    data?.userRatingsTotal != null ? formatNumberDE(data.userRatingsTotal) : "—";

  return (
    <section className="py-20 md:py-24 bg-bs-surface-hi">
      <div className="container">
        <div className="text-center mb-12">
          <span className="badge-neon badge-pink-fill">ECHTE GOOGLE REVIEWS</span>
          <h2 className="text-headline text-4xl md:text-5xl lg:text-6xl text-bs-ink mt-4 uppercase">
            Was Leer über unsere Burger sagt
          </h2>
          <p className="text-bs-ink-v mt-5 max-w-2xl mx-auto">
            Frisch gesmasht, ehrlich bewertet. Direkt von Google.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <div className="inline-flex items-center justify-center gap-2 bg-bs-yellow border-2 border-bs-ink rounded-full px-4 py-2 text-label-caps shadow-[2px_2px_0_var(--bs-ink)]">
              <span className="font-body font-black text-bs-ink">{ratingLabel}</span>
              <span aria-hidden="true">★</span>
              <span className="text-bs-ink/70">auf Google</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 bg-white border-2 border-bs-ink rounded-full px-4 py-2 text-label-caps shadow-[2px_2px_0_var(--bs-ink)]">
              <span className="font-body font-black text-bs-ink">{countLabel}</span>
              <span className="text-bs-ink/70">Bewertungen</span>
            </div>
          </div>

          <p className="text-bs-ink/60 text-sm mt-3">
            Bewertungen stammen von Google.
          </p>
        </div>

        {status === "loading" ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border-[3px] border-bs-ink p-6 md:p-8 shadow-[6px_6px_0_var(--bs-ink)] text-center">
            <p className="text-subhead text-xl text-bs-ink">Lade Google Reviews…</p>
            <p className="text-bs-ink/60 mt-2 text-sm">Einen Moment bitte.</p>
          </div>
        ) : status === "error" ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border-[3px] border-bs-ink p-6 md:p-8 shadow-[6px_6px_0_var(--bs-ink)] text-center">
            <p className="text-subhead text-xl text-bs-ink">Google Reviews nicht verfügbar</p>
            <p className="text-bs-ink-v mt-3">
              {errorMsg ? `Fehler: ${errorMsg}` : "Bitte später erneut versuchen."}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-cyan btn-sm justify-center"
              >
                Alle Bewertungen ansehen
              </a>
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-pink btn-sm justify-center"
              >
                Bewertung schreiben
              </a>
            </div>
          </div>
        ) : selected.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border-[3px] border-bs-ink p-6 md:p-8 shadow-[6px_6px_0_var(--bs-ink)] text-center">
            <p className="text-subhead text-xl text-bs-ink">Noch keine Reviews geladen</p>
            <p className="text-bs-ink-v mt-3">
              Falls das neu ist: Google Places liefert bis zu 5 Reviews und manchmal keine —
              trotzdem kannst du alle Bewertungen direkt auf Google ansehen.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-cyan btn-sm justify-center"
              >
                Alle Bewertungen ansehen
              </a>
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-pink btn-sm justify-center"
              >
                Bewertung schreiben
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile carousel */}
            <div className="lg:hidden max-w-6xl mx-auto">
              <Carousel
                opts={{ align: "start", loop: false, dragFree: true }}
                className="relative"
              >
                <CarouselContent className="-ml-4">
                  {selected.map((r) => (
                    <CarouselItem
                      key={r.id}
                      className="pl-4 basis-[92%] sm:basis-[72%]"
                    >
                      <ReviewCard r={r} reviewsUrl={reviewsUrl} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 bg-white border-2 border-bs-ink shadow-[2px_2px_0_var(--bs-ink)]" />
                <CarouselNext className="hidden sm:flex -right-4 bg-white border-2 border-bs-ink shadow-[2px_2px_0_var(--bs-ink)]" />
              </Carousel>
            </div>

            {/* Desktop grid */}
            <div
              className="hidden lg:flex flex-wrap justify-center gap-6 max-w-6xl mx-auto"
            >
              {selected.map((r) => (
                <div key={r.id} className="w-[360px] xl:w-[380px]">
                  <ReviewCard r={r} reviewsUrl={reviewsUrl} />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-cyan btn-sm justify-center"
              >
                <Star size={16} /> Alle Bewertungen ansehen
              </a>
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-pink btn-sm justify-center"
              >
                <Star size={16} /> Bewertung schreiben
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ReviewCard({
  r,
  reviewsUrl,
}: {
  r: GoogleReview;
  reviewsUrl: string;
}) {
  const [photoOk, setPhotoOk] = useState(true);

  const authorLink = r.authorProfileUrl?.trim();
  const reviewLink = reviewsUrl;
  const text = (r.text || "").trim();
  const isLong = text.length > 240;

  return (
    <div className="bg-white rounded-xl border-[3px] border-bs-ink p-6 shadow-[5px_5px_0_var(--bs-ink)] flex flex-col gap-4 h-full">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {r.authorPhotoUrl && photoOk ? (
            <img
              src={r.authorPhotoUrl}
              alt=""
              className="w-12 h-12 rounded-full border-2 border-bs-ink object-cover shadow-[2px_2px_0_var(--bs-ink)] bg-white"
              referrerPolicy="no-referrer"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full border-2 border-bs-ink bg-bs-primary-c text-bs-ink flex items-center justify-center font-body font-black tracking-widest shadow-[2px_2px_0_var(--bs-ink)]"
              aria-hidden="true"
            >
              {initialsFromName(r.authorName)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {authorLink ? (
                <a
                  href={authorLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-subhead text-lg text-bs-ink hover:text-bs-teal transition underline decoration-2 underline-offset-4"
                >
                  {r.authorName}
                </a>
              ) : (
                <div className="text-subhead text-lg text-bs-ink">
                  {r.authorName}
                </div>
              )}
              <div className="text-xs text-bs-ink/60 mt-1">{r.relativeTime}</div>
            </div>

            <div className="shrink-0 pt-0.5">
              <StarsRow rating={r.rating} />
            </div>
          </div>
        </div>
      </div>

      <p
        className="text-bs-ink-v leading-relaxed whitespace-pre-line"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 7,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </p>

      <div className="pt-2 mt-auto flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-bs-ink/60">Google Bewertung</span>
        <div className="flex items-center gap-4">
          {isLong && (
            <a
              href={reviewLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-label-caps text-bs-ink/70 border-b-2 border-bs-ink/30 hover:text-bs-ink hover:border-bs-ink transition-colors uppercase"
            >
              Mehr lesen auf Google
            </a>
          )}
          <a
            href={reviewLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-label-caps text-bs-teal border-b-2 border-bs-teal hover:text-bs-ink hover:border-bs-ink transition-colors uppercase"
          >
            Auf Google ansehen
          </a>
        </div>
      </div>
    </div>
  );
}

