import { useNavigate } from 'react-router-dom';
import { useLocalize } from '~/hooks';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const localize = useLocalize();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-border-light px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-text-primary hover:opacity-80"
          >
            <img src="/assets/logo.svg" className="h-8" alt="Sheraliat AI" />
          </button>
          <nav className="flex gap-4 text-sm">
            <a href="/terms" className="text-text-secondary hover:text-text-primary">
              {localize('com_sheraliat_terms_title')}
            </a>
            <a href="/privacy" className="text-text-secondary hover:text-text-primary">
              {localize('com_sheraliat_privacy_title')}
            </a>
            <a href="/impressum" className="text-text-secondary hover:text-text-primary">
              {localize('com_sheraliat_impressum_title')}
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        {children}
        <footer className="mt-12 border-t border-border-light pt-4 text-xs text-text-tertiary">
          <p>{localize('com_sheraliat_legal_disclaimer')}</p>
        </footer>
      </main>
    </div>
  );
}
