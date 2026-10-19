import { defaultLocale, locales, type Locale } from './config';
import en from './dictionaries/en.json';
import hr from './dictionaries/hr.json';
import type { Dictionary } from './types';

const dictionaries: Record<Locale, Dictionary> = { en, hr };

export function getLangFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  if (locales.some((locale) => locale === segment)) {
    return segment as Locale;
  }
  return defaultLocale;
}

export function useTranslations(lang: Locale) {
  return function translate<Key extends keyof Dictionary>(key: Key): Dictionary[Key] {
    return dictionaries[lang][key];
  };
}

export function localizedPath(lang: Locale, path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const normalized =
    pathname === '' || pathname === '/'
      ? '/'
      : pathname.startsWith('/')
        ? pathname
        : `/${pathname}`;

  if (normalized === '/') {
    return `/${lang}/${hash}`;
  }

  return `/${lang}${normalized}${hash}`;
}
