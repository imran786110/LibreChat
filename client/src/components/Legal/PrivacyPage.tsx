import LegalLayout from './LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <article className="prose dark:prose-invert max-w-none text-text-primary">
        <h1>Datenschutzerklärung / Privacy Policy</h1>
        <p className="text-sm text-text-tertiary">Stand: Februar 2026 | Effective: February 2026</p>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:<br />
          [Ihr Unternehmen]<br />
          [Straße und Hausnummer]<br />
          [PLZ Ort], Deutschland<br />
          E-Mail: [datenschutz@example.com]
        </p>
        <p>
          Datenschutzbeauftragte/r (falls zutreffend):<br />
          [Name / Kontaktdaten des DSB]
        </p>

        <h2>2. Hosting und Datenspeicherung</h2>
        <p>
          <strong>Alle Daten werden ausschließlich auf Servern in Deutschland gespeichert und
          verarbeitet.</strong> Es findet keine Übermittlung personenbezogener Daten in
          Drittländer statt, sofern dies nicht ausdrücklich angegeben ist.
        </p>

        <h2>3. Welche Daten werden verarbeitet?</h2>
        <ul>
          <li><strong>Kontodaten:</strong> E-Mail-Adresse, Benutzername, gehashtes Passwort</li>
          <li><strong>Chat-Nachrichten:</strong> Ihre Eingaben und die KI-generierten Antworten</li>
          <li><strong>Protokolldaten:</strong> IP-Adresse, Zeitstempel, Browser-Informationen (Logfiles)</li>
          <li><strong>Cookies:</strong> Ausschließlich technisch notwendige Cookies für die Sitzungsverwaltung</li>
        </ul>

        <h2>4. Rechtsgrundlagen (Art. 6 Abs. 1 DSGVO)</h2>
        <ul>
          <li>
            <strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):</strong> Verarbeitung von
            Kontodaten und Chat-Nachrichten zur Bereitstellung des Dienstes.
          </li>
          <li>
            <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> Verarbeitung auf
            Grundlage Ihrer ausdrücklichen Einwilligung (z.B. Akzeptanz der Nutzungsbedingungen).
          </li>
          <li>
            <strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen):</strong> Protokolldaten
            zur Sicherstellung der Systemsicherheit und zur Fehlerbehebung.
          </li>
        </ul>

        <h2>5. Zweckbindung</h2>
        <p>
          <strong>Ihre Daten werden auf unseren Servern gespeichert und ausschließlich zur
          Bereitstellung des Dienstes verarbeitet. Es erfolgt keine anderweitige Nutzung.</strong>{' '}
          Die Speicherung ist eine technische Voraussetzung für die Erbringung des Dienstes.
        </p>

        <h2>6. Speicherdauer und Löschung</h2>
        <ul>
          <li><strong>Kontodaten:</strong> Werden gespeichert, solange Ihr Konto aktiv ist. Nach Löschung des Kontos werden die Daten innerhalb von 30 Tagen gelöscht.</li>
          <li><strong>Chat-Nachrichten:</strong> Werden gespeichert, solange Ihr Konto aktiv ist. Sie können einzelne Gespräche jederzeit selbst löschen.</li>
          <li><strong>Protokolldaten:</strong> Werden nach 90 Tagen automatisch gelöscht.</li>
          <li><strong>Backups:</strong> Werden nach 30 Tagen überschrieben.</li>
        </ul>

        <h2>7. Ihre Rechte als Betroffene/r</h2>
        <p>Sie haben nach der DSGVO folgende Rechte:</p>
        <ul>
          <li><strong>Auskunftsrecht (Art. 15):</strong> Sie können Auskunft über die zu Ihrer Person gespeicherten Daten verlangen.</li>
          <li><strong>Berichtigungsrecht (Art. 16):</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
          <li><strong>Löschungsrecht (Art. 17):</strong> Sie können die Löschung Ihrer Daten verlangen (&quot;Recht auf Vergessenwerden&quot;).</li>
          <li><strong>Einschränkung der Verarbeitung (Art. 18):</strong> Sie können die Einschränkung der Verarbeitung verlangen.</li>
          <li><strong>Datenübertragbarkeit (Art. 20):</strong> Sie können Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.</li>
          <li><strong>Widerspruchsrecht (Art. 21):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
          <li><strong>Widerruf der Einwilligung:</strong> Eine erteilte Einwilligung können Sie jederzeit widerrufen.</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: [datenschutz@example.com]
        </p>
        <p>
          Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
        </p>

        <h2>8. Auftragsverarbeiter und Dritte</h2>
        <p>
          Soweit für die Erbringung des Dienstes Dritte eingesetzt werden (z.B. KI-Modellanbieter),
          geschieht dies auf Grundlage von Auftragsverarbeitungsverträgen gemäß Art. 28 DSGVO.
          Alle Auftragsverarbeiter befinden sich in der EU oder in Ländern mit angemessenem
          Datenschutzniveau.
        </p>
        <p>
          Aktuell eingesetzte Auftragsverarbeiter:<br />
          [Bitte hier die tatsächlich genutzten Dienste eintragen, z.B. Hosting-Provider, E-Mail-Dienst]
        </p>

        <h2>9. Sicherheitsmaßnahmen</h2>
        <ul>
          <li>Verschlüsselte Übertragung (TLS/HTTPS)</li>
          <li>Gehashte Passwörter</li>
          <li>Zugriffskontrolle und Protokollierung</li>
          <li>Regelmäßige Sicherheitsupdates</li>
          <li>Datenspeicherung ausschließlich in Deutschland</li>
        </ul>

        <h2>10. Cookies und Tracking</h2>
        <p>
          Diese Plattform verwendet <strong>ausschließlich technisch notwendige Cookies</strong>{' '}
          für die Sitzungsverwaltung und Authentifizierung. Es werden keine Tracking-,
          Analyse- oder Marketing-Cookies eingesetzt. Eine gesonderte Einwilligung ist daher
          nicht erforderlich (§ 25 Abs. 2 TDDDG).
        </p>

        <h2>11. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Bei wesentlichen
          Änderungen werden Sie informiert und um erneute Zustimmung gebeten.
        </p>

        <hr />
        <p className="text-sm italic text-text-tertiary">
          Kein Rechtsrat – Diese Texte müssen rechtlich geprüft werden.
        </p>
      </article>
    </LegalLayout>
  );
}
