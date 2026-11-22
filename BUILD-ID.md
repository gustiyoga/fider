# Fider v0.40.0 + Indonesian (id) locale

Custom build of upstream Fider `v0.40.0` with one addition: the `id` locale ("Bahasa Indonesia").
Branch: `id-locale`. Database schema is identical to stock v0.40.0 (no new migrations).

## What changed vs upstream
- `locale/id/client.json`, `locale/id/server.json` (248 + 80 keys, same keys/order as `en`)
- `id` registered in `app/models/enum/locale.go`, `locale/locales.ts`, `lingui.config.js`, `public/ssr.tsx`, `Makefile` (locale-reset list)
- `scripts/check-locale-parity.js`: key/placeholder/tag parity check vs `en` (`node scripts/check-locale-parity.js id`)
- `.github/workflows/build-id-image.yml`, this file

## Build locally
    docker build -t fider-id:v0.40.0-id1 .
Uses upstream's multi-stage `Dockerfile` unchanged (needs network; the UI stage runs `npm ci`).

## Build in CI
Push a tag `v0.40.0-id1`; the workflow builds linux/amd64 and pushes `ghcr.io/gustiyoga/fider:v0.40.0-id1`
(make the GHCR package visible/pullable from the VPS, or `docker login ghcr.io` there).

## Use
Swap the compose `image:` to the custom tag, `docker compose pull && docker compose up -d`, then
Admin > Settings > set the language to "Bahasa Indonesia".
Rollback: set `image: getfider/fider:v0.40.0` and `docker compose up -d`.
