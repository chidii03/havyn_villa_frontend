# syntax=docker/dockerfile:1
# Multi-stage build (prompt 27). Build context is the MONOREPO ROOT, not apps/web/
# (see infra/docker-compose.yml's `build: context: .`) — npm workspaces needs the
# root package.json/package-lock.json plus every workspace's package.json to
# resolve @havyn/shared and apps/web's own deps correctly.

# ---- deps stage -----------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

# ---- build stage ------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/web apps/web
COPY packages/shared packages/shared

# NEXT_PUBLIC_* vars are inlined into the client JS bundle at build time (Next.js's
# own behavior, not a choice made here) — they MUST be build args, not just runtime
# env vars, or the deployed bundle silently keeps whatever value (or none) was
# present when this image was built. None of these three are secret — see
# architecture/04-integrations.md#2 ("public by design", referrer-restricted).
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

RUN npm run build -w apps/web

# ---- runtime stage -----------------------------------------------------------
FROM node:20-alpine AS runtime
RUN addgroup -S havyn && adduser -S havyn -G havyn
WORKDIR /app

# next.config.ts's `output: "standalone"` traces only the node_modules actually
# reachable from the server bundle — dramatically smaller than copying the whole
# workspace. The server entrypoint lands at apps/web/server.js *within* the
# standalone output (Next.js monorepo behavior: it mirrors the workspace's relative
# path from the repo root, not a flat server.js at the standalone root) — verified
# by actually running `next build` locally and inspecting .next/standalone/ before
# writing this, not assumed from a non-monorepo example.
COPY --from=build --chown=havyn:havyn /app/apps/web/.next/standalone ./
COPY --from=build --chown=havyn:havyn /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=havyn:havyn /app/apps/web/public ./apps/web/public

USER havyn
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0 NODE_ENV=production

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD wget -q -O- http://localhost:3000/ >/dev/null || exit 1

CMD ["node", "apps/web/server.js"]
