#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  Sheraliat AI – Post-Deploy Cleanup Script
#  Removes dangling/unused Docker images and
#  build cache to reclaim disk space.
#  Run AFTER a successful ./deploy.sh
# ─────────────────────────────────────────────

log()  { echo "[$(date '+%H:%M:%S')] $*"; }

log "Disk usage before cleanup:"
df -h / | tail -1

log "─────────────────────────────────────"

# Remove dangling images (untagged layers left over from builds)
DANGLING=$(docker images -f "dangling=true" -q)
if [ -n "$DANGLING" ]; then
  log "Removing dangling images..."
  docker rmi $DANGLING
else
  log "No dangling images found."
fi

# Remove old sheraliat-branding images (keep only the current one)
OLD_IMAGES=$(docker images librechat --format "{{.ID}} {{.Tag}}" \
  | grep -v "sheraliat-branding" \
  | awk '{print $1}')
if [ -n "$OLD_IMAGES" ]; then
  log "Removing old librechat images (non-current tags)..."
  docker rmi $OLD_IMAGES 2>/dev/null || true
else
  log "No old librechat images to remove."
fi

# Remove unused build cache
log "Pruning Docker build cache..."
docker builder prune -f

# Remove stopped containers (should be none after a clean deploy, but just in case)
STOPPED=$(docker ps -a -f "status=exited" -q)
if [ -n "$STOPPED" ]; then
  log "Removing stopped containers..."
  docker rm $STOPPED
else
  log "No stopped containers to remove."
fi

log "─────────────────────────────────────"
log "Disk usage after cleanup:"
df -h / | tail -1
log ""
log "Remaining Docker images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
