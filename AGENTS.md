# AGENTS.md

## Project Overview

This project is a modern website off a game engine.

## Tech Stack

- TypeScript
- React
- Next.js
- Tailwind CSS
- radix-ui
- ESLint
- shadcn

## Coding Rules

- Use TypeScript(.ts) or TypeScript JSX(.tsx) everytime.
- Don't use 'any'.
- Design have to be modern, support double thema mode(dark and white), secondary color.
- Don't write unnecessary comment.

## Folder Structure

coreverse-website/
- .github/
  - ISSUE_TEMPLATE/
    - bug-report.yml
    - config.yml
    - feature_request.yml
  - workflows/
    - ci.yml
    - codeql.yml
    - deploy.yml
    - lint.yml
  - CODE_OF_CONDUCT.md
  - CONTRIBUTING.md
  - dependabot.yml
  - FUNDING.yml
  - pull_request_template.md
  - SECURITY.md
- public/
  - fonts/
  - images/
    - Apple-Logo.svg
    - coreverse-engine.svg
    - coreverse-engine-emblem.svg
    - GitHub_Invertocat_Black.svg
    - GitHub_Invertocat_white.svg
    - Google-Logo.svg
    - Linux-Logo.svg
    - OpenGL-Logo.svg
    - Vulkan-Logo.svg
    - Windows-Logo.svg
  - videos/
    - Editor.mp4
    - Intro.mp4
    - Physics.mp4
    - Renderer.mp4
  - file.svg
  - globe.svg
  - next.svg
  - vercel.svg
  - window.svg
- src/
  - app/
    - api/
      - auth/
        - callback/
          - route.ts
    - [locale]/
      - layout.tsx
      - (website)/
        - layout.tsx
        - page.tsx
      - (auth)/
        - forgot-password/
          - page.tsx
        - login/
          - page.tsx
        - register/
          - page.tsx
        - reset-password/
          - page.tsx
    - favicon.ico
    - globals.css
    - layout.tsx
    - page.tsx
  - assets/
    - search.svg
  - components/
    - effects/
      - interactive-background.tsx
    - layout/
      - panel-container.tsx
      - top-bar.tsx
    - ui/
      - Button/
        - button.tsx
      - Checkbox/
        - checkbox.tsx
      - InitialsAvatar/
        - initials-avatar.tsx
      - Input/
        - input.tsx
      - Label/
        - label.tsx
      - UserAvatar/
        - user-avatar.tsx
  - config/
  - constants/
    - i18n.json
  - context/
    - scroll-context.tsx
  - features/
    - auth/
      - actions.ts
      - avatar-upload.tsx
      - forgot-password-form.tsx
      - login-form.tsx
      - oauth-buttons.tsx
      - register-form.tsx
      - reset-password-form.tsx
      - types.ts
      - user-menu.tsx
      - validation.ts
    - community/
      - community-panel.tsx
    - features/
      - feature-controls.tsx
      - feature-video.tsx
      - features-panel.tsx
      - types.ts
    - install/
      - install-panel.tsx
  - generated/
    - video-manifest.ts
  - hooks/
    - use-current-user.ts
    - use-is-portrait.ts
  - i18n/
    - navigation.ts
    - request.ts
    - routing.ts
  - lib/
    - avatar-color.ts
    - avatar-url.ts
    - image-compression.ts
    - utils.ts
  - scripts/
    - generate-video.mjs
  - services/
    - avatar-storage.ts
    - brevo.ts
  - supabase/
    - migrations/
      - 20260713124200_avatar_system.sql
      - 20260713120900_username_add.sql
    - admin.ts
    - client.ts
    - middleware.ts
    - server.ts
  - utils/
  - proxy.ts
- .editorconfig
- .env.example
- .gitattributes
- .gitignore
- AGENTS.md
- CLAUDE.md
- components.json
- eslint.config.mjs
- LICENSE
- next.config.ts
- package.json
- package-lock.json
- postcss.config.mjs
- PROGRESS.md
- README.md
- tsconfig.json

## Testing

After each change:

```bash
npm run lint
npm run test
```

## Modernization Exception (temporary)

The pnpm + TypeScript 7 migration and the Coreverse DB SDK integration (see
PROGRESS.md) are a deliberate, scoped exception to the "Do Not" rules below
for `package.json`, the lockfile, `.npmrc`, `tsconfig.json`, and
`.github/workflows/*`. Changes in this phase are limited to what the
modernization actually requires; every other "Do Not" rule still applies,
and this exception should be removed once the migration is complete.

## Do Not

- Don't change package.json unless necessary.
- Don't add new dependency unless necessary.
- Don't change config files unless necessary.

## Preferred Style

- Use Functional Component.
- Use Arrow Function.
- Use Async/Await.
- Style have to obey the rules of TypeScript, JavaScript, ESLint, React Compiler.
- The code's structure algorithm have to be modular, work correctly, be written cleanly.
- The comment lines, parameters and functions have to be English.
