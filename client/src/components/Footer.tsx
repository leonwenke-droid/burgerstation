import { Instagram, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

const PHONE = "tel:+4949199755279";
const PHONE_DISPLAY = "0491 99 755 279";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";
const INSTAGRAM = "https://instagram.com/burgerstationleer";

export default function Footer() {
  return (
    <footer className="border-t-4 border-bs-ink">
      {/* Teal checker top strip */}
      <div className="checker-strip" aria-hidden="true"></div>

      <div style={{ background: "var(--bs-surface-top)" }}>
        <div className="container py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand col */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/brand/burger-station-logo-transparent.png"
                  alt="Burger Station Leer Logo"
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <div className="text-subhead text-2xl text-bs-ink uppercase tracking-tight">
                    BURGER STATION
                  </div>
                  <div className="text-label-caps text-xs text-bs-teal mt-0.5">
                    Est. 2025 · Leer
                  </div>
                </div>
              </div>
              <p className="text-bs-ink-v leading-relaxed max-w-md">
                Authentic Smash Burgers, Halal &amp; Handmade. American Retro
                Diner direkt am Bahnhofsring in Leer.
              </p>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 font-body font-semibold tracking-wide text-bs-ink hover:text-bs-teal transition"
              >
                <Instagram size={18} />
                @burgerstationleer
              </a>
            </div>

            {/* Navigation col */}
            <div>
              <h4 className="text-label-caps text-bs-ink mb-4">SEITEN</h4>
              <ul className="space-y-2 text-sm">
                {[
                  ["Home", "/"],
                  ["Menü", "/menu"],
                  ["Über uns", "/about"],
                  ["Standort", "/locations"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-bs-ink-v hover:text-bs-teal transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact col */}
            <div>
              <h4 className="text-label-caps text-bs-ink mb-4">KONTAKT</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-bs-teal mt-0.5 shrink-0" />
                  <div className="text-bs-ink-v leading-relaxed">
                    Bahnhofsring 30
                    <br />
                    26789 Leer
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-bs-ink mt-0.5 shrink-0" />
                  <a
                    href={PHONE}
                    className="text-bs-ink-v hover:text-bs-teal transition"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </div>
                <div className="text-bs-ink/60 text-xs leading-relaxed pt-1">
                  So–Do: 11:00 – 23:00 Uhr
                  <br />
                  Fr &amp; Sa: 11:00 – 02:00 Uhr
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t-2 border-dashed border-bs-ink/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-bs-ink/60">
              © 2026 Burger Station Leer. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-5 text-sm">
              <Link
                href="/impressum"
                className="text-bs-ink-v hover:text-bs-teal transition"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-bs-ink-v hover:text-bs-teal transition"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
