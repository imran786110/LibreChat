# syntax=docker/dockerfile:1
# Sheraliat AI - Multi-stage Docker Build
# Based on LibreChat v0.8.9-rc1

# ── Stage 1: Builder ──────────────────────────────────────────
FROM node:24.22.1-alpine AS builder

RUN apk upgrade --no-cache
RUN apk add --no-cache python3 py3-pip

# Disable dependency installation analytics before any npm lifecycle scripts run.
ENV SCARF_ANALYTICS=false

ARG NODE_MAX_OLD_SPACE_SIZE=3072
ARG NPM_CI_TIMEOUT_SECONDS=1500
ARG NPM_CI_ATTEMPTS=2

RUN mkdir -p /app && chown node:node /app
WORKDIR /app

USER node

# Copy package manifests for layer caching
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node api/package.json ./api/package.json
COPY --chown=node:node client/package.json ./client/package.json
COPY --chown=node:node packages/data-provider/package.json ./packages/data-provider/package.json
COPY --chown=node:node packages/data-schemas/package.json ./packages/data-schemas/package.json
COPY --chown=node:node packages/api/package.json ./packages/api/package.json
COPY --chown=node:node packages/client/package.json ./packages/client/package.json
COPY --chown=node:node packages/chat/package.json ./packages/chat/package.json
COPY --chown=node:node vendor/code ./vendor/code

RUN \
    touch .env ; \
    mkdir -p /app/client/public/images /app/logs /app/uploads ; \
    npm config set fetch-retry-maxtimeout 600000 ; \
    npm config set fetch-retries 5 ; \
    npm config set fetch-retry-mintimeout 15000

RUN --mount=type=cache,target=/home/node/.npm,uid=1000 \
    attempt=1 ; \
    until npm ci --no-audit --prefer-offline ; do \
        status=$? ; \
        if [ "$attempt" -ge "${NPM_CI_ATTEMPTS:-3}" ]; then \
            exit "$status" ; \
        fi ; \
        echo "npm ci failed (exit $status); retrying attempt $((attempt + 1))/${NPM_CI_ATTEMPTS:-3}" ; \
        attempt=$((attempt + 1)) ; \
        sleep 10 ; \
    done

# Build packages then frontend. Each package's source is copied right before
# its own build, so a change only rebuilds that package and the ones after it
# (a client-only change reuses every package build from cache).
ENV NODE_OPTIONS="--max-old-space-size=${NODE_MAX_OLD_SPACE_SIZE}"

COPY --chown=node:node packages/data-provider ./packages/data-provider
RUN npm run build:data-provider

COPY --chown=node:node packages/data-schemas ./packages/data-schemas
RUN npm run build:data-schemas

COPY --chown=node:node packages/api ./packages/api
RUN npm run build:api

COPY --chown=node:node packages/client ./packages/client
RUN npm run build:client-package

COPY --chown=node:node packages/chat ./packages/chat
RUN npm run build:chat

ARG VITE_MCP_SANDBOX_URL=
COPY --chown=node:node client ./client
RUN --mount=type=cache,target=/app/client/node_modules/.vite,uid=1000 \
    cd client && npm run build

# Remaining source (api/, config/, ...) — needs no build step
COPY --chown=node:node . .

# Prune dev dependencies
RUN npm prune --omit=dev --no-audit --no-fund && npm cache clean --force

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM node:24.22.1-alpine AS runner

# OCI Labels
LABEL org.opencontainers.image.title="Sheraliat AI" \
      org.opencontainers.image.description="German-hosted, branded fork of LibreChat" \
      org.opencontainers.image.vendor="Your Company" \
      org.opencontainers.image.source="https://github.com/your-org/sheraliat-ai" \
      org.opencontainers.image.version="0.8.9-rc1"

# Install runtime dependencies
RUN apk upgrade --no-cache && apk add --no-cache jemalloc wget python3 py3-pip uv tini

# Add uv for MCP support
COPY --from=ghcr.io/astral-sh/uv:0.9.5-python3.12-alpine /usr/local/bin/uv /usr/local/bin/uvx /bin/

# jemalloc for better memory management
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2

RUN mkdir -p /app && chown node:node /app
WORKDIR /app

USER node

# Copy built artifacts from builder
COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/api ./api
COPY --from=builder --chown=node:node /app/client/dist ./client/dist
COPY --from=builder --chown=node:node /app/client/public ./client/public
COPY --from=builder --chown=node:node /app/packages ./packages
COPY --from=builder --chown=node:node /app/vendor ./vendor
COPY --from=builder --chown=node:node /app/config ./config

# Ensure writable directories exist
RUN mkdir -p /app/client/public/images /app/logs /app/uploads /app/skill /app/data && \
    chmod 1777 /app/data && touch /app/.env

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV BRAND_NAME="Sheraliat AI"

EXPOSE 3080

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3080/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "backend"]
