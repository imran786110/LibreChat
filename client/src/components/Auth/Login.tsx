import { useEffect, useState } from 'react';
import { ErrorTypes, registerPage } from 'librechat-data-provider';
import { OpenIDIcon, useToastContext } from '@librechat/client';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import type { TLoginLayoutContext } from '~/common';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import SocialButton from '~/components/Auth/SocialButton';
import { useAuthContext } from '~/hooks/AuthContext';
import { getLoginError } from '~/utils';
import { useLocalize } from '~/hooks';
import LoginForm from './LoginForm';

function Login() {
  const localize = useLocalize();
  const { showToast } = useToastContext();
  const { error, setError, login } = useAuthContext();
  const { startupConfig } = useOutletContext<TLoginLayoutContext>();

  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const disableAutoRedirect = searchParams.get('redirect') === 'false';
  const [isAutoRedirectDisabled, setIsAutoRedirectDisabled] = useState(disableAutoRedirect);

  useEffect(() => {
    const oauthError = searchParams?.get('error');
    if (oauthError && oauthError === ErrorTypes.AUTH_FAILED) {
      showToast({
        message: localize('com_auth_error_oauth_failed'),
        status: 'error',
      });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('error');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showToast, localize]);

  useEffect(() => {
    if (disableAutoRedirect) {
      setIsAutoRedirectDisabled(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('redirect');
      setSearchParams(newParams, { replace: true });
    }
  }, [disableAutoRedirect, searchParams, setSearchParams]);

  const shouldAutoRedirect =
    startupConfig?.openidLoginEnabled &&
    startupConfig?.openidAutoRedirect &&
    startupConfig?.serverDomain &&
    !isAutoRedirectDisabled;

  useEffect(() => {
    if (shouldAutoRedirect && consentAccepted) {
      window.location.href = `${startupConfig.serverDomain}/oauth/openid`;
    }
  }, [shouldAutoRedirect, startupConfig, consentAccepted]);

  if (shouldAutoRedirect && consentAccepted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-lg font-semibold">
          {localize('com_ui_redirecting_to_provider', { 0: startupConfig.openidLabel })}
        </p>
        <div className="mt-4">
          <SocialButton
            key="openid"
            enabled={startupConfig.openidLoginEnabled}
            serverDomain={startupConfig.serverDomain}
            oauthPath="openid"
            Icon={() =>
              startupConfig.openidImageUrl ? (
                <img src={startupConfig.openidImageUrl} alt="OpenID Logo" className="h-5 w-5" />
              ) : (
                <OpenIDIcon />
              )
            }
            label={startupConfig.openidLabel}
            id="openid"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {error != null && <ErrorMessage>{localize(getLoginError(error))}</ErrorMessage>}

      {/* Login form - only interactable when consent is accepted */}
      <div className={consentAccepted ? '' : 'pointer-events-none opacity-50'}>
        {startupConfig?.emailLoginEnabled === true && (
          <LoginForm
            onSubmit={login}
            startupConfig={startupConfig}
            error={error}
            setError={setError}
          />
        )}
      </div>

      {/* Consent checkbox */}
      <div className="mt-6 space-y-3">
        <label
          className="flex cursor-pointer items-start gap-3"
          htmlFor="consent-checkbox"
        >
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border-heavy accent-[#800000] focus:ring-[#800000]"
            aria-describedby="consent-description"
          />
          <span className="text-sm text-text-secondary">
            {localize('com_sheraliat_consent_label')
              .replace(/<termsLink>(.*?)<\/termsLink>/g, '')
              .replace(/<privacyLink>(.*?)<\/privacyLink>/g, '')
              .includes('akzeptiere') ? (
              <>
                Ich akzeptiere die{' '}
                <a
                  href="/terms"
                  className="font-medium text-[#800000] underline hover:text-[#6E0000] dark:text-[#B22222] dark:hover:text-[#d45050]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nutzungsbedingungen
                </a>{' '}
                und die{' '}
                <a
                  href="/privacy"
                  className="font-medium text-[#800000] underline hover:text-[#6E0000] dark:text-[#B22222] dark:hover:text-[#d45050]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung
                </a>
              </>
            ) : (
              <>
                I accept the{' '}
                <a
                  href="/terms"
                  className="font-medium text-[#800000] underline hover:text-[#6E0000] dark:text-[#B22222] dark:hover:text-[#d45050]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>{' '}
                and the{' '}
                <a
                  href="/privacy"
                  className="font-medium text-[#800000] underline hover:text-[#6E0000] dark:text-[#B22222] dark:hover:text-[#d45050]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </>
            )}
          </span>
        </label>

        {/* Data handling notice */}
        <div className="relative">
          <p
            id="consent-description"
            className="text-xs text-text-tertiary"
          >
            {localize('com_sheraliat_data_notice')}
            <button
              type="button"
              className="ml-1 inline-flex text-[#800000] hover:text-[#6E0000] dark:text-[#B22222]"
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Mehr erfahren"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </p>
          {showTooltip && (
            <div className="mt-2 rounded-lg border border-border-light bg-surface-secondary p-3 text-xs text-text-secondary shadow-sm">
              {localize('com_sheraliat_data_tooltip')}
            </div>
          )}
        </div>

        {!consentAccepted && (
          <p className="text-xs text-amber-600 dark:text-amber-400" role="alert">
            {localize('com_sheraliat_consent_required')}
          </p>
        )}
      </div>

      {startupConfig?.registrationEnabled === true && (
        <p className="my-4 text-center text-sm font-light text-gray-700 dark:text-white">
          {' '}
          {localize('com_auth_no_account')}{' '}
          <a
            href={registerPage()}
            className="inline-flex p-1 text-sm font-medium text-[#800000] underline decoration-transparent transition-all duration-200 hover:text-[#6E0000] hover:decoration-[#6E0000] dark:text-[#B22222] dark:hover:text-[#d45050] dark:hover:decoration-[#d45050]"
          >
            {localize('com_auth_sign_up')}
          </a>
        </p>
      )}
    </>
  );
}

export default Login;
