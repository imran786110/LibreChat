#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  Sheraliat AI – Deploy Script
#  Usage: ./deploy.sh [--skip-pull] [--no-cache]
# ─────────────────────────────────────────────

IMAGE="librechat:sheraliat-branding"
COMPOSE_FILE="deploy-compose.yml"
BRANCH="sheraliat-branding"
REMOTE="origin"

SKIP_PULL=false
NO_CACHE=""

for arg in "$@"; do
  case $arg in
    --skip-pull) SKIP_PULL=true ;;
    --no-cache)  NO_CACHE="--no-cache" ;;
  esac
done

log()  { echo "[$(date '+%H:%M:%S')] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

# ── 1. Preflight checks ───────────────────────
log "Checking prerequisites..."
command -v git    >/dev/null 2>&1 || fail "git not found"
command -v docker >/dev/null 2>&1 || fail "docker not found"

[ -f ".env" ]             || fail ".env file not found — copy .env.example and configure it"
[ -f "librechat.yaml" ]   || fail "librechat.yaml not found — copy librechat.example.yaml and configure it"
[ -f "$COMPOSE_FILE" ]    || fail "$COMPOSE_FILE not found"

# ── 2. Pull latest code ───────────────────────
if [ "$SKIP_PULL" = false ]; then
  log "Pulling latest code from $REMOTE/$BRANCH..."
  git fetch "$REMOTE" "$BRANCH"
  git checkout "$BRANCH"
  git merge --ff-only "$REMOTE/$BRANCH" || fail "Fast-forward failed — local commits exist. Resolve manually or use --skip-pull."
fi

# ── 3. Build Docker image ─────────────────────
log "Building Docker image: $IMAGE ..."
docker build $NO_CACHE \
  --build-arg NODE_MAX_OLD_SPACE_SIZE=3072 \
  -t "$IMAGE" \
  -f Dockerfile \
  .

log "Image built: $IMAGE"

# ── 4. Ensure data directories exist (never wipe existing data) ───
# These are bind-mounted into containers — mkdir -p is safe: it skips
# creation if the directory already exists and never removes contents.
mkdir -p images uploads logs data-node meili_data_v1.35.1

# Warn if MongoDB data directory looks empty (first-time or data loss risk)
if [ -z "$(ls -A data-node 2>/dev/null)" ]; then
  log "WARNING: data-node/ is empty — MongoDB will start fresh (no existing data)."
  log "         If you expected existing client data, stop now and restore a backup."
  read -r -p "         Continue anyway? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || fail "Aborted by user."
fi

# ── 5. Deploy with docker compose ─────────────
# IMPORTANT: 'down' never uses --volumes, so named volumes (pgdata2) and
# bind-mount directories (data-node, uploads, images) are fully preserved.
log "Stopping existing containers..."
docker compose -f "$COMPOSE_FILE" down

log "Starting all services..."
docker compose -f "$COMPOSE_FILE" up -d

# ── 6. Health check ───────────────────────────
log "Waiting for API to become healthy..."
RETRIES=20
until docker inspect --format='{{.State.Health.Status}}' SheraliatAI-API 2>/dev/null | grep -q "healthy"; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    log "Warning: API did not report healthy within timeout — check logs with: docker compose -f $COMPOSE_FILE logs -f api"
    break
  fi
  sleep 5
done

# ── 7. Summary ────────────────────────────────
log "─────────────────────────────────────"
log "Deploy complete."
log "Running containers:"
docker compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
log ""
log "Tail logs:  docker compose -f $COMPOSE_FILE logs -f api"
log "Stop all:   docker compose -f $COMPOSE_FILE down"
