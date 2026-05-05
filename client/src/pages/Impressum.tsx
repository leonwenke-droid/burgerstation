import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-[#FEFCCF] text-bs-ink">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16 pb-24">
        {/* Page heading */}
        <div className="mb-10">
          <span className="badge-neon badge-pink-fill mb-4 inline-block">
            RECHTLICHES
          </span>
          <h1 className="text-display text-5xl md:text-7xl text-bs-ink uppercase">
            Impressum
          </h1>
        </div>

        <div className="retro-card p-8 md:p-12 space-y-8 text-bs-ink/85 leading-relaxed">
          <section>
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Burger Station Leer
              <br />
              Bahnhofsring 30
              <br />
              26789 Leer
              <br />
              Niedersachsen, Deutschland
            </p>
          </section>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">Kontakt</h2>
            <p>
              Telefon:{" "}
              <a
                href="tel:+4949199755279"
                className="text-bs-pink hover:underline font-semibold"
              >
                0491 99 755 279
              </a>
              <br />
              Instagram:{" "}
              <a
                href="https://instagram.com/burgerstationleer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bs-pink hover:underline font-semibold"
              >
                @burgerstationleer
              </a>
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              Verantwortlich für den Inhalt
            </h2>
            <p>
              Betreiber von Burger Station Leer
              <br />
              Bahnhofsring 30
              <br />
              26789 Leer
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              EU-Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bs-pink hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .
            </p>
            <p className="mt-2">
              Unsere E-Mail-Adresse ist in diesem Impressum nicht aufgeführt, da
              wir kein Online-Bestellsystem betreiben und Bestellungen
              ausschließlich vor Ort entgegennehmen.
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              Verbraucherstreitbeilegung
            </h2>
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
