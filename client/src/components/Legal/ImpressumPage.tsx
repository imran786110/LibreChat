import LegalLayout from './LegalLayout';

export default function ImpressumPage() {
  return (
    <LegalLayout>
      <article className="prose dark:prose-invert max-w-none text-text-primary">
        <h1>Impressum</h1>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          [Ihr Unternehmen / Name]<br />
          [Rechtsform, z.B. GmbH, UG (haftungsbeschränkt)]<br />
          [Straße und Hausnummer]<br />
          [PLZ Ort], Deutschland
        </p>

        <h2>Vertreten durch</h2>
        <p>[Geschäftsführer/in: Vorname Nachname]</p>

        <h2>Kontakt</h2>
        <p>
          Telefon: [+49 XXX XXXXXXX]<br />
          E-Mail: [kontakt@example.com]
        </p>

        <h2>Registereintrag</h2>
        <p>
          Eintragung im Handelsregister.<br />
          Registergericht: [Amtsgericht Ort]<br />
          Registernummer: [HRB XXXXX]
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
          [DE XXXXXXXXX]
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          [Vorname Nachname]<br />
          [Adresse wie oben]
        </p>

        <h2>EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#800000] hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          <br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>

        <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <hr />
        <p className="text-sm italic text-text-tertiary">
          Kein Rechtsrat – Diese Texte müssen rechtlich geprüft werden.
          Bitte ersetzen Sie alle Platzhalter in eckigen Klammern durch Ihre tatsächlichen Angaben.
        </p>
      </article>
    </LegalLayout>
  );
}
