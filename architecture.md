# HolidayGet Landing — Architecture & Rules

Single source of truth for humans and AI agents working on this repo.
If code and this document disagree, fix one of them in the same PR.

## 1. Goal

A large informational marketing landing page for HolidayGet (ecosystem for experience businesses).

- No backend. Fully static output.
- Languages: EN and HR (more may be added).
- Priorities, in order: **speed → adaptivity → visual quality / animations → maintainability**.
- Design source (v7): `design/Home — v7 (1440).png` and `design/Home — v7 mobile (375).png`. Mobile baseline width is 375px. Supporting frames: `design/Navigation — menu open (375).png`, `design/CTAs.png`.
- Per-section crops and media are not in the repo yet. They land under `design/screens/<section>/` before that section is rebuilt. Until that folder exists, do not redraw the section and do not invent assets, nav submenu items, collapsed FAQ answers, store URLs, or a video file.
- `design/scaffold-prompt.md` is the original scaffold brief, not the visual source.

### Targets

| Metric (mobile, Lighthouse, production) | Target |
|---|---|
| Performance | ≥ 95 |
| Accessibility / Best Practices / SEO | ≥ 95 / ≥ 95 / 100 |
| LCP | < 2.0 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| JS shipped on first view (gzip) | < 80 KB |
| JS shipped for the whole page (gzip) | < 150 KB |

## 2. Stack

| Area | Choice |
|---|---|
| Framework | **Astro** (latest stable), static output (`output: 'static'`) |
| Interactive parts | **React** islands via `@astrojs/react` |
| Language | TypeScript, `strict: true` |
| Styling | **Tailwind CSS** (v4, via `@tailwindcss/vite`), design tokens in `@theme` |
| UI animation | **Motion** (`motion/react`) inside islands |
| Scroll animation | **GSAP + ScrollTrigger** — only if a section truly needs pinning/scrub. Not installed by default |
| Carousel | Not used by v7. Do not add one unless a later screen needs it. Remove `embla-carousel-react` when the v3 beyond-basics section is deleted |
| Accordion / tabs | Radix UI primitives (or native `<details>` where no animation is needed) |
| Fonts | Self-hosted **Outfit** via **Fontsource**, `font-display: swap`, preloaded critical weights only |
| Images | `astro:assets` (AVIF/WebP, `srcset`, explicit width/height) |
| i18n | Astro built-in i18n routing + typed JSON dictionaries |
| SEO | `@astrojs/sitemap`, canonical + `hreflang`, Open Graph, JSON-LD (Organization, FAQPage) |
| Cookie consent | `vanilla-cookieconsent` (or equivalent); analytics load only after consent |
| Package manager | **pnpm**, Node LTS pinned in `.nvmrc` and `engines` |
| Lint / format | ESLint (typescript-eslint, astro, jsx-a11y), Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`) |
| Tests | Playwright (smoke + a11y with `@axe-core/playwright`), Lighthouse CI |
| IaC | **AWS CDK (TypeScript)** in `infra/` |
| CI/CD | GitHub Actions → AWS via OIDC (no long-lived keys) |

## 3. Hosting on AWS

```
Browser → Route 53 → CloudFront ──► S3 (private bucket, Origin Access Control)
                        │
                        ├─ CloudFront Function (viewer-request): URL rewrite + locale redirect on "/"
                        ├─ Response Headers Policy: HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
                        └─ ACM certificate (us-east-1)
