import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-[#FEFCCF] text-bs-ink">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16 pb-24">
        {/* Page heading */}
        <div className="mb-10">
          <span className="badge-neon badge-cyan-fill mb-4 inline-block">
            RECHTLICHES
          </span>
          <h1 className="text-display text-5xl md:text-7xl text-bs-ink uppercase">
            Datenschutz
          </h1>
        </div>

        <div className="retro-card p-8 md:p-12 space-y-8 text-bs-ink/85 leading-relaxed">
          <section>
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="font-body font-bold text-lg text-bs-ink mt-4 mb-2">
              Allgemeine Hinweise
            </h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              2. Datenerfassung auf dieser Website
            </h2>
            <h3 className="font-body font-bold text-lg text-bs-ink mt-4 mb-2">
              Wer ist verantwortlich für die Datenerfassung?
            </h3>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
              dieser Website entnehmen.
            </p>

            <h3 className="font-body font-bold text-lg text-bs-ink mt-6 mb-2">
              Wie erfassen wir Ihre Daten?
            </h3>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen (z.B. durch einen Anruf). Andere Daten werden
              automatisch oder nach Ihrer Einwilligung beim Besuch der Website
              durch unsere IT-Systeme erfasst. Das sind vor allem technische
              Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
              Seitenaufrufs).
            </p>

            <h3 className="font-body font-bold text-lg text-bs-ink mt-6 mb-2">
              Wofür nutzen wir Ihre Daten?
            </h3>
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              3. Hosting
            </h2>
            <p>
              Diese Website wird extern gehostet. Die personenbezogenen Daten,
              die auf dieser Website erfasst werden, werden auf den Servern des
              Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen,
              Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten,
              Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über
              eine Website generiert werden, handeln.
            </p>
            <p className="mt-3">
              Die Nutzung des Hosters erfolgt zum Zwecke der Vertragserfüllung
              gegenüber unseren potenziellen und bestehenden Kunden (Art. 6
              Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen
              und effizienten Bereitstellung unseres Online-Angebots durch einen
              professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              4. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <h3 className="font-body font-bold text-lg text-bs-ink mt-4 mb-2">
              Datenschutz
            </h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mt-3">
              Diese Website verwendet keine Cookies für Tracking oder Analyse.
              Es werden keine externen Analyse-Dienste eingebunden.
            </p>

            <h3 className="font-body font-bold text-lg text-bs-ink mt-6 mb-2">
              Externe Links
            </h3>
            <p>
              Diese Website enthält Links zu externen Diensten (Google Maps,
              Instagram, OpenStreetMap). Für die Inhalte dieser verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
              verantwortlich. Bitte beachten Sie die Datenschutzerklärungen der
              jeweiligen Anbieter.
            </p>
          </div>

          <div className="border-t-2 border-dashed border-bs-ink/20 pt-8">
            <h2 className="text-subhead text-2xl text-bs-ink mb-3">
              5. Ihre Rechte
            </h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn
              Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können
              Sie diese Einwilligung jederzeit für die Zukunft widerrufen.
              Außerdem haben Sie das Recht, unter bestimmten Umständen die
              Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
              verlangen.
            </p>
            <p className="mt-3">
              Für Fragen zum Datenschutz wenden Sie sich bitte direkt an uns
              über die Kontaktdaten im{" "}
              <a href="/impressum" className="text-bs-pink hover:underline font-semibold">
                Impressum
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
