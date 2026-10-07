#!/usr/bin/env sh
# Runs after normalize-database-url.js has fixed DATABASE_URL / HTTP env vars.
set -eu

pnpm dlx prisma@6.5.0 db push --accept-data-loss --schema ./libraries/nestjs-libraries/src/database/prisma/schema.prisma

exec node --experimental-require-module ./apps/backend/dist/apps/backend/src/main.js
