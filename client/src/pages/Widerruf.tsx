import LegalPageLayout, { LegalP, LegalSection } from "@/components/LegalPageLayout";
import { LEGAL } from "@/data/legalConfig";

function ContactBlock() {
  return (
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
    </LegalP>
  );
}

export default function Widerruf() {
  return (
    <LegalPageLayout title="Widerrufsbelehrung" badgeClass="badge-neon badge-cyan-fill">
      <LegalSection title="Hinweis: kein Widerrufsrecht für frisch zubereitete und schnell verderbliche Speisen" first>
        <LegalP>
          Für den überwiegenden Teil unseres Sortiments steht dir kein gesetzliches Widerrufsrecht
          zu. Dies ergibt sich aus § 312g Absatz 2 des Bürgerlichen Gesetzbuches (BGB):
        </LegalP>
        <LegalP>
          Nach § 312g Absatz 2 Nummer 1 BGB ist das Widerrufsrecht ausgeschlossen bei Verträgen
          zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine
          individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die
          eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind.
        </LegalP>
        <LegalP>
          Nach § 312g Absatz 2 Nummer 2 BGB ist das Widerrufsrecht ferner ausgeschlossen bei
          Verträgen zur Lieferung von Waren, die schnell verderben können oder deren Verfallsdatum
          schnell überschritten würde.
        </LegalP>
        <LegalP>
          In der Praxis bedeutet das: Sobald du den Button „Zahlungspflichtig bestellen" angeklickt
          und damit die Bestellung verbindlich abgeschickt hast, kannst du frisch zubereitete
          Speisen und Getränke weder stornieren noch zurückgeben oder den Vertrag widerrufen.
          Hierzu zählen insbesondere — aber nicht ausschließlich — Burger, Pommes Frites,
          Beilagen, Salate, Wraps, frisch zubereitete Saucen, Dips und Bowls, individualisierte
          Speisen mit von dir gewählten Modifikationen, offen abgegebene Getränke (z. B. frisch
          gezapfte Limonaden oder Eistee) sowie Speisen mit kurzem Mindesthaltbarkeitsdatum.
        </LegalP>
        <LegalP>
          Dieser Ausschluss gilt ab dem Zeitpunkt des wirksamen Vertragsschlusses gemäß § 2 unserer{" "}
          <a href="/agb" className="text-bs-teal underline">AGB</a> und unabhängig davon, ob die
          Zubereitung der Ware in unserer Küche bereits begonnen wurde.
        </LegalP>
      </LegalSection>

      <LegalSection title="Widerrufsrecht für haltbare, versiegelt gelieferte Waren">
        <LegalP>
          Lediglich für haltbare Waren in original versiegelter Umverpackung, die nicht zur
          unmittelbaren Verzehrbereitschaft zubereitet wurden — insbesondere ungeöffnete
          Flaschengetränke (Glas- oder PET-Flaschen, Dosen) mit nicht überschrittenem
          Mindesthaltbarkeitsdatum, versiegelte Snack-Artikel sowie etwaige Merchandise-Artikel —
          gilt das nachfolgend beschriebene gesetzliche Widerrufsrecht:
        </LegalP>
      </LegalSection>

      <LegalSection title="Widerrufsrecht">
        <LegalP>
          Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag,
          beschränkt auf widerrufsfähige Waren im Sinne des vorstehenden Absatzes, zu widerrufen.
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem du oder eine von dir
          benannte dritte Person, die nicht der Beförderer ist, die Waren in Besitz genommen hast
          beziehungsweise hat.
        </LegalP>
        <LegalP>Um dein Widerrufsrecht auszuüben, musst du uns</LegalP>
        <ContactBlock />
        <LegalP>
          mittels einer eindeutigen Erklärung (zum Beispiel ein mit der Post versandter Brief oder
          eine E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst
          dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben
          ist. Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die
          Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
        </LegalP>
      </LegalSection>

      <LegalSection title="Folgen des Widerrufs">
        <LegalP>
          Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir
          erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten,
          die sich daraus ergeben, dass du eine andere Art der Lieferung als die von uns
          angebotene, günstigste Standardlieferung gewählt hast), unverzüglich und spätestens
          binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen
          Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir
          dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es
          sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir
          wegen dieser Rückzahlung Entgelte berechnet.
        </LegalP>
        <LegalP>
          Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben
          oder bis du den Nachweis erbracht hast, dass du die Waren zurückgesandt hast, je nachdem,
          welches der frühere Zeitpunkt ist.
        </LegalP>
        <LegalP>
          Du hast die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem
          Tag, an dem du uns über den Widerruf dieses Vertrags unterrichtest, an die oben genannte
          Anschrift zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn du die Waren vor
          Ablauf der Frist von vierzehn Tagen absendest. Du trägst die unmittelbaren Kosten der
          Rücksendung der Waren.
        </LegalP>
        <LegalP>
          Du musst für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
          Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise
          der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
        </LegalP>
      </LegalSection>

      <LegalSection title="Muster-Widerrufsformular">
        <LegalP>
          Wenn du den Vertrag widerrufen willst, fülle bitte dieses Formular aus und sende es
          zurück.
        </LegalP>
        <LegalP className="bg-bs-ink/5 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
          {`An:
${LEGAL.companyName}
${LEGAL.street}
${LEGAL.zipCity}
E-Mail: ${LEGAL.email}

Hiermit widerrufe ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):

– Bestellt am () / erhalten am ():
– Name des/der Verbraucher(s):
– Anschrift des/der Verbraucher(s):
– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
– Datum:

(*) Unzutreffendes streichen.`}
        </LegalP>
      </LegalSection>
    </LegalPageLayout>
  );
}
