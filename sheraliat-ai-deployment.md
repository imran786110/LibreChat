## 1. Pull the latest code

```bash
cd /path/to/LibreChat
git pull origin main
```

## 2. Check the `.env` file

The `docker-compose.yml` pins the pre-built release image `registry.librechat.ai/librechat-ai/librechat:v0.8.8`, so you don't need to build anything locally. To upgrade later, change that tag.

Since v0.8.8 the stack includes an `admin-panel` service. Set `ADMIN_PANEL_SESSION_SECRET` in `.env` (for example `openssl rand -hex 32`), or the panel won't start.

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
