#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  Sheraliat AI – Post-Deploy Cleanup Script
#  Removes dangling/unused Docker images and
#  build cache to reclaim disk space.
#
#  Usage:
#    ./cleanup.sh           # normal cleanup (keeps current image)
#    ./cleanup.sh --all     # aggressive: removes ALL unused images
#                           # (use when disk is critically full before a build)
# ─────────────────────────────────────────────

AGGRESSIVE=false
for arg in "$@"; do
  case $arg in
    --all) AGGRESSIVE=true ;;
  esac
done

log()  { echo "[$(date '+%H:%M:%S')] $*"; }

log "Disk usage before cleanup:"
df -h / | tail -1

log "─────────────────────────────────────"

if [ "$AGGRESSIVE" = true ]; then
  log "AGGRESSIVE mode: removing all unused Docker images, containers, networks and build cache."
  log "Note: next build will be slower (no cached layers)."
  docker system prune -a -f
else
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

  # Remove stopped containers
  STOPPED=$(docker ps -a -f "status=exited" -q)
  if [ -n "$STOPPED" ]; then
    log "Removing stopped containers..."
    docker rm $STOPPED
  else
    log "No stopped containers to remove."
  fi
fi

log "─────────────────────────────────────"
log "Disk usage after cleanup:"
df -h / | tail -1
log ""
log "Remaining Docker images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
