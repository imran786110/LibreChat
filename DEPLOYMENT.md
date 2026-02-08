# Sheraliat AI - Deployment Guide

## Prerequisites

- Docker 24+ and Docker Compose v2
- A server with at least 4 GB RAM (8 GB recommended)
- A domain name with DNS configured
- (Optional) A container registry for image hosting

## Quick Start

```bash
# 1. Clone and enter project
git clone <your-repo-url> sheraliat-ai
cd sheraliat-ai

# 2. Copy and edit environment
cp .env.example .env
# Edit .env with your API keys, secrets, and domain
```

## Environment Configuration

Key variables in `.env`:

| Variable | Description | Default |
|---|---|---|
| `APP_TITLE` | Application display name | `Sheraliat AI` |
| `BRAND_NAME` | Brand name for emails / headers | `Sheraliat AI` |
| `POLICY_VERSION` | Consent policy version (triggers re-consent on change) | `2026-02-01` |
| `HELP_AND_FAQ_URL` | Help / legal page link | `/impressum` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongodb:27017/SheraliatAI` |
| `MEILI_MASTER_KEY` | Meilisearch encryption key | _(generate a random key)_ |
| `CREDS_KEY` | 32-char hex credential encryption key | _(generate)_ |
| `CREDS_IV` | 16-char hex credential IV | _(generate)_ |
| `JWT_SECRET` | Secret for JWT token signing | _(generate)_ |
| `JWT_REFRESH_SECRET` | Secret for JWT refresh tokens | _(generate)_ |

Generate secrets:

```bash
# CREDS_KEY (32 hex chars)
openssl rand -hex 16

# CREDS_IV (16 hex chars)
openssl rand -hex 8

# JWT secrets
openssl rand -base64 48
```

## Build

### Local Build

```bash
docker build -t sheraliat-ai:latest .
```

### Registry Build & Push

```bash
# Set your registry
export REGISTRY=registry.example.com/sheraliat-ai

# Build and tag
docker build -t ${REGISTRY}/web:latest -t ${REGISTRY}/web:$(date +%Y%m%d) .

# Push
docker push ${REGISTRY}/web:latest
docker push ${REGISTRY}/web:$(date +%Y%m%d)
```

Or use the included scripts:

```bash
export DOCKER_REMOTE_REGISTRY=registry.example.com/sheraliat-ai
bash utils/docker/docker-build.sh latest
bash utils/docker/docker-push.sh latest
```

## Deploy

### Docker Compose (Recommended)

```bash
# Start all services
docker compose up -d

# Check health
docker compose ps
docker compose logs -f api
```

The default `docker-compose.yml` starts:
- **api** - Sheraliat AI application (port 3080)
- **mongodb** - MongoDB 8.0 database
- **meilisearch** - Search engine
- **vectordb** - pgvector for RAG
- **rag_api** - RAG API service

### Production with Reverse Proxy

For production, use `deploy-compose.yml` which includes an nginx reverse proxy:

```bash
docker compose -f deploy-compose.yml up -d
```

Edit `client/nginx.conf` for TLS/SSL configuration.

### Helm (Kubernetes)

```bash
cd helm/librechat
helm dependency update
helm install sheraliat-ai . -f values.yaml -n sheraliat --create-namespace
```

## Application Configuration

Edit `librechat.yaml` for runtime configuration:

- **Welcome message**: `interface.customWelcome`
- **Terms / Privacy URLs**: `interface.termsOfService`, `interface.privacyPolicy`
- **Registration providers**: `registration.socialLogins`
- **Endpoints**: `endpoints.custom` for LLM provider configuration
- **File storage**: `fileStrategy` for S3/Firebase/local storage

## GDPR & Legal Pages

The application includes built-in German legal pages:

| Route | Content |
|---|---|
| `/terms` | Nutzungsbedingungen (Terms of Service) |
| `/privacy` | Datenschutzerklaerung (Privacy Policy) |
| `/impressum` | Impressum (Legal Notice) |

Update the placeholder brackets `[...]` in the legal page components under `client/src/components/Legal/` with your actual company details.

### Consent Tracking

- Users must accept terms before login (checkbox on login page)
- Consent is stored per-user with timestamp and policy version
- Changing `POLICY_VERSION` in `.env` forces re-consent from all users
- Consent records: `consentPolicyVersion`, `consentTimestamp` on the User model

## Updating

```bash
# Pull latest image (or rebuild)
docker compose pull
# or: docker build -t sheraliat-ai:latest .

# Restart with zero downtime
docker compose up -d --remove-orphans

# Verify health
docker compose ps
curl -s http://localhost:3080/api/health
```

## Monitoring

The API container includes a built-in healthcheck:

```
GET /api/health
```

Docker reports container health status automatically. Logs are written to `./logs/`.

## Troubleshooting

| Issue | Solution |
|---|---|
| Container exits immediately | Check `docker compose logs api` for startup errors |
| MongoDB connection refused | Ensure mongodb container is healthy: `docker compose ps` |
| Blank page after deploy | Verify frontend was built: check `/app/client/dist/` exists in container |
| Terms re-consent loop | Verify `POLICY_VERSION` in `.env` matches the stored version |
| High memory usage | jemalloc is pre-configured; adjust `NODE_MAX_OLD_SPACE_SIZE` build arg if needed |
