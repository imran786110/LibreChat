#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  Sheraliat AI – Docker Cleanup Script
#  Removes dangling/unused Docker images, stopped
#  containers and build cache to reclaim disk space.
#  Never touches volumes or bind-mounted data.
#
#  Usage:
#    ./cleanup.sh           # normal cleanup (keeps images used by containers + current tag,
#                           # trims build cache to BUILD_CACHE_KEEP_GB)
#    ./cleanup.sh --all     # aggressive: removes ALL images not used by a container
#                           # and all build cache (use when disk is critically full)
#
#  Called automatically by deploy.sh before the build (if space is low),
#  after a successful deploy, and after a failed one.
# ─────────────────────────────────────────────

CURRENT_TAG="sheraliat-branding"
# Build cache kept for fast rebuilds; override with BUILD_CACHE_KEEP_GB=N ./cleanup.sh
BUILD_CACHE_KEEP_GB="${BUILD_CACHE_KEEP_GB:-6}"

AGGRESSIVE=false
for arg in "$@"; do
  case $arg in
    --all) AGGRESSIVE=true ;;
  esac
done

log() { echo "[$(date '+%H:%M:%S')] $*"; }

DOCKER_ROOT="$(docker info -f '{{.DockerRootDir}}' 2>/dev/null || echo /)"

log "Disk usage before cleanup ($DOCKER_ROOT):"
df -h "$DOCKER_ROOT" | tail -1

log "─────────────────────────────────────"

# Stopped containers pin their images, so remove them first
log "Removing stopped containers..."
docker container prune -f >/dev/null

if [ "$AGGRESSIVE" = true ]; then
  log "AGGRESSIVE mode: removing all images not used by a container."
  docker image prune -a -f
else
  # Untagged images: the previous build after the tag moved to the new one,
  # and older copies of :latest images after a pull
  log "Removing dangling images..."
  docker image prune -f

  # Old librechat tags other than the current one
  OLD_IMAGES=$(docker images librechat --format '{{.ID}} {{.Tag}}' \
    | awk -v keep="$CURRENT_TAG" '$2 != keep && $2 != "<none>" {print $1}' \
    | sort -u)
  if [ -n "$OLD_IMAGES" ]; then
    log "Removing old librechat images (non-current tags)..."
    # shellcheck disable=SC2086
    docker rmi $OLD_IMAGES 2>/dev/null || true
  fi
fi

# Build cache makes the next build fast (npm downloads, installed
# dependencies, unchanged package builds). Normal mode trims it to a budget,
# dropping least-recently-used entries first; --all wipes it.
if [ "$AGGRESSIVE" = true ]; then
  log "Removing all Docker build cache (next build starts from scratch)..."
  docker builder prune -a -f
else
  # Docker 28 renamed --keep-storage to --reserved-space
  KEEP_FLAG="--keep-storage"
  if docker builder prune --help 2>/dev/null | grep -q -- '--reserved-space'; then
    KEEP_FLAG="--reserved-space"
  fi
  log "Trimming Docker build cache to ${BUILD_CACHE_KEEP_GB}GB..."
  docker builder prune -a -f "$KEEP_FLAG" "${BUILD_CACHE_KEEP_GB}GB"
fi

log "─────────────────────────────────────"
log "Disk usage after cleanup ($DOCKER_ROOT):"
df -h "$DOCKER_ROOT" | tail -1
log ""
log "Remaining Docker images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
