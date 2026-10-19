export interface MobileNavItem {
  href: string;
  label: string;
  external?: boolean;
  disclosure?: boolean;
}

interface Props {
  logoSrc: string;
  logoAlt: string;
  openLabel: string;
  closeLabel: string;
  menuLabel: string;
  items: MobileNavItem[];
  forTravelersLabel: string;
  forTravelersHref: string;
  languageLabel: string;
  languages: { href: string; label: string; current: boolean; hreflang: string }[];
}

function externalProps(external: boolean | undefined) {
  return external ? { target: '_blank' as const, rel: 'noreferrer' } : {};
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 6.5 8 10.5 12 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Native disclosure so the links work before hydration.
 * client:load is used because the control sits in the header.
 * Submenu copy is not in the export, so disclosure rows are links with a chevron.
 */
export default function MobileMenu({
  logoSrc,
  logoAlt,
  openLabel,
  closeLabel,
  menuLabel,
  items,
  forTravelersLabel,
  forTravelersHref,
  languageLabel,
  languages,
}: Props) {
  const current = languages.find((language) => language.current) ?? languages[0];

  return (
    <details className="group lg:hidden">
      <summary className="text-ink inline-flex size-11 cursor-pointer list-none items-center justify-center group-open:fixed group-open:top-0 group-open:right-[18px] group-open:z-[60] group-open:h-20 group-open:w-11 marker:content-none [&::-webkit-details-marker]:hidden">
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          aria-hidden="true"
          className="group-open:hidden"
        >
          <path
            d="M1 1h16M1 7h16M1 13h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="hidden group-open:block"
        >
          <path
            d="M10 3 5 8l5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">
          <span className="group-open:hidden">{openLabel}</span>
          <span className="hidden group-open:inline">{closeLabel}</span>
        </span>
      </summary>
      <nav
        aria-label={menuLabel}
        className="fixed inset-0 z-50 flex flex-col bg-white px-[18px] pb-8"
      >
        <div className="flex h-20 items-center">
          <img src={logoSrc} width="176" height="35" alt={logoAlt} className="h-[35px] w-auto" />
        </div>
        <ul className="mt-2">
          {items.map((item) => (
            <li key={item.label} className="border-b border-[#e7e5e2]">
              <a
                className="text-ink flex min-h-14 items-center text-lg font-medium"
                href={item.href}
                {...externalProps(item.external)}
              >
                <span className="flex-1">{item.label}</span>
                {item.disclosure ? <Chevron /> : null}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-6">
          <a
            className="border-ink text-ink inline-flex h-12 items-center justify-center rounded-full border text-[15px] font-medium"
            href={forTravelersHref}
          >
            {forTravelersLabel}
          </a>
          <details className="relative">
            <summary className="text-ink flex min-h-11 w-fit cursor-pointer list-none items-center gap-1.5 text-[15px] font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="sr-only">{languageLabel}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle
                  cx="8"
                  cy="8"
                  r="6.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="8"
                  cy="8"
                  rx="2.6"
                  ry="6.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path d="M2 8h12" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {current?.label}
              <Chevron />
            </summary>
            <ul className="mt-1">
              {languages.map((language) => (
                <li key={language.hreflang}>
                  <a
                    href={language.href}
                    hrefLang={language.hreflang}
                    aria-current={language.current ? 'true' : undefined}
                    className="text-ink inline-flex min-h-11 items-center text-[15px] font-medium"
                  >
                    {language.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </details>
  );
}