```

- **S3**: private, block all public access, versioning on. Access only through CloudFront OAC.
- **CloudFront**: HTTP/2 + HTTP/3, Brotli/gzip on, `redirect-to-https`, custom error response → `/404.html`.
- **URL rewrite function**: `/en/` → `/en/index.html`, `/en/page` → `/en/page/index.html` (Astro `build.format: 'directory'`).
- **Root `/`**: redirect (302) to `/en/` or `/hr/` by `Accept-Language` in the CloudFront Function. Fallback `/en/`.
- **Cache policy**:
  - `/_astro/*` (hashed assets): `Cache-Control: public, max-age=31536000, immutable`
  - `*.html`, `sitemap*.xml`, `robots.txt`: `Cache-Control: public, max-age=0, must-revalidate`
  - Other `public/` files (images, fonts not hashed): `max-age=86400`
- **Deploy**: build → `aws s3 sync` (two passes: assets with long cache, HTML with no-cache; `--delete`) → CloudFront invalidation of `/*.html`-type paths (or `/*`).
- **Environments**: `staging` and `production` — separate stacks, parameters via CDK context. Staging is protected (basic auth in the CloudFront Function or IP allowlist) and sends `X-Robots-Tag: noindex`.
- **Fallback option** if infra effort becomes a problem: AWS Amplify Hosting (same Astro build). Record such a decision in `docs/decisions.md`.

## 4. Repository structure

```
/
├─ architecture.md
├─ README.md
├─ design/                      # full-page v7 exports + screens/<section>/, not shipped
├─ docs/
│  └─ decisions.md              # ADR-style log, one short entry per decision
├─ public/                      # favicon, robots.txt, og images, static files
├─ src/
│  ├─ assets/                   # images, svg (processed by astro:assets)
│  ├─ components/
│  │  ├─ ui/                    # Button, Container, SectionHeading, Badge, Card… (.astro, no logic)
│  │  └─ layout/                # Header, Footer, LanguageSwitcher, StickyCta
│  ├─ sections/                 # <Name>.astro + islands/*.tsx only if interactive
│  │  ├─ hero/
│  │  ├─ already-here/
│  │  ├─ owner-app/
│  │  ├─ channels/
│  │  ├─ effect/
│  │  ├─ solutions/
│  │  ├─ getting-started/
│  │  ├─ ecosystem/
│  │  ├─ pricing/
│  │  └─ faq/
│  ├─ islands/                  # shared React islands (CookieSettings, etc.)
│  ├─ i18n/
│  │  ├─ config.ts              # locales, default locale
│  │  ├─ utils.ts               # getLangFromUrl, useTranslations, localized paths
│  │  └─ dictionaries/en.json, hr.json
│  ├─ config/
│  │  └─ site.ts                # nav, social links, APP_URL, legal links — no hardcoding elsewhere
│  ├─ lib/
│  │  ├─ motion.ts              # shared animation presets (durations, easings, variants)
│  │  ├─ consent.ts             # consent state + analytics loader
│  │  └─ seo.ts                 # meta / JSON-LD builders
│  ├─ layouts/BaseLayout.astro  # <html lang>, head, SEO, fonts, consent, Header/Footer slots
│  ├─ pages/
│  │  ├─ index.astro            # locale entry (static fallback; real redirect at CDN)
│  │  ├─ [lang]/index.astro     # landing page, composes sections in design order
│  │  └─ 404.astro
│  └─ styles/global.css         # @import "tailwindcss"; @theme tokens; base styles
├─ tests/e2e/                   # Playwright specs
├─ infra/                       # AWS CDK app (bin/, lib/, cdk.json)
├─ .github/workflows/           # ci.yml (lint, typecheck, build, e2e, lhci), deploy.yml
├─ astro.config.mjs
├─ tsconfig.json
└─ package.json
```

Path aliases: `@/*` → `src/*`.

## 5. Page composition

`src/pages/[lang]/index.astro` only assembles sections, in this order (v7):

1. Header
2. **Hero** — "One phone. A whole lot of business." Store badges, static composite (beach + planner + phone), "Watch how it works"
3. **Already here** — "They're already here. Are you?" Four floating problem cards
4. **Owner app** — "You run the business. Don't let it run you." Four benefit cards
5. **Channels** — "Create once. Sell everywhere." Channel word-stack + device collage
6. **Effect** — "The holidayget effect". Three stats: +25%, +40%, 3×
7. **Solutions** — "Built for every kind of experience" plus a "500" coverage figure. Accordion, one row open: Tours & Activities, Events & Tickets, Boat rental, Equipment Rental, Transfers & Transport, Restaurants
8. **Getting started** — "Start selling in four steps". All four visible: Registration, Create Experience, Publish, Get bookings
9. **Ecosystem** — "Everything you need, in one connected system". Tabs: Sell, Manage, Customers, Payments, Insights, Marketplace
10. **Pricing** — "We're in your business. Not in your pocket." Fixed SaaS plan, 0% commission on direct bookings, 15-day trial (starts after the first booking). Pills: Starter €29/month, Business €59/month, Pro €99/month
11. **FAQ** — "Questions before you start". Accordion + Help center link. Emits FAQPage JSON-LD
12. Footer

**Sticky CTA** (layout, not a section): "Start free" and "See how it works", from `design/CTAs.png`. It sits over the bottom-right of the 1440 composition and covers the footer language / cookie row there. Keep that row readable (offset, or hide the bar while the row is in view). The 375 composition does not show this bar.

**Header.** Desktop: Product, Solutions, Marketplace, Pricing, Resources, "For travelers", language. No primary CTA in the bar. Mobile bar: logo, language, menu button. Open menu (`design/Navigation — menu open (375).png`): Product, Solutions, and Resources are disclosures; Marketplace and Pricing are plain links; "For travelers" and the language control sit at the bottom. Submenu items are not in the export — render the triggers only until `design/screens/` supplies them. Pricing scrolls to `#pricing`.

**Footer.** Social row ("Follow product updates and Owner stories", Instagram, Facebook), then Product, Solutions (same six labels as the accordion), Resources, Company and legal. Utility row: language, "Cookie settings".

**Hero media.** The planner and phone are a bitmap, the LCP image, not a live bookings island. "Watch how it works" opens a dialog only after a video file is added; until then the control is present and does nothing. Store badges and "Start free" use URLs from `site.ts` (`PUBLIC_APP_URL` and store links). Do not invent those URLs.

**Copy.** Transcribe visible v7 strings into the dictionaries on the screen pass. Collapsed FAQ answers are not in the export (only the first answer is open). Do not write them.

**Hydration.**

| Piece | How |
|---|---|
| Hero image, owner app, channels, effect, getting started, pricing, sticky CTA | Static `.astro` |
| "Watch how it works" dialog | Island, and only once the video asset exists. `client:visible` |
| Already here | Island, light motion. `client:visible` |
| Solutions accordion | `<details>` or a Radix accordion island. `client:visible` if an island. One panel open |
| Ecosystem tabs | Radix tabs island. `client:visible` |
| FAQ | `<details>` or accordion island. One panel open |
| Mobile menu | Existing disclosure. `client:load` |
| Cookie settings | `client:idle` |

**v3 code still on disk.** `src/sections/` still has `sound-familiar`, `what-changes`, `beyond-basics`, `testimonials`, and `final-cta`, and it still mounts ecosystem before solutions. Leave that tree until the matching `design/screens/<section>/` folder exists, then replace it in the same change:

| v3 folder | v7 |
|---|---|
| `sound-familiar` | `already-here` |
| `what-changes` | `owner-app` |
| — | `channels`, `effect`, `pricing` |
| `solutions` | same folder, accordion instead of a card grid |
| `getting-started` | same folder, static (all four steps visible) |
| `ecosystem` | same folder, after getting started |
| `beyond-basics`, `testimonials`, `final-cta` | remove |

## 6. Rules

### 6.1 Astro vs React
1. Default to `.astro`. A React island is allowed **only** when the component needs client state, events, or animation.
2. Hydration directive is mandatory and deliberate: `client:load` only for the mobile menu, `client:visible` for below-the-fold islands, `client:idle` for cookie settings. The hero visual is a static image. Never use `client:only` unless a library cannot SSR; justify in a comment.
3. Islands receive plain serializable props (strings, numbers, arrays). Pass translated strings from the `.astro` parent; do not import dictionaries inside islands.
4. Each island must render a meaningful static HTML shell (no empty placeholders, no layout shift on hydration).
5. No global state libraries. Local `useState` / `useReducer` only.

### 6.2 Content and i18n
1. **No user-facing string is hardcoded** in components. Everything comes from `src/i18n/dictionaries/*.json` via `useTranslations(lang)`.
2. Dictionary keys are namespaced by section: `hero.title`, `faq.items.0.q`. The `en.json` shape is the type; `hr.json` must satisfy it (typecheck fails otherwise).
3. Untranslated HR strings are copied from EN and marked in `docs/todo-translations.md`, never left empty.
4. All internal links go through a `localizedPath(lang, path)` helper. External URLs and the product app URL live in `src/config/site.ts` (`APP_URL` from `PUBLIC_APP_URL`).
5. Every page has `<html lang>`, canonical, and `hreflang` alternates including `x-default`.

### 6.3 Styling
1. Tailwind utilities only. No inline `style`, no CSS modules. Component-level CSS is allowed only in `global.css` under `@layer components` for things utilities cannot express.
2. **Design tokens first**: colors, radii, shadows, spacing scale, font families, and container widths are defined once in `@theme` in `global.css`. Do not use arbitrary values (`w-[413px]`) unless the design demands it; if you do, add a comment.
3. **Mobile-first**. Base styles target 375px; scale up with `sm/md/lg/xl`. Verify at 375, 768, 1024, 1440.
4. No horizontal page scroll at any width. Wide content scrolls inside its own container.
5. Support light theme only unless the design adds dark mode; use `color-scheme` accordingly.
6. Class order is enforced by `prettier-plugin-tailwindcss`.

### 6.4 Performance
1. LCP element (hero visual) is preloaded, `fetchpriority="high"`, never lazy.
2. Every `<img>`/`<Image>` has `width`, `height`, and meaningful `alt` (empty `alt=""` for decorative). Below-the-fold images are `loading="lazy"` and `decoding="async"`.
3. Fonts: max 2 families and 3–4 weights total, subset to Latin + Latin-Extended (Croatian needs `č ć đ š ž`).
4. Third-party scripts are forbidden unless approved in `docs/decisions.md`; analytics loads post-consent, deferred.
5. Do not import entire libraries (`import * as`). Import named exports only. Check bundle impact after adding any dependency (`pnpm build` + inspect `dist/_astro`).
6. Prefer CSS (`:hover`, `@starting-style`, scroll-driven animations with fallback) over JS for simple effects.

### 6.5 Animation
1. Animate only `transform` and `opacity` (and `filter` sparingly). Never animate `width/height/top/left/margin`.
2. All presets (durations, easings, stagger, spring settings) come from `src/lib/motion.ts`. No magic numbers in components.
3. Respect `prefers-reduced-motion`: disable parallax/float/looping motion, keep instant state changes.
4. Entry animations trigger on viewport entry (`whileInView`, `once: true`); nothing animates off-screen.
5. Looping animations (floating cards, planner demo) pause when out of view and when the tab is hidden.
6. Content must remain readable and in layout without JS (progressive enhancement). Initial hidden states (`opacity: 0`) are applied only after hydration, never in SSR markup, to avoid invisible content.
7. GSAP, if added: register plugins once in a shared module, kill `ScrollTrigger` instances on unmount, and load it with dynamic `import()` inside the island.

### 6.6 Accessibility
1. Semantic landmarks: one `<header>`, `<main>`, `<footer>`; one `<h1>`; heading levels never skip.
2. All interactive elements are reachable and operable by keyboard with visible `:focus-visible` styles.
3. Tabs and accordions follow WAI-ARIA patterns (Radix, or native `<details>` when there is no animation). Solutions keeps a single panel open. Ecosystem tabs keep a visible selected tab.
4. Contrast ≥ WCAG AA. Check orange-on-white CTA and white-on-navy cards.
5. Touch targets ≥ 44×44 px on mobile.
6. "Skip to content" link; accessibility statement linked in the footer.

### 6.7 Privacy and compliance
1. No cookies or tracking before consent (EU/Croatia). Footer "Cookie settings" reopens the consent dialog.
2. Legal pages (Terms, Privacy, Cookies, Accessibility, Legal notice) are linked from `site.ts`; their URLs may be external.

### 6.8 Code quality
1. TypeScript strict, no `any` (use `unknown` + narrowing). No unused exports.
2. File naming: components `PascalCase.astro/.tsx`, utilities `camelCase.ts`, folders `kebab-case`.
3. One component per file; max ~200 lines. Split sections into subcomponents when larger.
4. Comments explain *why*, not *what*.
5. Conventional Commits (`feat:`, `fix:`, `chore:`…). PRs must pass CI: `lint`, `typecheck` (`astro check`), `build`, `e2e`, `lhci`.
6. Adding a dependency requires a one-line reason in the PR and a bundle-size check.

### 6.9 Infrastructure rules
1. All AWS resources are created by CDK. No manual console changes.
2. GitHub Actions assumes a deploy role via OIDC, scoped to the one bucket and distribution.
3. No secrets in the repo. Public build-time config uses `PUBLIC_*` env vars; there should be none that are actually secret.
4. Security headers (including CSP) are defined in the CloudFront Response Headers Policy and kept in sync with the scripts actually used.

## 7. Scripts (package.json)

```
pnpm dev          # astro dev
pnpm build        # astro build
pnpm preview      # astro preview
pnpm check        # astro check (types)
pnpm lint         # eslint .
pnpm format       # prettier --write .
pnpm test:e2e     # playwright test
pnpm lhci         # lighthouse ci against preview build
pnpm infra:diff   # cdk diff
pnpm infra:deploy # cdk deploy (staging by default)
```

## 8. Definition of done for a section

- Matches desktop and 375px mockups (checked at 375 / 768 / 1024 / 1440).
- All text from dictionaries (EN + HR).
- Works with JS disabled (content visible, links functional).
- Keyboard and screen-reader pass; no axe violations.
- Respects reduced motion.
- No CLS on hydration; JS budget not exceeded.
- Lighthouse mobile targets still met.
