# Sheraliat AI - Multi-stage Docker Build
# Based on LibreChat v0.8.2

# ── Stage 1: Builder ──────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 py3-pip

ARG NODE_MAX_OLD_SPACE_SIZE=3072

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

RUN \
    touch .env ; \
    mkdir -p /app/client/public/images /app/logs /app/uploads ; \
    npm config set fetch-retry-maxtimeout 600000 ; \
    npm config set fetch-retries 5 ; \
    npm config set fetch-retry-mintimeout 15000 ; \
    attempt=1 ; \
    until timeout "$NPM_CI_TIMEOUT_SECONDS" npm ci --no-audit ; do \
        status=$? ; \
        if [ "$attempt" -ge "$NPM_CI_ATTEMPTS" ]; then \
            exit "$status" ; \
        fi ; \
        echo "npm ci --no-audit failed with exit code $status; retrying attempt $((attempt + 1))/$NPM_CI_ATTEMPTS" ; \
        attempt=$((attempt + 1)) ; \
        npm cache clean --force || true ; \
        sleep 10 ; \
    done

# Copy source
COPY --chown=node:node . .

# Build packages then frontend
ENV NODE_OPTIONS="--max-old-space-size=${NODE_MAX_OLD_SPACE_SIZE}"
RUN npm run build:data-provider
RUN npm run build:data-schemas
RUN npm run build:api
RUN npm run build:client-package
RUN cd client && npm run build

# Prune dev dependencies
RUN npm prune --production && npm cache clean --force

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner

# OCI Labels
LABEL org.opencontainers.image.title="Sheraliat AI" \
      org.opencontainers.image.description="German-hosted, branded fork of LibreChat" \
      org.opencontainers.image.vendor="Your Company" \
      org.opencontainers.image.source="https://github.com/your-org/sheraliat-ai" \
      org.opencontainers.image.version="0.8.2"

# Install runtime dependencies
RUN apk add --no-cache jemalloc wget python3 py3-pip uv tini

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
COPY --from=builder --chown=node:node /app/config ./config
COPY --from=builder --chown=node:node /app/src ./src

# Ensure writable directories exist
RUN mkdir -p /app/client/public/images /app/logs /app/uploads && touch /app/.env

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV BRAND_NAME="Sheraliat AI"

EXPOSE 3080

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3080/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "backend"]
