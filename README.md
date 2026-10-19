# HolidayGet owner site

Static marketing landing page for HolidayGet. English and Croatian. Hosted as a private S3 bucket behind CloudFront.

`architecture.md` is the source of truth for stack and rules. Design PDFs live in `design/` and are not deployed.

## Requirements

- Node 24 (see `.nvmrc`)
- pnpm 12

```bash
pnpm install
cp .env.example .env
```

## Run, build, test

```bash
pnpm dev          # http://localhost:4321/en/ and /hr/
pnpm build        # writes dist/
pnpm preview
pnpm check        # astro check
pnpm lint
pnpm format
pnpm test:e2e     # requires a prior build; Playwright starts preview
pnpm lhci         # Lighthouse CI against dist/; needs Chrome
pnpm --filter infra synth
```

`pnpm infra:diff` and `pnpm infra:deploy` talk to AWS. Deploy defaults to the staging stack. Pass context with `pnpm --filter infra deploy -- -c env=production`.

## Add a language

1. Add the locale code to `locales` in `src/i18n/config.ts` and to `i18n.locales` in `astro.config.mjs`.
2. Copy `src/i18n/dictionaries/en.json` to `src/i18n/dictionaries/<code>.json` and translate it. `pnpm check` fails if the shape drifts from English.
3. Register the dictionary in `src/i18n/utils.ts`.
4. Add the locale to the sitemap `i18n.locales` map.
5. Teach the CloudFront function in `infra/lib/viewer-request.js` about the new `Accept-Language` prefix.

## Add a section

1. Create `src/sections/<name>/<Name>.astro`. Put a React island in `islands/` only when the section needs state, events, or animation.
2. Read copy with `useTranslations(lang)`. Do not hardcode visitor-facing strings.
3. Render the section from `src/pages/[lang]/index.astro` in the design order.
4. Use `client:load` only for above-the-fold interactivity, `client:visible` below the fold, and `client:idle` for the cookie dialog.

## Deploy

Push to `main` deploys staging. A tag `vX.Y.Z` deploys production. GitHub Actions assumes an OIDC role. No long-lived AWS keys.

Create the stack first (`pnpm --filter infra deploy`) and copy the outputs into repository variables:

| Variable                                | Used for                                  |
| --------------------------------------- | ----------------------------------------- |
| `AWS_REGION`                            | Both environments                         |
| `AWS_ROLE_ARN_STAGING`                  | Push to `main`                            |
| `AWS_ROLE_ARN_PRODUCTION`               | Release tags                              |
| `S3_BUCKET_STAGING`                     | Staging bucket name output                |
| `S3_BUCKET_PRODUCTION`                  | Production bucket name output             |
| `CLOUDFRONT_DISTRIBUTION_ID_STAGING`    | Staging invalidation                      |
| `CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION` | Production invalidation                   |
| `PUBLIC_SITE_URL_STAGING`               | Canonical origin for the staging build    |
| `PUBLIC_SITE_URL_PRODUCTION`            | Canonical origin for the production build |
| `PUBLIC_APP_URL`                        | Product app links                         |

CDK context, not GitHub secrets:

| Context                 | Effect                                                               |
| ----------------------- | -------------------------------------------------------------------- |
| `env`                   | `staging` (default) or `production`                                  |
| `domainName`            | Adds an ACM certificate in us-east-1 and a CloudFront alias          |
| `hostedZoneId`          | With `domainName`, adds Route 53 A and AAAA records                  |
| `githubRepo`            | `owner/name` trusted by the deploy role. Default `OWNER/REPO`        |
| `githubOidcProviderArn` | Reuse an existing GitHub OIDC provider                               |
| `basicAuth`             | Staging only. `user:password` checked by the viewer-request function |

Staging sends `X-Robots-Tag: noindex`. Basic auth stays off until `basicAuth` is set at deploy time.
