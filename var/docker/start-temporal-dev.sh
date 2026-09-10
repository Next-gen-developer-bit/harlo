#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PORT="${TEMPORAL_PORT:-7233}"
UI_PORT="${TEMPORAL_UI_PORT:-8233}"
DB_FILE="${TEMPORAL_DB_FILE:-$ROOT/.tmp/temporal-cli/temporal.db}"
CLI="$ROOT/.tmp/temporal-cli/temporal"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Temporal is already listening on localhost:$PORT"
  echo "Web UI: http://localhost:$UI_PORT"
  exit 0
fi

if [[ -x "$CLI" ]]; then
  mkdir -p "$(dirname "$DB_FILE")"
  echo "Starting local Temporal dev server on :$PORT (UI :$UI_PORT)"
  exec "$CLI" server start-dev \
    --db-filename "$DB_FILE" \
    --port "$PORT" \
    --ui-port "$UI_PORT" \
    --search-attribute organizationId=Keyword \
    --search-attribute postId=Keyword
fi

if command -v temporal >/dev/null 2>&1; then
  mkdir -p "$(dirname "$DB_FILE")"
  echo "Starting local Temporal dev server on :$PORT (UI :$UI_PORT)"
  exec temporal server start-dev \
    --db-filename "$DB_FILE" \
    --port "$PORT" \
    --ui-port "$UI_PORT" \
    --search-attribute organizationId=Keyword \
    --search-attribute postId=Keyword
fi

echo "Temporal CLI not found."
echo "For local dev, install the CLI: https://docs.temporal.io/cli"
echo "For production Docker Temporal: pnpm run temporal:up"
echo "  (requires Docker: docker compose -f docker-compose.temporal.yaml up -d)"
exit 1
