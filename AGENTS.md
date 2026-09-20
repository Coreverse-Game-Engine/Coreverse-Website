# AGENTS.md

## Project Overview

This project is the official website of the Coreverse game engine ecosystem.
It is a multilingual Next.js app (13 locales) that authenticates users through
Supabase Auth and reads/writes all application data through the Coreverse DB
SDK (`@Coreverse-Game-Engine/db-client`).

## Tech Stack

- TypeScript (native TS 7 `tsc` for type checking, TS 6 compat package for ESLint)
- React 19 + Next.js (App Router)
- Tailwind CSS 4, radix-ui, shadcn
- next-intl (i18n), react-hook-form, zod
- @tanstack/react-query (through the Coreverse DB SDK hooks)
- pnpm (via Corepack), ESLint
- GitHub Actions

## Coding Rules

- Use TypeScript(.ts) or TypeScript JSX(.tsx) everytime.
- Don't use 'any'.
- Design have to be modern, support double thema mode(dark and white), secondary color.
- Don't write unnecessary comment.
- Every user-facing string lives in `src/constants/i18n.json` and must exist in all 13 locales.
- Application data goes through the Coreverse DB SDK. `@supabase/*` is only for
  the Auth session (sign in/out, session cookies), never for querying data.
- Any `next`/`redirectTo` value coming from the outside must pass through
  `sanitizeInternalPath` (`src/lib/safe-redirect.ts`) before it is used to redirect.

## Folder Structure

- `.github/` issue forms, PR template, CODEOWNERS, Dependabot, workflows
  - `actions/setup/` composite action: Node (from `.node-version`), pnpm, GitHub Packages auth, install
  - `workflows/` `ci.yml` (lint, typecheck, build, required-checks gate; also callable), `codeql.yml`
- `public/` static assets (`fonts/`, `images/`, `videos/`)
- `src/app/` App Router
  - `[locale]/(website)/` landing page and its layout
  - `[locale]/(auth)/` login, register, forgot/reset/set-password
  - `api/auth/callback/` OAuth code exchange route
- `src/components/` shared UI (`ui/`, `layout/`, `effects/`)
- `src/constants/` `i18n.json` (all locales)
- `src/context/` React contexts
- `src/features/` feature modules (`auth/`, `community/`, `engine-features/`, `install/`)
- `src/generated/` generated files (`video-manifest.ts`, refresh with `pnpm run videos:generate`)
- `src/hooks/` shared hooks
- `src/i18n/` next-intl routing, navigation and request config
- `src/lib/` helpers (`coreverse/` SDK configuration, `safe-redirect.ts`, `utils.ts`, ...)
- `src/providers/` app-wide providers (`coreverse-provider.tsx`)
- `src/scripts/` build-time scripts
- `src/services/` server-side integrations (`brevo.ts`)
- `src/supabase/` Supabase Auth clients (browser, server, proxy session refresh)
- `src/proxy.ts` i18n routing + session refresh

## Commands

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

Run `lint` and `typecheck` after each change. `pnpm run test` will be added
together with the test setup.

## Tooling & Delivery Exception (temporary)

The Faz 1-4 modernization (pnpm, TypeScript 7, Coreverse DB SDK integration,
download panel) is finished. Until the delivery work below is complete, the
following changes are allowed for `package.json`, the lockfile, `.npmrc`,
`tsconfig.json`, config files, `.github/*` and new top-level folders:

- test setup (Vitest and friends) and the CI test job
- tag-based release/deploy workflow (Vercel)
- devkit scripts (`scripts/`)
- mdBook documentation (`docs/`, `Documentation` branch workflow)

Changes are limited to what these tasks actually require; every other "Do Not"
rule still applies. Remove this section once the work is complete.

## Do Not

- Don't change package.json unless necessary.
- Don't add new dependency unless necessary.
- Don't change config files unless necessary.
- Don't use npm or yarn; this repository uses pnpm only.

## Preferred Style

- Use Functional Component.
- Use Arrow Function.
- Use Async/Await.
- Style have to obey the rules of TypeScript, JavaScript, ESLint, React Compiler.
- The code's structure algorithm have to be modular, work correctly, be written cleanly.
- The comment lines, parameters and functions have to be English.
