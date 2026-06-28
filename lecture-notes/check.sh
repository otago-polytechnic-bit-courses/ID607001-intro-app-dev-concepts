#!/usr/bin/env bash
# =============================================================================
# check.sh - Environment health check for ID607001
#
# Run this after 'git pull' or whenever something isn't working.
# It diagnoses common problems and tells you exactly what to do to fix them.
#
# Usage: ./check.sh
# =============================================================================

set -uo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

ISSUES=0

step()  { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }
ok()    { echo -e "  ${GREEN}✔ $1${NC}"; }
warn()  { echo -e "  ${YELLOW}⚠ $1${NC}"; ISSUES=$((ISSUES + 1)); }
fail()  { echo -e "  ${RED}✘ $1${NC}"; ISSUES=$((ISSUES + 1)); }
fix()   { echo -e "    ${YELLOW}→ Fix: $1${NC}"; }
info()  { echo -e "    $1"; }

echo -e "\n${BOLD}ID607001 - Environment Check${NC}"

# =============================================================================
# 1. Tools
# =============================================================================
step "Tools"

command -v node &>/dev/null && ok "node $(node --version)" || { fail "node not found"; fix "Install Node.js 18+ from https://nodejs.org"; }
command -v npm  &>/dev/null && ok "npm $(npm --version)"   || { fail "npm not found";  fix "npm comes with Node.js - reinstall Node"; }
command -v docker &>/dev/null && ok "docker found"         || { fail "docker not found"; fix "Install Docker Desktop from https://docker.com"; }

# =============================================================================
# 2. Docker and database
# =============================================================================
step "Docker and database"

if ! docker info &>/dev/null; then
  fail "Docker daemon is not running"
  fix "Open Docker Desktop, wait for it to start, then run ./check.sh again"
else
  ok "Docker daemon is running"

  DB_CONTAINER="id607001-db-dev"

  if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    ok "Database container '$DB_CONTAINER' is running"

    # Check Postgres actually responds
    if docker exec "$DB_CONTAINER" pg_isready -U postgres &>/dev/null; then
      ok "PostgreSQL is accepting connections"
    else
      fail "PostgreSQL container is running but not accepting connections"
      fix "Try: docker restart $DB_CONTAINER"
    fi
  elif docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    warn "Database container '$DB_CONTAINER' exists but is stopped"
    fix "Run: docker start $DB_CONTAINER"
  else
    warn "Database container '$DB_CONTAINER' does not exist"
    fix "Run: ./setup.sh backend"
  fi
fi

# =============================================================================
# 3. Backend
# =============================================================================
step "Backend"

if [ ! -d "backend" ]; then
  info "(No backend/ directory - skipping)"
else
  # .env
  if [ -f "backend/.env" ]; then
    ok ".env exists"
    # Check DATABASE_URL is set
    if grep -q "^DATABASE_URL=" backend/.env; then
      ok "DATABASE_URL is set in .env"
    else
      fail "DATABASE_URL is missing from backend/.env"
      fix "Copy backend/.env.example to backend/.env and fill in the values"
    fi
  else
    fail "backend/.env not found"
    fix "Run: cp backend/.env.example backend/.env"
  fi

  # node_modules
  if [ -d "backend/node_modules" ]; then
    ok "node_modules exists"
  else
    warn "backend/node_modules missing"
    fix "Run: cd backend && npm install"
  fi

  # Prisma schema + client
  if [ -f "backend/prisma/schema.prisma" ]; then
    ok "prisma/schema.prisma found"

    if [ -d "backend/node_modules/.prisma/client" ]; then
      ok "Prisma client is generated"
    else
      warn "Prisma client not generated"
      fix "Run: cd backend && npx prisma generate"
    fi

    # Check for pending migrations
    if [ -d "backend/prisma/migrations" ]; then
      MIGRATION_COUNT=$(find backend/prisma/migrations -name "migration.sql" | wc -l | tr -d ' ')
      ok "Found $MIGRATION_COUNT migration file(s)"

      # Try to detect unapplied migrations by running migrate status
      cd backend
      MIGRATE_STATUS=$(npx prisma migrate status 2>&1 || true)
      cd ..

      if echo "$MIGRATE_STATUS" | grep -q "Database schema is up to date"; then
        ok "Database schema is up to date"
      elif echo "$MIGRATE_STATUS" | grep -q "following migration"; then
        warn "There are unapplied migrations"
        fix "Run: cd backend && npx prisma migrate dev"
      else
        info "Could not determine migration status (database may not be running)"
      fi
    fi
  else
    info "(No Prisma schema yet - that's fine if you haven't reached Week 4)"
  fi
fi

# =============================================================================
# 4. Frontend
# =============================================================================
step "Frontend"

if [ ! -d "frontend" ]; then
  info "(No frontend/ directory - skipping)"
else
  # .env
  if [ -f "frontend/.env" ]; then
    ok ".env exists"
    if grep -q "^API_BASE_URL=" frontend/.env || grep -q "^PUBLIC_API_BASE_URL=" frontend/.env; then
      ok "API_BASE_URL is set"
    else
      warn "API_BASE_URL not found in frontend/.env"
      fix "Add API_BASE_URL=http://localhost:3000 to frontend/.env"
    fi
  else
    fail "frontend/.env not found"
    fix "Run: cp frontend/.env.example frontend/.env"
  fi

  # node_modules
  if [ -d "frontend/node_modules" ]; then
    ok "node_modules exists"
  else
    warn "frontend/node_modules missing"
    fix "Run: cd frontend && npm install"
  fi
fi

# =============================================================================
# 5. Git status
# =============================================================================
step "Git"

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
ok "Current branch: $BRANCH"

UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNCOMMITTED" -eq 0 ]; then
  ok "Working tree is clean"
else
  info "You have $UNCOMMITTED uncommitted change(s) - that's fine, just a heads up"
fi

# =============================================================================
# 6. Summary
# =============================================================================
echo ""
if [ "$ISSUES" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✔ All checks passed. You're good to go.${NC}"
  echo ""
  echo "  Start the backend:   cd backend  && npm run dev"
  echo "  Start the frontend:  cd frontend && npm run dev"
else
  echo -e "${YELLOW}${BOLD}⚠ $ISSUES issue(s) found. Follow the '→ Fix' instructions above.${NC}"
  echo ""
  echo "  If problems persist, run: ./setup.sh"
fi
echo ""
