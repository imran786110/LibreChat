import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEn from './en/translation.json';

export const defaultNS = 'translation';

export const supportedLocales = [
  'ar',
  'bo',
  'bs',
  'ca',
  'cs',
  'da',
  'de',
  'en',
  'es',
  'et',
  'fa',
  'fi',
  'fr',
  'he',
  'hu',
  'hy',
  'id',
  'is',
  'it',
  'ja',
  'ka',
  'ko',
  'lt',
  'lv',
  'nb',
  'nl',
  'nn',
  'pl',
  'pt-BR',
  'pt-PT',
  'ru',
  'sk',
  'sl',
  'sv',
  'th',
  'tr',
  'ug',
  'uk',
  'vi',
  'zh-Hans',
  'zh-Hant',
] as const;

export type SupportedLocale = (typeof supportedLocales)[number];
export type TranslationResource = Record<string, string>;

export const resources = {
  en: { translation: translationEn },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'de',
    fallbackLng: {
      'zh-TW': ['zh-Hant', 'en'],
      'zh-HK': ['zh-Hant', 'en'],
      zh: ['zh-Hans', 'en'],
      default: ['de', 'en'],
    },
    fallbackNS: 'translation',
    ns: ['translation'],
    debug: false,
    defaultNS,
    resources,
    interpolation: { escapeValue: false },
  });

export default i18n;
