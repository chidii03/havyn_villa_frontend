# @havyn/shared

Shared TypeScript types + Zod schemas for `apps/web` (and, later, the Expo app).

## Scope right now (bootstrap / prompt 08)

Only the two cross-cutting API contracts that are already decided and stable:
the error envelope (`errors.ts`) and the pagination envelope (`pagination.ts`) —
both mirrored from the backend's `common/error`/`common/web` packages.

**Deliberately empty so far:** domain entity types (Property, Booking, User, ...).
Those belong to prompt 07 (database design) / prompt 10 (property domain) once the
backend module that owns each entity exists — see `project-docs/prompts/`. Adding
them here first would let the frontend drift out of sync with the real API.

## Consuming from apps/web

This package ships as TypeScript source (no build step) via the `main`/`exports`
field pointing at `src/index.ts`. Once `apps/web` actually imports from
`@havyn/shared`, add `transpilePackages: ["@havyn/shared"]` to
`apps/web/next.config.ts` so Next.js compiles it.
