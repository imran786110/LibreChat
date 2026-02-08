import LegalLayout from './LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout>
      <article className="prose dark:prose-invert max-w-none text-text-primary">
        <h1>Nutzungsbedingungen / Terms of Use</h1>
        <p className="text-sm text-text-tertiary">Stand: Februar 2026 | Effective: February 2026</p>

        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Nutzungsbedingungen gelten für die Nutzung der Sheraliat AI Plattform
          (&quot;Dienst&quot;), betrieben von [Ihr Unternehmen] (&quot;Betreiber&quot;).
          Mit der Registrierung und Nutzung des Dienstes akzeptieren Sie diese Bedingungen.
        </p>

        <h2>2. Leistungsbeschreibung</h2>
        <p>
          Sheraliat AI bietet eine KI-Chat-Plattform mit Zugang zu verschiedenen KI-Modellen.
          Der Dienst wird auf Servern in Deutschland gehostet.
        </p>

        <h2>3. Registrierung und Konto</h2>
        <p>
          Für die Nutzung ist eine Registrierung erforderlich. Sie sind verpflichtet,
          wahrheitsgemäße Angaben zu machen und Ihre Zugangsdaten vertraulich zu behandeln.
        </p>

        <h2>4. Zulässige Nutzung</h2>
        <p>
          Sie verpflichten sich, den Dienst nur für rechtmäßige Zwecke zu nutzen. Insbesondere
          ist es untersagt:
        </p>
        <ul>
          <li>den Dienst für illegale Aktivitäten zu nutzen</li>
          <li>Inhalte zu erzeugen, die gegen geltendes Recht verstoßen</li>
          <li>die Sicherheit oder Integrität des Dienstes zu gefährden</li>
          <li>den Dienst für automatisierte Massenabfragen zu missbrauchen</li>
        </ul>

        <h2>5. Geistiges Eigentum</h2>
        <p>
          Die durch Sie erstellten Eingaben und die daraus generierten Ausgaben verbleiben bei
          Ihnen, soweit keine Rechte Dritter entgegenstehen. Die Plattform selbst und ihre
          Bestandteile sind urheberrechtlich geschützt.
        </p>

        <h2>6. Datenschutz</h2>
        <p>
          Die Verarbeitung personenbezogener Daten richtet sich nach unserer{' '}
          <a href="/privacy" className="text-[#800000] hover:underline">Datenschutzerklärung</a>.
          Alle Daten werden auf Servern in Deutschland gespeichert.
        </p>

        <h2>7. Haftung</h2>
        <p>
          KI-generierte Inhalte können fehlerhaft sein. Der Betreiber übernimmt keine Gewähr
          für die Richtigkeit, Vollständigkeit oder Aktualität der generierten Inhalte.
          Die Haftung des Betreibers ist auf Vorsatz und grobe Fahrlässigkeit beschränkt,
          soweit gesetzlich zulässig.
        </p>

        <h2>8. Verfügbarkeit</h2>
        <p>
          Der Betreiber bemüht sich um eine hohe Verfügbarkeit des Dienstes, kann diese
          jedoch nicht garantieren. Wartungsarbeiten werden nach Möglichkeit angekündigt.
        </p>

        <h2>9. Kündigung</h2>
        <p>
          Beide Parteien können das Nutzungsverhältnis jederzeit beenden. Bei Verstoß
          gegen diese Nutzungsbedingungen kann der Zugang sofort gesperrt werden.
        </p>

        <h2>10. Änderungen</h2>
        <p>
          Der Betreiber behält sich vor, diese Nutzungsbedingungen zu ändern.
          Wesentliche Änderungen werden den Nutzern mitgeteilt. Die fortgesetzte Nutzung
          nach Änderung gilt als Zustimmung. Bei wesentlichen Änderungen ist eine
          erneute Zustimmung erforderlich.
        </p>

        <h2>11. Anwendbares Recht und Gerichtsstand</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit
          gesetzlich zulässig, der Sitz des Betreibers.
        </p>

        <hr />
        <p className="text-sm italic text-text-tertiary">
          Kein Rechtsrat – Diese Texte müssen rechtlich geprüft werden.
        </p>
      </article>
    </LegalLayout>
  );
}
