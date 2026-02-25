## 1. Pull the latest code

```bash
cd /path/to/LibreChat
git pull origin main
```

## 2. Build the new Docker image

```bash
docker compose build --no-cache
```

> Or if you use a pre-built image from ghcr.io, skip this step — the `docker-compose.yml` already points to `ghcr.io/danny-avila/librechat:latest`.

## 3. Pull updated images

```bash
docker compose pull
```

## 4. Restart the stack

```bash
docker compose down && docker compose up -d
```

## 5. Verify everything is running

```bash
docker compose ps
docker compose logs -f librechat
```
