import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
  badge?: string;
  badgeClass?: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({
  title,
  children,
  first,
}: {
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section className={first ? "" : "border-t-2 border-dashed border-bs-ink/20 pt-8"}>
      <h2 className="text-subhead text-xl md:text-2xl text-bs-ink mb-3">{title}</h2>
      <div className="space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}

export function LegalP({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={className}>{children}</p>;
}

export function LegalUl({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function LegalPageLayout({
  badge = "RECHTLICHES",
  badgeClass = "badge-neon badge-pink-fill",
  title,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FEFCCF] text-bs-ink">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 pb-24">
        <div className="mb-10">
          <span className={`${badgeClass} mb-4 inline-block`}>{badge}</span>
          <h1 className="text-display text-4xl md:text-6xl text-bs-ink uppercase">{title}</h1>
        </div>
        <div className="retro-card p-8 md:p-12 space-y-8 text-bs-ink/85 leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
