# AGENTS.md

## Quick commands
- `pnpm dev` — start dev server
- `pnpm build` — build (includes typecheck)
- `pnpm lint` — lint with `next/core-web-vitals`

**Use pnpm**, not npm. Lockfile is `pnpm-lock.yaml`.

## Architecture
- Next.js 16 App Router, deployed to Vercel.
- **MDX blog**: posts live in `src/posts/` as `.mdx` files. Frontmatter fields: `title`, `date`, `description`, `thumbnailUrl`, `tags`.
- Blog page at `src/app/blog/[post]/page.tsx` pre-renders every post via `generateStaticParams` and compiles MDX with `next-mdx-remote/rsc`. Custom components in the MDX scope: `Pre`/`SyntaxHighlighter` (from `CodeBlock`), `Diagram`, `InlineHighlighter`, `Image`.
- Post files are read through `src/lib/posts.ts`, which validates slugs and frontmatter before use.
- **Components** follow a directory pattern: `src/components/<Name>/index.tsx` + `<name>.module.css`. Imports use `@/components/<Name>` (auto-resolves to `index.tsx`).
- **Data**: static JSON in `src/data/` (jobs, projects, articles).

## Path alias
`@/*` maps to `./src/*` in `tsconfig.json`.

## Styling
- CSS Modules per component. Global theme vars in `src/app/globals.css` (light/dark theme via CSS custom properties).
- Theme toggling: `useThemeHook` hook reads/writes `localStorage` key `theme` and toggles `.light`/`.dark` class on `<body>`.

## Environment
- Dev: `.env.local` — local-only API keys (reCAPTCHA, Resend, optional Upstash). Never commit it.
- Prod: set secrets in the Vercel project environment variables. Do not commit `.env` or `.env.*` files; only `.env.example` is tracked.
- `.gitignore` ignores `.env` and `.env.*`; verify with `git status` before committing.

## CSP and security headers
`next.config.mjs` sets the static Content-Security-Policy and security headers in `headers()`. Pages stay statically rendered for CDN caching, so the CSP uses a static policy rather than a per-request nonce. If adding new third-party script, frame, or connection sources, update the CSP string there. Set `CSP_REPORT_ONLY=true` to deploy the policy in report-only mode.

## Key dependencies
- `gray-matter` — frontmatter parsing for MDX files
- `next-mdx-remote/rsc` — server-side MDX compilation
- `remark-gfm` — GitHub Flavored Markdown support
- `react-syntax-highlighter` — code blocks in blog posts
- `mermaid` — diagrams in blog posts (via `Diagram` component)
- `lucide-react` — icons

## TypeScript
- TypeScript `6.0.3` is intentional. TypeScript 7 is blocked by `typescript-eslint` until TS 7.1 API support lands. Do not bump the `typescript` package until `pnpm typecheck`, `pnpm lint`, and `pnpm build` all pass with it.
- `pnpm typecheck` runs `next typegen` before `tsc --noEmit` because `next-env.d.ts` imports generated route types.

## Verification
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` — Vitest unit tests
- `pnpm build`
- `pnpm test:e2e` — Playwright against a local production build
- `BASE_URL=... pnpm test:deploy` — preview/production smoke tests
- `pnpm security:audit` (`pnpm audit --prod --audit-level=high`)

## Available skills
OpenCode skills are bundled in `.agents/skills/`. Load them when the task matches their triggers:

| Skill | When to use |
|---|---|
| `next-best-practices` | Writing or reviewing any Next.js code (RSC boundaries, data patterns, async APIs, metadata, error handling, image/font optimization) |
| `vercel-react-best-practices` | Optimizing React/Next.js perf — waterfalls, bundle size, re-renders, data fetching |
| `vercel-composition-patterns` | Refactoring components with boolean prop proliferation, building compound components, or designing reusable APIs |
| `typescript-advanced-types` | Complex type logic — generics, conditional types, mapped types, type guards |
| `nodejs-best-practices` | Architecture decisions for Node.js — framework selection, async patterns, security |
| `nodejs-backend-patterns` | Building Express/Fastify APIs — middleware, error handling, auth, DB integration |
| `seo` | Improving metadata, structured data, sitemaps, robots.txt, canonical URLs |
| `accessibility` | WCAG 2.2 audits — keyboard nav, screen reader support, color contrast, ARIA |
| `frontend-design` | Building visually distinctive UI components, pages, or layouts |
| `next-upgrade` | Upgrading Next.js version (codemods, migration guides) |
| `next-cache-components` | Next.js 16 PPR, `use cache`, `cacheLife`, `cacheTag`, `updateTag` |
