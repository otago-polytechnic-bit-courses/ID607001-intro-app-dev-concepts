#!/usr/bin/env bash
# =============================================================================
# setup.sh - First-time setup for ID607001
#
# Run this once when you clone the repo or start a new week's branch.
# It handles Docker, environment variables, dependencies, and migrations.
#
# Usage: ./setup.sh [backend|frontend|all]
#        Default is "all" if no argument is given.
# =============================================================================

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

# ── Helpers ───────────────────────────────────────────────────────────────────
step()  { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }
ok()    { echo -e "  ${GREEN}✔ $1${NC}"; }
warn()  { echo -e "  ${YELLOW}⚠ $1${NC}"; }
fail()  { echo -e "  ${RED}✘ $1${NC}"; exit 1; }
info()  { echo -e "  ${NC}  $1"; }

TARGET="${1:-all}"

echo -e "\n${BOLD}ID607001 - Project Setup${NC}"
echo "Target: ${TARGET}"

# =============================================================================
# 1. Check required tools are installed
# =============================================================================
step "Checking required tools"

check_tool() {
  if command -v "$1" &>/dev/null; then
    ok "$1 found ($(command -v "$1"))"
  else
    fail "$1 is not installed. Please install it before continuing."
  fi
}

check_tool node
check_tool npm
check_tool docker

# Node version check - require 18+
NODE_MAJOR=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  fail "Node.js 18 or higher is required. You have $(node --version)."
fi
ok "Node.js version OK ($(node --version))"

# =============================================================================
# 2. Docker - start the development database if needed
# =============================================================================
if [ "$TARGET" = "backend" ] || [ "$TARGET" = "all" ]; then
  step "Setting up development database"

  # Check Docker daemon is running
  if ! docker info &>/dev/null; then
    warn "Docker daemon is not running. Attempting to start Docker Desktop..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
      open -a Docker
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      sudo systemctl start docker 2>/dev/null || true
    fi
    echo "  Waiting for Docker to start..."
    for i in {1..15}; do
      if docker info &>/dev/null; then break; fi
      sleep 2
      echo "    still waiting... ($((i*2))s)"
    done
    if ! docker info &>/dev/null; then
      fail "Docker did not start in time. Please open Docker Desktop manually and run this script again."
    fi
    ok "Docker is now running"
  else
    ok "Docker is running"
  fi

  DB_CONTAINER="id607001-db-dev"

  # Check if container already exists
  if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' "$DB_CONTAINER")
    if [ "$CONTAINER_STATUS" = "running" ]; then
      ok "Database container already running"
    else
      info "Container exists but is stopped - starting it..."
      docker start "$DB_CONTAINER" &>/dev/null
      ok "Database container started"
    fi
  else
    info "Creating database container..."
    docker run \
      --name "$DB_CONTAINER" \
      -e POSTGRES_PASSWORD=HelloWorld123 \
      -p 5432:5432 \
      -d postgres &>/dev/null
    ok "Database container created and started"
  fi

  # Wait for Postgres to accept connections
  info "Waiting for PostgreSQL to be ready..."
  for i in {1..20}; do
    if docker exec "$DB_CONTAINER" pg_isready -U postgres &>/dev/null; then
      ok "PostgreSQL is ready"
      break
    fi
    if [ "$i" -eq 20 ]; then
      fail "PostgreSQL did not become ready in time."
    fi
    sleep 1
  done
fi

# =============================================================================
# 3. Backend setup
# =============================================================================
if [ "$TARGET" = "backend" ] || [ "$TARGET" = "all" ]; then
  step "Setting up backend"

  if [ ! -d "backend" ]; then
    warn "No backend/ directory found - skipping backend setup."
  else
    cd backend

    # .env
    if [ ! -f ".env" ]; then
      if [ -f ".env.example" ]; then
        cp .env.example .env
        ok "Copied .env.example → .env"
      else
        warn ".env.example not found. You will need to create .env manually."
      fi
    else
      ok ".env already exists"
    fi

    # Dependencies
    info "Installing dependencies..."
    npm install --silent
    ok "npm install complete"

    # Prisma - only if schema exists
    if [ -f "prisma/schema.prisma" ]; then
      info "Generating Prisma client..."
      npx prisma generate --silent 2>/dev/null
      ok "Prisma client generated"

      info "Running migrations..."
      npx prisma migrate deploy 2>/dev/null && ok "Migrations applied" \
        || warn "Migration deploy failed - try 'npm run prisma:migrate' manually if this is a dev environment."
    else
      warn "No prisma/schema.prisma found - skipping Prisma setup."
    fi

    cd ..
  fi
fi

# =============================================================================
# 4. Frontend setup
# =============================================================================
if [ "$TARGET" = "frontend" ] || [ "$TARGET" = "all" ]; then
  step "Setting up frontend"

  if [ ! -d "frontend" ]; then
    warn "No frontend/ directory found - skipping frontend setup."
  else
    cd frontend

    # .env
    if [ ! -f ".env" ]; then
      if [ -f ".env.example" ]; then
        cp .env.example .env
        ok "Copied .env.example → .env"
      else
        warn ".env.example not found. You may need to create .env manually."
      fi
    else
      ok ".env already exists"
    fi

    # Dependencies
    info "Installing dependencies..."
    npm install --silent
    ok "npm install complete"

    cd ..
  fi
fi

# =============================================================================
# 5. Done
# =============================================================================
echo -e "\n${GREEN}${BOLD}✔ Setup complete!${NC}"
echo ""
echo "  Start the backend:   cd backend && npm run dev"
echo "  Start the frontend:  cd frontend && npm run dev"
echo ""
echo "  If you run into problems, try:  ./check.sh"
echo ""
