#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  AutoShop — startup script
#  Usage:
#    ./start.sh           start both frontend + backend
#    ./start.sh frontend  start frontend only
#    ./start.sh backend   start backend only
#    ./start.sh stop      kill both servers
# ─────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT/frontend"
BACKEND_DIR="$ROOT/backend"
LOG_DIR="$ROOT/.logs"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_LOG="$LOG_DIR/backend.log"
PID_FILE="$LOG_DIR/autoshop.pid"

FRONTEND_PORT=3000
BACKEND_PORT=3001

# ── colours ────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── helpers ─────────────────────────────────────────────────
log()  { echo -e "${CYAN}[autoshop]${RESET} $*"; }
ok()   { echo -e "${GREEN}✔${RESET}  $*"; }
warn() { echo -e "${YELLOW}⚠${RESET}  $*"; }
err()  { echo -e "${RED}✖${RESET}  $*"; }

port_free() {
  ! lsof -iTCP:"$1" -sTCP:LISTEN -t &>/dev/null
}

wait_for_port() {
  local port=$1 label=$2 timeout=20 i=0
  while ! lsof -iTCP:"$port" -sTCP:LISTEN -t &>/dev/null; do
    sleep 1
    (( i++ ))
    if (( i >= timeout )); then
      warn "$label did not start on port $port within ${timeout}s — check $LOG_DIR"
      return 1
    fi
  done
  ok "$label is up  →  http://localhost:$port"
}

stop_servers() {
  log "Stopping AutoShop servers…"
  if [[ -f "$PID_FILE" ]]; then
    while IFS= read -r pid; do
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" && ok "Stopped PID $pid"
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  else
    # Fallback: kill by port
    for port in $FRONTEND_PORT $BACKEND_PORT; do
      local pid
      pid=$(lsof -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null)
      if [[ -n "$pid" ]]; then
        kill "$pid" && ok "Stopped process on port $port (PID $pid)"
      fi
    done
  fi
  log "Done."
}

start_backend() {
  if ! port_free $BACKEND_PORT; then
    warn "Port $BACKEND_PORT already in use — skipping backend start"
    return
  fi
  log "Starting backend (port $BACKEND_PORT)…"
  mkdir -p "$LOG_DIR"
  cd "$BACKEND_DIR" || { err "backend directory not found"; return 1; }
  npm run dev >> "$BACKEND_LOG" 2>&1 &
  local pid=$!
  echo "$pid" >> "$PID_FILE"
  wait_for_port $BACKEND_PORT "Backend"
  cd "$ROOT"
}

start_frontend() {
  if ! port_free $FRONTEND_PORT; then
    warn "Port $FRONTEND_PORT already in use — skipping frontend start"
    return
  fi
  log "Starting frontend (port $FRONTEND_PORT)…"
  mkdir -p "$LOG_DIR"
  cd "$FRONTEND_DIR" || { err "frontend directory not found"; return 1; }
  npm run dev >> "$FRONTEND_LOG" 2>&1 &
  local pid=$!
  echo "$pid" >> "$PID_FILE"
  wait_for_port $FRONTEND_PORT "Frontend"
  cd "$ROOT"
}

print_summary() {
  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BOLD}  AutoShop is running${RESET}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "  Frontend   →  ${GREEN}http://localhost:$FRONTEND_PORT${RESET}"
  echo -e "  Backend    →  ${GREEN}http://localhost:$BACKEND_PORT${RESET}"
  echo -e "  API docs   →  ${CYAN}http://localhost:$BACKEND_PORT/api/products${RESET}"
  echo -e "  Logs       →  ${CYAN}$LOG_DIR/${RESET}"
  echo -e ""
  echo -e "  Stop with: ${YELLOW}./start.sh stop${RESET}  or  ${YELLOW}Ctrl+C${RESET}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
}

# ── db:check ────────────────────────────────────────────────
check_db() {
  log "Checking PostgreSQL connection…"
  # Read DATABASE_URL from backend .env
  local db_url
  db_url=$(grep -E '^DATABASE_URL' "$BACKEND_DIR/.env" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"')
  if [[ -z "$db_url" ]]; then
    # Fall back to frontend .env
    db_url=$(grep -E '^DATABASE_URL' "$FRONTEND_DIR/.env" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"')
  fi

  if [[ -z "$db_url" ]]; then
    warn "DATABASE_URL not found in .env files — skipping DB check"
    return 0
  fi

  # Extract host and port from the URL (postgresql://user:pass@host:port/db)
  local host port
  host=$(echo "$db_url" | sed -E 's|.*@([^:/]+).*|\1|')
  port=$(echo "$db_url" | sed -E 's|.*:([0-9]+)/.*|\1|')
  port="${port:-5432}"

  # Try psql ping, fall back to nc
  if command -v psql &>/dev/null; then
    if PGPASSWORD="" psql "$db_url" -c '\q' &>/dev/null 2>&1; then
      ok "PostgreSQL is reachable at $host:$port"
      return 0
    fi
  fi

  # nc fallback
  if command -v nc &>/dev/null; then
    if nc -z -w3 "$host" "$port" &>/dev/null 2>&1; then
      ok "PostgreSQL port is open at $host:$port (connection not authenticated)"
      return 0
    fi
  fi

  warn "Could not reach PostgreSQL at $host:$port — the app may fail to authenticate users"
  warn "Start PostgreSQL with: sudo service postgresql start  (or: pg_ctlcluster 14 main start)"
  return 1
}
trap 'echo ""; stop_servers; exit 0' INT TERM

# ── main ────────────────────────────────────────────────────
mkdir -p "$LOG_DIR"
# Clear PID file at start (only for fresh starts, not stop)
case "${1:-both}" in
  stop)
    stop_servers
    ;;
  frontend)
    > "$PID_FILE"
    start_frontend
    print_summary
    wait
    ;;
  backend)
    > "$PID_FILE"
    check_db
    start_backend
    print_summary
    wait
    ;;
  both|"")
    > "$PID_FILE"
    check_db
    start_backend
    start_frontend
    print_summary
    # Keep script alive so Ctrl+C works cleanly
    wait
    ;;
  *)
    err "Unknown command: $1"
    echo "Usage: $0 [both|frontend|backend|stop]"
    exit 1
    ;;
esac
