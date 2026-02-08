import { useLocalize } from '~/hooks';
import { TStartupConfig } from 'librechat-data-provider';

function Footer({ startupConfig }: { startupConfig: TStartupConfig | null | undefined }) {
  const localize = useLocalize();

  const linkClass =
    'text-sm text-[#800000] underline decoration-transparent transition-all duration-200 hover:text-[#6E0000] hover:decoration-[#6E0000] focus:text-[#6E0000] focus:decoration-[#6E0000] dark:text-[#B22222] dark:hover:text-[#d45050] dark:hover:decoration-[#d45050] dark:focus:text-[#d45050] dark:focus:decoration-[#d45050]';

  const divider = <div className="border-r-[1px] border-gray-300 dark:border-gray-600" />;

  // Always show legal links for Sheraliat AI, regardless of config
  const privacyPolicy = startupConfig?.interface?.privacyPolicy;
  const termsOfService = startupConfig?.interface?.termsOfService;

  return (
    <div className="align-end m-4 flex flex-wrap justify-center gap-2" role="contentinfo">
      <a className={linkClass} href={termsOfService?.externalUrl || '/terms'} rel="noreferrer">
        {localize('com_sheraliat_terms_title')}
      </a>
      {divider}
      <a className={linkClass} href={privacyPolicy?.externalUrl || '/privacy'} rel="noreferrer">
        {localize('com_sheraliat_privacy_title')}
      </a>
      {divider}
      <a className={linkClass} href="/impressum" rel="noreferrer">
        {localize('com_sheraliat_impressum_title')}
      </a>
    </div>
  );
}

export default Footer;
