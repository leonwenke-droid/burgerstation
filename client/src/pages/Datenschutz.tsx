import LegalPageLayout, { LegalP, LegalSection, LegalUl } from "@/components/LegalPageLayout";
import { LEGAL } from "@/data/legalConfig";

export default function Datenschutz() {
  return (
    <LegalPageLayout title="Datenschutz" badgeClass="badge-neon badge-cyan-fill">
      <LegalSection title="1. Verantwortlicher" first>
        <LegalP>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO), des
          Bundesdatenschutzgesetzes (BDSG) sowie des Telekommunikation-Telemedien-Datenschutz-Gesetzes
          (TTDSG) ist:
        </LegalP>
        <LegalP>
          {LEGAL.companyName}
          <br />
          {LEGAL.street}
          <br />
          {LEGAL.zipCity}
          <br />
          Telefon:{" "}
          <a href={`tel:${LEGAL.phoneTel}`} className="text-bs-teal underline">{LEGAL.phone}</a>
          <br />
          E-Mail:{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-bs-teal underline">{LEGAL.email}</a>
          <br />
          Umsatzsteuer-Identifikationsnummer: {LEGAL.ustId}
        </LegalP>
        <LegalP>Nachfolgend „wir" oder „Burgerstation".</LegalP>
        <LegalP>
          Eine gesetzliche Pflicht zur Benennung eines/einer Datenschutzbeauftragten besteht nach
          derzeitigem Stand nicht.
        </LegalP>
      </LegalSection>

      <LegalSection title="2. Grundsätze unserer Datenverarbeitung">
        <LegalP>
          Wir verarbeiten personenbezogene Daten unserer Nutzer:innen grundsätzlich nur, soweit dies
          zur Bereitstellung einer funktionsfähigen Website, zur Abwicklung deiner Bestellung oder
          zur Erfüllung gesetzlicher Verpflichtungen erforderlich ist. Die Verarbeitung
          personenbezogener Daten erfolgt regelmäßig nur nach deiner Einwilligung oder auf Grundlage
          einer der gesetzlich vorgesehenen Rechtsgrundlagen, insbesondere Artikel 6 Absatz 1 DSGVO.
        </LegalP>
        <LegalP>Wenn wir uns nachfolgend auf einzelne Rechtsgrundlagen beziehen, sind in der Regel die folgenden gemeint:</LegalP>
        <LegalUl items={[
          "Artikel 6 Absatz 1 Buchstabe a DSGVO bei einer Einwilligung,",
          "Artikel 6 Absatz 1 Buchstabe b DSGVO bei einer Verarbeitung zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen,",
          "Artikel 6 Absatz 1 Buchstabe c DSGVO zur Erfüllung einer rechtlichen Verpflichtung,",
          "Artikel 6 Absatz 1 Buchstabe f DSGVO zur Wahrung berechtigter Interessen.",
        ]} />
      </LegalSection>

      <LegalSection title="3. Bereitstellung der Website und Server-Logfiles">
        <LegalP>
          Wenn du unsere Website aufrufst, übermittelt dein Browser aus technischen Gründen
          automatisch Daten an den Server, auf dem unsere Website gehostet wird. Hierbei werden
          vorübergehend folgende Daten verarbeitet:
        </LegalP>
        <LegalUl items={[
          "deine IP-Adresse,",
          "Datum und Uhrzeit des Zugriffs,",
          "Name und URL der abgerufenen Datei beziehungsweise Seite,",
          "Referrer-URL (zuvor besuchte Website),",
          "verwendeter Browsertyp und -version, Betriebssystem,",
          "übertragene Datenmenge.",
        ]} />
        <LegalP>
          Die Verarbeitung erfolgt zur Sicherstellung eines reibungslosen Verbindungsaufbaus der
          Website, zur Gewährleistung einer komfortablen Nutzung sowie zur Sicherheit und
          Stabilität unserer Systeme. Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe f DSGVO;
          unser berechtigtes Interesse besteht in einer technisch funktionsfähigen und sicheren
          Website.
        </LegalP>
        <LegalP>
          Diese Zugriffsdaten werden in der Regel nach {LEGAL.logRetentionDays} Tagen automatisiert
          gelöscht, soweit sie nicht ausnahmsweise zur Aufklärung eines konkreten
          Sicherheitsvorfalls länger benötigt werden.
        </LegalP>
      </LegalSection>

      <LegalSection title="4. Hosting bei Vercel">
        <LegalP>
          Unsere Website wird gehostet bei der Vercel Inc., 440 N Barranca Avenue #4133, Covina,
          CA 91723, USA („Vercel"). Vercel verarbeitet als Auftragsverarbeiter im Sinne von Artikel
          28 DSGVO die in Ziffer 3 genannten Server-Logfile-Daten sowie alle weiteren Inhalte, die
          du im Zuge der Nutzung der Website an unseren Server übermittelst.
        </LegalP>
        <LegalP>
          Da Vercel Server auch außerhalb der Europäischen Union, namentlich in den USA, betreibt,
          kann es zu einer Übermittlung personenbezogener Daten in Drittländer kommen. Um ein
          angemessenes Schutzniveau zu gewährleisten, haben wir mit Vercel die EU-Standardvertragsklauseln
          (Beschluss (EU) 2021/914 der Europäischen Kommission) gemäß Artikel 46 Absatz 2 Buchstabe c
          DSGVO abgeschlossen. Zudem ist Vercel nach dem EU-U.S. Data Privacy Framework zertifiziert.
          Weitere Informationen findest du in der Datenschutzerklärung von Vercel unter{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline">
            vercel.com/legal/privacy-policy
          </a>.
        </LegalP>
      </LegalSection>

      <LegalSection title="5. Verarbeitung bei der Bestellung">
        <LegalP>Wenn du eine Bestellung über unsere Website aufgibst, erheben und verarbeiten wir die folgenden personenbezogenen Daten:</LegalP>
        <LegalUl items={[
          "Vor- und Nachname zur eindeutigen Zuordnung der Bestellung und zur Identifikation an der Haustür,",
          "Lieferadresse (Straße, Hausnummer, Postleitzahl 26789 Leer, Adresszusatz) zur Auslieferung der Ware,",
          "E-Mail-Adresse zur Übersendung der gesetzlich vorgeschriebenen Bestellbestätigung gemäß § 312i Absatz 1 Satz 1 Nummer 3 BGB sowie für die weitere Kommunikation rund um deine Bestellung,",
          "Telefonnummer für Rückfragen unseres Fahrers bei Schwierigkeiten beim Auffinden der Lieferadresse oder bei Erreichbarkeitsproblemen vor Ort,",
          "Bestelldaten (gewählte Artikel, Modifikationen, Mengen, Anmerkungen, Bestellzeitpunkt, gewählte Zahlungsart, Bestellbetrag) zur Vertragserfüllung und zur ordnungsgemäßen Buchführung,",
          <>bei Bestellung alkoholischer Getränke zusätzlich ein interner Vermerk zur erforderlichen Alterssichtprüfung durch den Fahrer (siehe § 7 unserer <a href="/agb" className="text-bs-teal underline">AGB</a>).</>,
        ]} />
        <LegalP>
          Rechtsgrundlage für diese Verarbeitung ist Artikel 6 Absatz 1 Buchstabe b DSGVO
          (Vertragserfüllung und vorvertragliche Maßnahmen) sowie Artikel 6 Absatz 1 Buchstabe c
          DSGVO (Erfüllung rechtlicher Verpflichtungen, insbesondere handels- und steuerrechtlicher
          Aufzeichnungs- und Aufbewahrungspflichten).
        </LegalP>
      </LegalSection>

      <LegalSection title="6. Zahlungsabwicklung über SumUp">
        <LegalP>
          Für die Online-Zahlungsabwicklung setzen wir den Zahlungsdienstleister SumUp Limited,
          Block 8, Harcourt Centre, Charlotte Way, Dublin 2, Irland („SumUp"), ein.
        </LegalP>
        <LegalP>
          Wenn du eine Online-Zahlung auswählst, werden deine Zahlungsdaten — insbesondere die
          Daten der gewählten Zahlungsmethode wie Kartendaten, Apple Pay oder Google Pay — sowie
          zur Zuordnung der Zahlung erforderliche Bestelldaten (Bestellreferenz, Bestellbetrag,
          gegebenenfalls Name und E-Mail-Adresse) direkt von SumUp verarbeitet. Die Eingabe der
          Zahlungsdaten erfolgt über eine von SumUp bereitgestellte verschlüsselte Eingabemaske. Wir
          selbst erhalten zu keinem Zeitpunkt Zugriff auf deine vollständigen Kartendaten; wir
          erhalten lediglich eine Bestätigung der erfolgreichen Autorisierung sowie eine
          pseudonymisierte Transaktionsreferenz.
        </LegalP>
        <LegalP>
          Rechtsgrundlage für die Übermittlung an SumUp ist Artikel 6 Absatz 1 Buchstabe b DSGVO
          (Vertragserfüllung). SumUp verarbeitet die Daten teilweise als eigener Verantwortlicher und
          teilweise in unserem Auftrag; insoweit haben wir mit SumUp einen Auftragsverarbeitungsvertrag
          gemäß Artikel 28 DSGVO abgeschlossen. Weitere Informationen zur Datenverarbeitung durch
          SumUp findest du in der Datenschutzerklärung von SumUp unter{" "}
          <a href="https://sumup.com/de/privacy/" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline">
            sumup.com/de/privacy/
          </a>.
        </LegalP>
      </LegalSection>

      <LegalSection title="7. Übermittlung an das stationäre Kassensystem (SumUp POS Pro) und finanzamtskonforme Erfassung (TSE/KassenSichV)">
        <LegalP>
          Nach erfolgreichem Vertragsschluss werden deine Bestelldaten automatisiert an unser
          stationäres Kassensystem SumUp POS Pro in unserem Lieferstore in Leer übermittelt. Diese
          Übermittlung dient
        </LegalP>
        <LegalP>
          (a) der internen Bestellabwicklung (Druck eines Küchenbons, Disposition der Lieferung,
          Statusverfolgung) sowie
        </LegalP>
        <LegalP>
          (b) der finanzamtskonformen Erfassung deiner Bestellung im Sinne der
          Kassensicherungsverordnung (KassenSichV) unter Einbindung einer zertifizierten technischen
          Sicherheitseinrichtung (TSE) gemäß § 146a Abgabenordnung (AO).
        </LegalP>
        <LegalP>
          Die im Rahmen der TSE erfassten Buchungsdaten unterliegen den gesetzlichen
          Aufbewahrungspflichten von zehn Jahren (§ 147 Absatz 1 und 3 AO, § 257 Absatz 1 und 4 HGB)
          und können in diesem Zeitraum von uns nicht gelöscht werden.
        </LegalP>
        <LegalP>
          Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO (Vertragserfüllung) sowie Artikel
          6 Absatz 1 Buchstabe c DSGVO (Erfüllung rechtlicher Verpflichtungen).
        </LegalP>
      </LegalSection>

      <LegalSection title="8. Verwendung von Web Storage (sessionStorage und localStorage)">
        <LegalP>
          Zur Bereitstellung der Bestellfunktion und zur Aufrechterhaltung der Sitzung greifen wir
          auf den Web Storage deines Browsers zu. Dies ist eine Speichertechnologie, die einer
          Cookie-Nutzung im Sinne von § 25 TTDSG vergleichbar ist. Wir setzen Web Storage in
          folgendem Umfang ein:
        </LegalP>
        <LegalP>
          (a) Sitzungsbezogener Speicher (sessionStorage) zur Speicherung einer technischen
          Sitzungskennung („bs_session_id"), einer Checkout-Referenz („bs_checkout_id",
          „bs_pos_order", „bs_order_ref", „bs_order_num") sowie weiterer technisch notwendiger
          Bestellkennungen. Diese Einträge sind ausschließlich für die Dauer deiner Browser-Sitzung
          gespeichert und werden mit dem Schließen des Browserfensters oder -tabs automatisch
          gelöscht.
        </LegalP>
        <LegalP>
          Diese Zugriffe sind unbedingt erforderlich, damit wir dir den von dir ausdrücklich
          gewünschten Dienst — die Bereitstellung der Online-Bestellfunktion einschließlich Warenkorb
          und Bezahlvorgang — zur Verfügung stellen können. Eine Einwilligung ist daher nach § 25
          Absatz 2 Nummer 2 TTDSG nicht erforderlich.
        </LegalP>
        <LegalP>
          (b) Dauerhafter Speicher (localStorage) zur Speicherung deiner Designpräferenz
          (Hell-/Dunkelmodus der Website unter dem Schlüssel „theme"). Dieser Eintrag bleibt
          bestehen, bis du ihn aktiv über die Browser-Einstellungen löschst.
        </LegalP>
        <LegalP>
          Soweit du den Hell-/Dunkelmodus-Schalter nutzt, gehen wir von einer konkludenten
          Einwilligung im Sinne von Artikel 6 Absatz 1 Buchstabe a DSGVO und § 25 Absatz 1 TTDSG
          aus, da das Setzen dieser Präferenz unmittelbar durch deine Benutzerinteraktion ausgelöst
          wird. Du kannst die Speicherung jederzeit verhindern, indem du den Speicher deines Browsers
          löschst oder den Schalter zurücksetzt.
        </LegalP>
        <LegalP>
          In keinem Fall enthält der Web Storage Klarnamen, Adressdaten oder Zahlungsinformationen.
          Es findet keine Verknüpfung mit anderen personenbezogenen Daten zur Profilbildung statt.
        </LegalP>
      </LegalSection>

      <LegalSection title="9. Live-Erfassung der Sitzungsaktivität auf unserem Server">
        <LegalP>
          Zur Steuerung unseres Bestellbetriebs (insbesondere zur Einschätzung der aktuellen
          Auslastung des Bestellsystems) führt unser Server eine technische Live-Erfassung aktiver
          Sitzungen und aktiver Warenkörbe durch.
        </LegalP>
        <LegalP>
          Diese Erfassung erfolgt durch Übermittlung der unter Ziffer 8 (a) genannten
          Sitzungskennung an unseren Server in einem regelmäßigen Heartbeat-Intervall sowie bei
          Cart-Aktualisierungen. Die Sitzungskennung wird gemeinsam mit dem Zeitpunkt der letzten
          Aktivität ausschließlich im flüchtigen Arbeitsspeicher des Servers gehalten. Eine Sitzung
          wird nach spätestens 45 Sekunden Inaktivität automatisch aus dem Arbeitsspeicher
          entfernt; spätestens beim Schließen des Browserfensters wird die Sitzung über den
          Mechanismus navigator.sendBeacon ebenfalls aktiv beendet.
        </LegalP>
        <LegalP>
          Es findet keine dauerhafte Speicherung in einer Datenbank statt, keine Profilbildung über
          einzelne Nutzer:innen hinweg, und keine Übermittlung an Dritte.
        </LegalP>
        <LegalP>
          Als technischer Fallback (etwa bei fehlerhaft übermittelter Sitzungskennung) wird die
          IP-Adresse deiner Verbindung verwendet, um eine Sitzung dennoch zuordnen zu können. Auch
          diese Verarbeitung erfolgt ausschließlich im flüchtigen Arbeitsspeicher und wird mit
          Ablauf der Sitzung verworfen.
        </LegalP>
        <LegalP>
          Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe f DSGVO; unser berechtigtes Interesse
          besteht in der kapazitätsgerechten Steuerung des Bestellbetriebs und der Sicherstellung der
          Verfügbarkeit. Du kannst dieser Verarbeitung jederzeit nach Maßgabe von Artikel 21 DSGVO
          widersprechen; in diesem Fall steht dir die Bestellfunktion gegebenenfalls nicht oder nur
          eingeschränkt zur Verfügung.
        </LegalP>
      </LegalSection>

      <LegalSection title="10. Verarbeitete Bestelldaten in unserem Backend">
        <LegalP>
          Im Rahmen des Bestellbetriebs hält unser Server für die Dauer des Betriebs eine interne
          Übersicht aktueller Bestellungen (Bestellnummer, Zeitstempel, Betrag, Status, Artikel,
          gegebenenfalls Name und Telefonnummer) im Arbeitsspeicher vor. Diese Übersicht dient der
          internen Betriebsführung (Disposition, Übergabe an die Küche, Übergabe an den Fahrer).
        </LegalP>
        <LegalP>
          Die buchhalterisch und steuerlich relevante, dauerhafte Speicherung deiner Bestelldaten
          erfolgt über das stationäre Kassensystem SumUp POS Pro mit angeschlossener TSE (siehe
          Ziffer 7). Soweit Bestelldaten im Arbeitsspeicher unseres Servers vorgehalten werden,
          werden sie spätestens mit dem nächsten Neustart der Serverinstanz oder nach Erreichen einer
          betrieblichen Höchstgrenze von 500 Bestellungen automatisch verworfen.
        </LegalP>
        <LegalP>
          Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO (Vertragserfüllung) sowie Artikel
          6 Absatz 1 Buchstabe c DSGVO (Erfüllung rechtlicher Verpflichtungen) in Verbindung mit
          der Speicherung im SumUp POS Pro gemäß Ziffer 7.
        </LegalP>
      </LegalSection>

      <LegalSection title="11. E-Mail-Versand der Bestellbestätigung">
        <LegalP>
          Zur Versendung der gesetzlich vorgeschriebenen Bestellbestätigung gemäß § 312i Absatz 1
          Satz 1 Nummer 3 BGB sowie weiterer transaktionsbezogener E-Mails setzen wir den
          Dienstleister {LEGAL.emailProvider} ein. Mit diesem Dienstleister haben wir einen
          Auftragsverarbeitungsvertrag gemäß Artikel 28 DSGVO geschlossen. Soweit der Dienstleister
          Daten in Drittländer übermittelt, erfolgt dies auf Grundlage der EU-Standardvertragsklauseln.
        </LegalP>
        <LegalP>
          Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO (Vertragserfüllung) sowie Artikel
          6 Absatz 1 Buchstabe c DSGVO (Erfüllung rechtlicher Verpflichtungen).
        </LegalP>
      </LegalSection>

      <LegalSection title="12. Google Bewertungen">
        <LegalP>
          Auf unserer Website binden wir öffentlich verfügbare Bewertungen unseres
          Google-Business-Profils ein. Der Abruf der Bewertungen erfolgt serverseitig durch uns über
          die offizielle Schnittstelle (Google Places API). Es findet kein direkter Verbindungsaufbau
          zwischen deinem Browser und Google statt; es werden insbesondere keine Cookies durch Google
          auf deinem Endgerät gesetzt. Die angezeigten Bewertungen werden bei uns zwischengespeichert
          und in regelmäßigen Abständen aktualisiert.
        </LegalP>
        <LegalP>
          Rechtsgrundlage für die Einbindung der Bewertungen ist Artikel 6 Absatz 1 Buchstabe f
          DSGVO; unser berechtigtes Interesse besteht in einer aussagekräftigen Außendarstellung
          unseres Betriebs.
        </LegalP>
      </LegalSection>

      <LegalSection title="13. Empfänger und Auftragsverarbeiter">
        <LegalP>
          Personenbezogene Daten geben wir nur an Dritte weiter, soweit dies zur Vertragserfüllung
          erforderlich ist, soweit du ausdrücklich eingewilligt hast oder soweit wir gesetzlich dazu
          verpflichtet sind. Folgende Empfänger kommen regelmäßig in Betracht:
        </LegalP>
        <LegalUl items={[
          "Vercel Inc. (USA) — Hosting der Website (Ziffer 4),",
          "SumUp Limited (Irland) — Online-Zahlungsabwicklung und Synchronisation mit dem stationären Kassensystem (Ziffern 6 und 7),",
          `${LEGAL.emailProvider} — Versand transaktionsbezogener E-Mails (Ziffer 11),`,
          "Google Ireland Limited (Irland) — bereitgestellte Bewertungsdaten der Google Places API (Ziffer 12),",
          `${LEGAL.taxAdvisor} — im Rahmen der gesetzlichen Buchführung,`,
          "Behörden und Gerichte, soweit eine gesetzliche Verpflichtung zur Auskunftserteilung besteht.",
        ]} />
      </LegalSection>

      <LegalSection title="14. Speicherdauer">
        <LegalP>
          Wir speichern personenbezogene Daten nur so lange, wie es zur Erfüllung der jeweiligen
          Zwecke erforderlich ist oder wie es gesetzliche Aufbewahrungspflichten vorgeben.
        </LegalP>
        <LegalP>Insbesondere gilt:</LegalP>
        <LegalUl items={[
          "Bestelldaten unterliegen den handels- und steuerrechtlichen Aufbewahrungspflichten und werden für zehn Jahre ab Ende des jeweiligen Kalenderjahres aufbewahrt (§ 147 AO, § 257 HGB). Die Speicherung erfolgt im Rahmen des SumUp POS Pro / TSE.",
          `Server-Zugriffsdaten (Ziffer 3) werden spätestens nach ${LEGAL.logRetentionDays} Tagen gelöscht.`,
          "Im Arbeitsspeicher des Servers gehaltene Sitzungs- und Bestelldaten (Ziffern 9 und 10) werden gemäß den dort beschriebenen Mechanismen automatisch verworfen.",
          "Web-Storage-Einträge (Ziffer 8) werden mit Schließen des Browser-Tabs (sessionStorage) bzw. durch deine aktive Löschung (localStorage) entfernt.",
        ]} />
      </LegalSection>

      <LegalSection title="15. Deine Rechte als betroffene Person">
        <LegalP>Du hast uns gegenüber als betroffene Person folgende Rechte hinsichtlich der dich betreffenden personenbezogenen Daten:</LegalP>
        <LegalUl items={[
          "Recht auf Auskunft gemäß Artikel 15 DSGVO,",
          "Recht auf Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten gemäß Artikel 16 DSGVO,",
          'Recht auf Löschung („Recht auf Vergessenwerden") gemäß Artikel 17 DSGVO, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen,',
          "Recht auf Einschränkung der Verarbeitung gemäß Artikel 18 DSGVO,",
          "Recht auf Datenübertragbarkeit gemäß Artikel 20 DSGVO,",
          "Widerspruchsrecht gegen Verarbeitungen, die wir auf Grundlage berechtigter Interessen vornehmen, gemäß Artikel 21 DSGVO,",
          "Recht auf Widerruf einer einmal erteilten Einwilligung mit Wirkung für die Zukunft gemäß Artikel 7 Absatz 3 DSGVO.",
        ]} />
        <LegalP>
          Zur Ausübung dieser Rechte genügt eine formlose Nachricht an die in Ziffer 1 genannten
          Kontaktdaten.
        </LegalP>
      </LegalSection>

      <LegalSection title="16. Beschwerderecht bei einer Aufsichtsbehörde">
        <LegalP>
          Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung deiner
          personenbezogenen Daten durch uns zu beschweren. Zuständig ist:
        </LegalP>
        <LegalP>
          Die Landesbeauftragte für den Datenschutz Niedersachsen
          <br />
          Prinzenstraße 5
          <br />
          30159 Hannover
          <br />
          Telefon: 0511 / 120-4500
          <br />
          E-Mail:{" "}
          <a href="mailto:poststelle@lfd.niedersachsen.de" className="text-bs-teal underline">
            poststelle@lfd.niedersachsen.de
          </a>
          <br />
          <a href="https://lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline">
            lfd.niedersachsen.de
          </a>
        </LegalP>
      </LegalSection>

      <LegalSection title="17. Aktualität und Änderung dieser Datenschutzerklärung">
        <LegalP>
          Diese Datenschutzerklärung hat den Stand: {LEGAL.standDate}. Durch die Weiterentwicklung
          unserer Website oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher
          Vorgaben kann es notwendig werden, diese Datenschutzerklärung anzupassen. Die jeweils
          aktuelle Datenschutzerklärung ist unter{" "}
          <a href="/datenschutz" className="text-bs-teal underline">
            {LEGAL.website.replace("https://", "")}/datenschutz
          </a>{" "}
          abrufbar.
        </LegalP>
      </LegalSection>
    </LegalPageLayout>
  );
}
