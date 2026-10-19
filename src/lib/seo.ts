import { defaultLocale, locales } from '@/i18n/config';
import { localizedPath } from '@/i18n/utils';
import { siteName } from '@/config/site';

export interface FaqItem {
  q: string;
  a?: string;
}

export function absoluteUrl(site: URL, path: string): string {
  return new URL(path, site).href;
}

export function localeAlternates(site: URL): { hreflang: string; href: string }[] {
  const alternates: { hreflang: string; href: string }[] = locales.map((locale) => ({
    hreflang: locale,
    href: absoluteUrl(site, localizedPath(locale, '/')),
  }));
  alternates.push({
    hreflang: 'x-default',
    href: absoluteUrl(site, localizedPath(defaultLocale, '/')),
  });
  return alternates;
}

export function organizationJsonLd(site: URL): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: site.origin,
  };
}

export function faqPageJsonLd(items: readonly FaqItem[]): Record<string, unknown> | undefined {
  const answered = items.filter((item): item is { q: string; a: string } => Boolean(item.a));
  if (answered.length === 0) {
    return undefined;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
