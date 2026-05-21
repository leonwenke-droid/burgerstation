import LegalPageLayout, { LegalP, LegalSection } from "@/components/LegalPageLayout";
import { LEGAL } from "@/data/legalConfig";

export default function AGB() {
  return (
    <LegalPageLayout title="AGB" badgeClass="badge-neon badge-pink-fill">
      <LegalSection title="§ 1 Geltungsbereich und Anbieter" first>
        <LegalP>
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die du als
          Verbraucher:in über die Website{" "}
          <a href={LEGAL.website} className="text-bs-teal underline hover:text-bs-ink">
            {LEGAL.website.replace("https://", "")}
          </a>{" "}
          beim folgenden Anbieter aufgibst:
        </LegalP>
        <LegalP>
          {LEGAL.companyName}
          <br />
          {LEGAL.street}
          <br />
          {LEGAL.zipCity}
          <br />
          Telefon:{" "}
          <a href={`tel:${LEGAL.phoneTel}`} className="text-bs-teal underline">
            {LEGAL.phone}
          </a>
          <br />
          E-Mail:{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-bs-teal underline">
            {LEGAL.email}
          </a>
          <br />
          Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {LEGAL.ustId}
          <br />
          {LEGAL.handelsregister !== "[Falls eingetragen: Amtsgericht …, HRA/HRB …]" && (
            <>Eingetragen im Handelsregister: {LEGAL.handelsregister}<br /></>
          )}
          Vertretungsberechtigte Person: {LEGAL.ownerName}
        </LegalP>
        <LegalP>
          Nachfolgend „wir", „uns" oder „Burgerstation". Mit dem Aufgeben einer Bestellung
          erkennst du diese Bedingungen in der zum Zeitpunkt der Bestellung geltenden Fassung
          an. Abweichende Bedingungen deinerseits gelten nur, wenn wir ihnen ausdrücklich und
          in Textform zugestimmt haben. Verbraucher:in im Sinne dieser AGB ist jede natürliche
          Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer
          gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können
          (§ 13 BGB).
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 2 Vertragsschluss">
        <LegalP>
          Die Darstellung unserer Produkte auf der Website stellt kein rechtlich bindendes
          Angebot dar, sondern eine unverbindliche Aufforderung an dich, deinerseits ein Angebot
          abzugeben (invitatio ad offerendum).
        </LegalP>
        <LegalP>
          Du gibst dein verbindliches Vertragsangebot ab, indem du die gewünschten Artikel in
          den Warenkorb legst, deine Daten eingibst, unsere AGB sowie die Widerrufsbelehrung
          und Datenschutzerklärung zur Kenntnis nimmst und den Button mit der Beschriftung
          „Zahlungspflichtig bestellen" anklickst.
        </LegalP>
        <LegalP>Der Zeitpunkt, zu dem der Kaufvertrag wirksam zustande kommt, hängt von der gewählten Zahlungsart ab:</LegalP>
        <LegalP>
          (1) Bei Auswahl der Online-Zahlung über unseren Zahlungsdienstleister SumUp Limited
          (Kreditkarte, Debitkarte, Apple Pay, Google Pay oder weitere von SumUp angebotene
          Verfahren) kommt der Kaufvertrag in dem Moment wirksam zustande, in dem die Zahlung
          durch SumUp erfolgreich autorisiert und uns die Autorisierungsbestätigung über die
          SumUp-Schnittstelle übermittelt wurde. Unmittelbar im Anschluss erhältst du eine
          automatisierte Bestellbestätigung per E-Mail an die von dir hinterlegte Adresse; diese
          Bestätigung dient zugleich der Erfüllung unserer Informationspflichten nach § 312i
          Absatz 1 Satz 1 Nummer 3 BGB.
        </LegalP>
        <LegalP>
          (2) Bei Auswahl von Barzahlung bei Lieferung oder Kartenzahlung bei Lieferung
          (kontaktlose Zahlung an der Haustür über das mobile Kartenlesegerät unseres Fahrers)
          stellt das Anklicken des Bestell-Buttons lediglich dein verbindliches Angebot dar. Wir
          bestätigen dir den Eingang deiner Bestellung unverzüglich automatisiert per E-Mail;
          diese Eingangsbestätigung stellt noch keine Annahme deines Angebots dar. Der
          Kaufvertrag kommt erst dann zustande, wenn wir dein Angebot ausdrücklich annehmen —
          dies erfolgt entweder durch eine gesonderte Annahmeerklärung per E-Mail oder spätestens
          mit der tatsächlichen Auslieferung der Ware an deine Lieferadresse.
        </LegalP>
        <LegalP>
          Wir behalten uns das Recht vor, Bestellungen ohne Angabe von Gründen abzulehnen,
          insbesondere bei begründetem Verdacht auf missbräuchliche Nutzung, bei Bestellungen
          außerhalb des in § 3 definierten Liefergebiets, bei Nichterreichen des
          Mindestbestellwerts, bei nicht plausiblen Lieferadressen oder wenn wir die Bestellung
          aus betrieblichen Gründen (z. B. Überlastung der Küche, Personalengpass, Ausverkauf
          wesentlicher Artikel) nicht in zumutbarer Zeit ausführen können. Wurde bei
          Online-Zahlung bereits eine Zahlung autorisiert, erstatten wir den abgebuchten Betrag
          unverzüglich über den genutzten Zahlungsweg zurück.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 3 Liefergebiet, Lieferzeiten und Mindestbestellwert">
        <LegalP>
          Wir liefern ausschließlich innerhalb des Stadtgebiets Leer mit der Postleitzahl 26789.
          Bestellungen, die eine abweichende Lieferanschrift aufweisen, können wir nicht
          annehmen; das Bestellsystem weist solche Bestellungen bereits vor Vertragsschluss
          zurück.
        </LegalP>
        <LegalP>
          Der Mindestbestellwert beträgt 15,00 € (in Worten: fünfzehn Euro) inklusive der
          gesetzlichen Mehrwertsteuer, exklusive einer etwaigen Liefergebühr. Bestellungen
          unterhalb des Mindestbestellwerts werden vom System nicht zur Bestellung freigegeben.
        </LegalP>
        <LegalP>
          Wir liefern zu den auf unserer Website veröffentlichten Öffnungs- und Lieferzeiten.
          Die im Bestellprozess ausgewiesene voraussichtliche Lieferzeit ist eine unverbindliche
          Schätzung, die abhängig von Auslastung, Verkehrslage und Witterung schwanken kann.
          Eine geringfügige Überschreitung der Lieferzeitprognose begründet kein
          Rücktrittsrecht. Bei einer erheblichen, von uns zu vertretenden Überschreitung kannst
          du uns eine angemessene Nachfrist setzen; verstreicht diese fruchtlos, kannst du vom
          Vertrag zurücktreten. Deine gesetzlichen Rechte bleiben unberührt.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 4 Preise und Mehrwertsteuer">
        <LegalP>
          Alle auf der Website angegebenen Preise sind Endpreise in Euro inklusive der jeweils
          geltenden gesetzlichen Mehrwertsteuer.
        </LegalP>
        <LegalP>
          Für die Lieferung von Speisen gilt der ermäßigte Mehrwertsteuersatz von derzeit 7 %
          (§ 12 Absatz 2 Nummer 1 in Verbindung mit Anlage 2 UStG). Für nicht alkoholische und
          alkoholische Getränke gilt der reguläre Mehrwertsteuersatz von derzeit 19 %; ausgenommen
          sind Milch und Milchmischgetränke mit einem Milchanteil von mehr als 75 Prozent, für
          die ebenfalls der ermäßigte Steuersatz gilt.
        </LegalP>
        <LegalP>
          Eine etwaige Liefergebühr wird gesondert ausgewiesen, bevor du den Bestell-Button
          anklickst. Die im Warenkorb und auf der Bestellübersicht angezeigten Beträge sind die
          vom Vertrag erfassten Endpreise.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 5 Zahlungsarten">
        <LegalP>Zur Bezahlung stehen dir die folgenden Zahlungsarten zur Auswahl:</LegalP>
        <LegalP>
          (1) Online-Zahlung abgewickelt durch SumUp Limited, Block 8, Harcourt Centre,
          Charlotte Way, Dublin 2, Irland. Akzeptiert werden die jeweils im Bestellprozess
          angezeigten Verfahren, darunter Kredit- und Debitkarten (Visa, Mastercard, ggf.
          weitere), Apple Pay und Google Pay. Die Erhebung und Verarbeitung deiner Zahlungsdaten
          erfolgt direkt durch SumUp über eine von SumUp bereitgestellte Eingabemaske; wir selbst
          erhalten keinen Zugriff auf vollständige Kartendaten. Näheres regelt unsere{" "}
          <a href="/datenschutz" className="text-bs-teal underline">Datenschutzerklärung</a>.
        </LegalP>
        <LegalP>(2) Barzahlung bei Lieferung in Höhe des vollständigen Rechnungsbetrags an unseren Fahrer.</LegalP>
        <LegalP>
          (3) Kartenzahlung bei Lieferung über das mobile Kartenlesegerät unseres Fahrers
          (kontaktlose Kartenzahlung, je nach Verfahren Apple Pay oder Google Pay).
        </LegalP>
        <LegalP>
          Bei Zahlung bei Lieferung ist der Rechnungsbetrag passend bereitzuhalten oder per Karte
          direkt an der Haustür zu entrichten. Eine Bezahlung auf Rechnung oder per Lastschrift
          bieten wir nicht an.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 6 Lieferung und Gefahrübergang">
        <LegalP>
          Die Lieferung erfolgt an die von dir im Bestellprozess hinterlegte Adresse innerhalb
          des Liefergebiets gemäß § 3. Sollte dich der Fahrer an der angegebenen Lieferadresse
          nicht antreffen, versucht er, dich unter der hinterlegten Telefonnummer zu erreichen.
          Erfolgt innerhalb einer angemessenen Wartezeit von in der Regel zehn Minuten kein
          Kontakt oder ist eine Übergabe aus von dir zu vertretenden Gründen nicht möglich, ist
          der Fahrer berechtigt, die Lieferung mitzunehmen. In diesem Fall hast du den Kaufpreis
          dennoch zu entrichten, da der Verzug von dir verursacht wurde; bereits autorisierte
          Online-Zahlungen werden nicht erstattet, eine erneute kostenfreie Auslieferung erfolgt
          nicht.
        </LegalP>
        <LegalP>
          Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht
          mit Übergabe der Ware an dich oder eine empfangsberechtigte erwachsene Person an der
          Lieferadresse auf dich über (§ 446 BGB).
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 7 Jugendschutz und Abgabe alkoholischer Getränke">
        <LegalP>
          Soweit unser Sortiment alkoholische Getränke umfasst, gilt für deren Abgabe das
          Jugendschutzgesetz (JuSchG) in seiner jeweils geltenden Fassung.
        </LegalP>
        <LegalP>
          Bier, Wein, Sekt und Mischgetränke daraus dürfen nur an Personen ab vollendetem 16.
          Lebensjahr abgegeben werden (§ 9 Absatz 1 Nummer 1 JuSchG). Branntwein,
          branntweinhaltige Getränke und Lebensmittel sowie Spirituosen dürfen nur an Personen ab
          vollendetem 18. Lebensjahr abgegeben werden (§ 9 Absatz 1 Nummer 2 JuSchG).
        </LegalP>
        <LegalP>
          Mit der Bestellung alkoholischer Getränke bestätigst du, das jeweils gesetzlich
          erforderliche Mindestalter erreicht zu haben. Unser Fahrer ist gesetzlich verpflichtet
          und betrieblich angewiesen, bei der Aushändigung alkoholischer Getränke an der Haustür
          eine Alterssichtprüfung vorzunehmen. Bestehen Zweifel an deinem Alter oder kannst du
          das Mindestalter nicht durch Vorlage eines amtlichen Lichtbildausweises (Personalausweis,
          Reisepass oder Aufenthaltstitel) nachweisen, ist der Fahrer berechtigt und verpflichtet,
          die Aushändigung der alkoholischen Getränke zu verweigern.
        </LegalP>
        <LegalP>
          In einem solchen Fall werden ausschließlich die übrigen, nicht alkoholischen Bestandteile
          deiner Bestellung ausgeliefert. Der auf die nicht ausgehändigten alkoholischen Getränke
          entfallende Kaufpreisanteil wird dir bei Online-Zahlung über den genutzten Zahlungsweg
          erstattet; bei Zahlung bei Lieferung wird der entsprechende Betrag nicht erhoben. Ein
          darüber hinausgehender Anspruch auf Schadensersatz, Aufwendungsersatz oder Entschädigung
          ist ausgeschlossen.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 8 Widerrufsrecht">
        <LegalP>
          Hinweise zu deinem Widerrufsrecht und insbesondere zum gesetzlichen Ausschluss desselben
          für bestimmte Warengruppen findest du in unserer Widerrufsbelehrung, die du jederzeit
          auf unserer Website unter{" "}
          <a href="/widerrufsbelehrung" className="text-bs-teal underline">
            {LEGAL.website.replace("https://", "")}/widerrufsbelehrung
          </a>{" "}
          abrufen, herunterladen und ausdrucken kannst und die dir vor Abschluss der Bestellung
          zur Kenntnisnahme bereitsteht.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 9 Mängelrechte">
        <LegalP>
          Es gelten die gesetzlichen Mängelrechte. Solltest du bei oder kurz nach der Lieferung
          erkennen, dass die Ware mangelhaft ist (beispielsweise falsche Artikel, beschädigte
          Verpackung, sichtbar verdorbene Ware), bitten wir dich, dies unverzüglich — möglichst
          noch unmittelbar gegenüber dem Fahrer an der Haustür oder spätestens am Tag der Lieferung
          telefonisch unter{" "}
          <a href={`tel:${LEGAL.phoneTel}`} className="text-bs-teal underline">{LEGAL.phone}</a>{" "}
          oder per E-Mail an{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-bs-teal underline">{LEGAL.email}</a>{" "}
          — anzuzeigen.
        </LegalP>
        <LegalP>
          Diese Anzeige ist keine Voraussetzung für deine gesetzlichen Mängelrechte, ermöglicht
          uns aber eine zügige Bearbeitung und gegebenenfalls eine umgehende Ersatzlieferung. Bei
          berechtigten Reklamationen erhältst du nach unserer Wahl eine Ersatzlieferung in gleicher
          Art und Güte oder eine Rückerstattung des auf die mangelhafte Ware entfallenden
          Kaufpreisanteils über den ursprünglichen Zahlungsweg.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 10 Haftung">
        <LegalP>
          Wir haften unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der
          Gesundheit, die auf einer fahrlässigen oder vorsätzlichen Pflichtverletzung von uns,
          unseren gesetzlichen Vertreter:innen oder Erfüllungsgehilf:innen beruhen, sowie für
          sonstige Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung
          von uns, unseren gesetzlichen Vertreter:innen oder Erfüllungsgehilf:innen beruhen.
        </LegalP>
        <LegalP>
          Bei der Verletzung wesentlicher Vertragspflichten — also solcher Pflichten, deren
          Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und
          auf deren Einhaltung du regelmäßig vertrauen darfst (sogenannte Kardinalpflichten) —
          haften wir auch bei leichter Fahrlässigkeit, jedoch der Höhe nach beschränkt auf den bei
          Vertragsschluss vorhersehbaren, vertragstypischen Schaden.
        </LegalP>
        <LegalP>Im Übrigen ist unsere Haftung für leicht fahrlässig verursachte Schäden ausgeschlossen.</LegalP>
        <LegalP>
          Die Vorschriften des Produkthaftungsgesetzes sowie Ansprüche aus übernommenen Garantien
          bleiben unberührt.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 11 Lebensmittelrechtliche Informationen, Allergene und Zusatzstoffe">
        <LegalP>
          Informationen zu allergenen Inhaltsstoffen gemäß Verordnung (EU) Nr. 1169/2011 (LMIV)
          und zu kennzeichnungspflichtigen Zusatzstoffen gemäß § 9
          Lebensmittelinformations-Durchführungsverordnung (LMIDV) findest du an jedem einzelnen
          Produkt auf unserer Website. Bei akuten Allergien oder Unverträglichkeiten wende dich
          bitte vor der Bestellung telefonisch an uns unter{" "}
          <a href={`tel:${LEGAL.phoneTel}`} className="text-bs-teal underline">{LEGAL.phone}</a>,
          damit wir mögliche Spurenübertragungen in unserer Küche mit dir abklären können. Eine
          vollständige Spurenfreiheit kann in einer Gastronomieküche mit gemischter Zubereitung
          allergener und nicht allergener Speisen nicht zugesichert werden.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 12 Online-Streitbeilegung">
        <LegalP>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit,
          die du unter{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline">
            https://ec.europa.eu/consumers/odr
          </a>{" "}
          findest. Unsere E-Mail-Adresse für Beschwerden lautet{" "}
          <a href={`mailto:${LEGAL.email}`} className="text-bs-teal underline">{LEGAL.email}</a>.
          Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          sind wir weder bereit noch gesetzlich verpflichtet.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 13 Anwendbares Recht">
        <LegalP>
          Auf sämtliche Rechtsbeziehungen zwischen dir und uns findet das Recht der
          Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts Anwendung. Bei
          Verbraucher:innen gilt diese Rechtswahl nur insoweit, als dadurch nicht zwingende
          gesetzliche Bestimmungen des Staates, in dem du deinen gewöhnlichen Aufenthalt hast,
          eingeschränkt werden.
        </LegalP>
      </LegalSection>

      <LegalSection title="§ 14 Schlussbestimmungen">
        <LegalP>
          Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder
          werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht. An die Stelle der
          unwirksamen Bestimmung tritt die einschlägige gesetzliche Regelung.
        </LegalP>
        <LegalP className="text-bs-ink/60 text-sm">Stand: {LEGAL.standDate}</LegalP>
      </LegalSection>
    </LegalPageLayout>
  );
}
