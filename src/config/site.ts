export const siteName = 'HolidayGet';

export function appUrl(): string {
  return import.meta.env.PUBLIC_APP_URL || 'https://example.com/app';
}

/** Destinations that are not pages in this repo. Replace when real URLs exist. */
export const externalLinks = {
  pricing: 'https://example.com/pricing',
  helpCenter: 'https://example.com/help',
  guides: 'https://example.com/guides',
  blog: 'https://example.com/blog',
  contact: 'https://example.com/contact',
  terms: 'https://example.com/terms',
  privacy: 'https://example.com/privacy',
  cookies: 'https://example.com/cookies',
  accessibility: 'https://example.com/accessibility',
  legalNotice: 'https://example.com/legal',
  instagram: 'https://example.com/instagram',
  facebook: 'https://example.com/facebook',
  googlePlay: 'https://example.com/google-play',
  appStore: 'https://example.com/app-store',
} as const;

export const navItems = [
  { key: 'product', href: '/#ecosystem', disclosure: true },
  { key: 'solutions', href: '/#solutions', disclosure: true },
  { key: 'marketplace', href: '/#ecosystem', disclosure: false },
  { key: 'pricing', href: '/#pricing', disclosure: false },
  { key: 'resources', href: '/#faq', disclosure: true },
] as const;

export const footerHrefs: Record<string, string> = {
  sell: '/#ecosystem',
  manage: '/#ecosystem',
  customers: '/#ecosystem',
  payments: '/#ecosystem',
  insights: '/#ecosystem',
  marketplace: '/#ecosystem',
  tours: '/#solutions',
  events: '/#solutions',
  transport: '/#solutions',
  rentGear: '/#solutions',
  boatRental: '/#solutions',
  restaurant: '/#solutions',
  helpCenter: externalLinks.helpCenter,
  guides: externalLinks.guides,
  faq: '/#faq',
  blog: externalLinks.blog,
  pricing: externalLinks.pricing,
  contact: externalLinks.contact,
  terms: externalLinks.terms,
  privacy: externalLinks.privacy,
  cookies: externalLinks.cookies,
  accessibility: externalLinks.accessibility,
  legalNotice: externalLinks.legalNotice,
};

export const socialLinks = [
  { id: 'instagram', href: externalLinks.instagram },
  { id: 'facebook', href: externalLinks.facebook },
] as const;
