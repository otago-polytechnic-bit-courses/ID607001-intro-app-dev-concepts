#!/bin/bash

# Setup script for REST API
#
# Usage:
#   1. Make sure this script is executable:
#        chmod +x setup.sh
#   2. Run the script from the root of your repository:
#        ./setup.sh

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[1;34m'
NC='\033[0m' # No colour

DOCKER_WAIT_TIME=25
POSTGRES_WAIT_TIME=15
POSTGRES_MAX_RETRIES=30
CONTAINER_NAME="id607001-db-dev"
POSTGRES_PORT=5432
REQUIRED_NODE_VERSION=22

SKIP_DOCKER_RUN=false

cleanup() {
  if [ $? -ne 0 ]; then
    echo -e "\n${RED}Setup failed. Cleaning up...${NC}"
    if docker ps -q -f name="$CONTAINER_NAME" > /dev/null 2>&1; then
      echo -e "${YELLOW}Stopping container $CONTAINER_NAME...${NC}"
      docker stop "$CONTAINER_NAME" 2>/dev/null || true
    fi
  fi
}
trap cleanup EXIT

log_info() {
  echo -e "${GREEN}$1${NC}"
}

log_warn() {
  echo -e "${YELLOW}$1${NC}"
}

log_error() {
  echo -e "${RED}$1${NC}"
}

log_step() {
  echo -e "${GREEN}$1${NC} $2\n"
}

check_port_available() {
  local port=$1
  if command -v lsof &> /dev/null; then
    if lsof -Pi ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
      return 1
    fi
  elif command -v netstat &> /dev/null; then
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
      return 1
    fi
  elif command -v ss &> /dev/null; then
    if ss -tuln 2>/dev/null | grep -q ":$port "; then
      return 1
    fi
  fi
  return 0
}

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}       Starting setup script...           ${NC}"
echo -e "${BLUE}==========================================${NC}\n"

log_step "0." "Checking required dependencies..."
for cmd in docker node npm; do
  if ! command -v "$cmd" &> /dev/null; then
    log_error "Error: $cmd is not installed or not in PATH."
    exit 1
  fi
done
log_info "All required dependencies found.\n"

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
  log_warn "Warning: Node.js version $NODE_VERSION detected. Version $REQUIRED_NODE_VERSION or higher recommended.\n"
fi

projects=()
while IFS= read -r -d '' dir; do
  basename_dir="$(basename "$dir")"
  if [[ "$basename_dir" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    projects+=("$basename_dir")
  else
    log_warn "Skipping directory with invalid name: $basename_dir"
  fi
done < <(find . -maxdepth 1 -type d ! -name ".*" ! -name "." -print0)

if [ ${#projects[@]} -eq 0 ]; then
  log_error "No valid projects found in the current directory."
  exit 1
fi

echo "Select a project to setup:"
for i in "${!projects[@]}"; do
  printf "%3d) %s\n" $((i+1)) "${projects[$i]}"
done

echo -n "Enter number (1-${#projects[@]}): "
read -r selection

if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "${#projects[@]}" ]; then
  log_error "Invalid selection."
  exit 1
fi

selected_project="${projects[$((selection-1))]}"
echo -e "\n${GREEN}You selected:${NC} $selected_project\n"

if [ ! -f "$selected_project/package.json" ]; then
  log_error "Error: package.json not found in $selected_project"
  exit 1
fi

log_info "Verifying required npm scripts..."
required_scripts=("docker:run:dev" "env:copy" "prisma:migrate")
for script in "${required_scripts[@]}"; do
  if ! grep -q "\"$script\"" "$selected_project/package.json"; then
    log_error "Error: Required npm script '$script' not found in package.json"
    exit 1
  fi
done
log_info "All required scripts found.\n"

cd "$selected_project" || { log_error "Failed to enter directory $selected_project"; exit 1; }

if [ ! -f ".env.example" ] && [ ! -f ".env.template" ]; then
  log_warn "Warning: No .env.example or .env.template found."
  log_warn "The env:copy script might fail if it expects a template file.\n"
fi

open_docker_desktop() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    log_warn "Opening Docker Desktop on macOS..."
    open -a Docker 2>/dev/null || log_warn "Could not open Docker Desktop automatically"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    log_warn "Opening Docker Desktop on Windows..."
    if [ -f "/c/Program Files/Docker/Docker/Docker Desktop.exe" ]; then
      powershell.exe -Command "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'" 2>/dev/null || true
    else
      log_warn "Docker Desktop not found at default location. Please start it manually."
    fi
  else
    log_warn "Linux detected - attempting to start Docker daemon..."
    sudo systemctl start docker 2>/dev/null || log_warn "Could not start Docker automatically. Please start it manually."
  fi
}

log_step "1." "Checking if Docker daemon is already running..."

if docker info > /dev/null 2>&1; then
  log_info "Docker daemon is already running. Skipping Docker Desktop launch.\n"
else
  log_warn "Docker daemon is not running. Attempting to start Docker...\n"
  open_docker_desktop
  log_info "Waiting ${YELLOW}$DOCKER_WAIT_TIME seconds${NC} for Docker to start..."

  for ((i=1; i<=DOCKER_WAIT_TIME; i++)); do
    if docker info > /dev/null 2>&1; then
      log_info "Docker started successfully!\n"
      break
    fi
    sleep 1
    if [ $i -eq "$DOCKER_WAIT_TIME" ]; then
      log_error "Docker failed to start within $DOCKER_WAIT_TIME seconds."
      log_warn "Please start Docker manually and rerun the script.\n"
      exit 1
    fi
  done
fi

log_step "2." "Verifying Docker daemon is running..."
if ! docker info > /dev/null 2>&1; then
  log_error "Error: Docker does not seem to be running."
  log_warn "Please start Docker Desktop manually and rerun the script.\n"
  exit 1
fi
log_info "Docker is running.\n"

log_step "3." "Checking for existing Docker container named ${YELLOW}$CONTAINER_NAME${NC}..."
if [ "$(docker ps -a -q -f name="^${CONTAINER_NAME}$")" ]; then
  CONTAINER_RUNNING=$(docker ps -q -f name="^${CONTAINER_NAME}$")
  
  if [ -n "$CONTAINER_RUNNING" ]; then
    log_warn "Container is already running."
    echo -n "Do you want to keep it running and skip container creation? (Y/n): "
    read -r confirm
    if [[ "$confirm" =~ ^[Nn]$ ]]; then
      echo -e "${YELLOW}Stopping and removing container...${NC}\n"
      docker stop "$CONTAINER_NAME" 2>&1 || { log_error "Failed to stop container"; exit 1; }
      docker rm "$CONTAINER_NAME" 2>&1 || { log_error "Failed to remove container"; exit 1; }
      log_info "Existing container removed.\n"
    else
      log_info "Using existing running container.\n"
      SKIP_DOCKER_RUN=true
    fi
  else
    log_warn "Container exists but is stopped."
    echo -n "Do you want to remove it and create a new one? (Y/n): "
    read -r confirm
    if [[ ! "$confirm" =~ ^[Nn]$ ]]; then
      echo -e "${YELLOW}Removing stopped container...${NC}\n"
      docker rm "$CONTAINER_NAME" 2>&1 || { log_error "Failed to remove container"; exit 1; }
      log_info "Existing container removed.\n"
    else
      log_error "Cannot proceed with stopped container. Please remove it manually."
      log_warn "Run: docker rm $CONTAINER_NAME\n"
      exit 1
    fi
  fi
else
  log_info "No existing container found.\n"
fi

if [ "$SKIP_DOCKER_RUN" = false ]; then
  log_info "Checking if port $POSTGRES_PORT is available..."
  if ! check_port_available "$POSTGRES_PORT"; then
    log_error "Port $POSTGRES_PORT is already in use."
    log_warn "Please stop other services using this port or stop the conflicting container."
    log_warn "You can check what's using the port with: lsof -i :$POSTGRES_PORT\n"
    exit 1
  fi
  log_info "Port $POSTGRES_PORT is available.\n"

  log_step "4." "Starting PostgreSQL Docker container..."
  echo -e "${BLUE}Running: npm run docker:run:dev${NC}"
  if npm run docker:run:dev 2>&1 | tee /tmp/docker_run.log; then
    log_info "PostgreSQL container started successfully.\n"
  else
    log_error "Failed to start PostgreSQL Docker container."
    log_warn "Check the logs above or run: docker logs $CONTAINER_NAME\n"
    exit 1
  fi
else
  log_info "Skipping Docker container creation (using existing container).\n"
fi

log_step "5." "Waiting for PostgreSQL to initialize..."
RETRY_COUNT=0
POSTGRES_READY=false

while [ $RETRY_COUNT -lt $POSTGRES_MAX_RETRIES ]; do
  if docker exec "$CONTAINER_NAME" pg_isready -U postgres > /dev/null 2>&1; then
    log_info "PostgreSQL is ready!\n"
    POSTGRES_READY=true
    break
  fi
  sleep 1
  RETRY_COUNT=$((RETRY_COUNT + 1))
  
  if [ $((RETRY_COUNT % 5)) -eq 0 ]; then
    echo -ne "${YELLOW}Still waiting... ($RETRY_COUNT/$POSTGRES_MAX_RETRIES)${NC}\r"
  fi
done

if [ "$POSTGRES_READY" = false ]; then
  log_error "PostgreSQL did not become ready within $POSTGRES_MAX_RETRIES seconds."
  log_warn "Check container logs: docker logs $CONTAINER_NAME\n"
  exit 1
fi

log_step "6." "Copying environment variables..."
if [ -f ".env" ]; then
  log_warn ".env file already exists. Overwrite? (y/N): "
  read -r confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    log_info "Skipping env copy.\n"
  else
    if npm run env:copy 2>&1 | tee /tmp/env_copy.log; then
      log_info "Environment file updated.\n"
    else
      log_error "Failed to copy .env file."
      log_warn "Check the logs above for details.\n"
      exit 1
    fi
  fi
else
  if npm run env:copy 2>&1 | tee /tmp/env_copy.log; then
    log_info "Environment file created.\n"
  else
    log_error "Failed to copy .env file."
    log_warn "Check the logs above for details.\n"
    exit 1
  fi
fi

if [ -f ".env" ]; then
  chmod 600 .env
  log_info "Set secure permissions (600) on .env file.\n"
fi

log_step "7." "Installing Node.js dependencies..."
echo -e "${BLUE}Running: npm install${NC}"
if npm install 2>&1 | tee /tmp/npm_install.log; then
  log_info "Dependencies installed successfully.\n"
else
  log_error "npm install failed."
  log_warn "Check /tmp/npm_install.log for details.\n"
  exit 1
fi

log_step "8." "Running Prisma migrations..."
echo -e "${BLUE}Running: npm run prisma:migrate${NC}"
if npm run prisma:migrate 2>&1 | tee /tmp/prisma_migrate.log; then
  log_info "Migrations completed successfully.\n"
else
  log_error "Prisma migrations failed."
  log_warn "Check /tmp/prisma_migrate.log for details."
  log_warn "Common issues:"
  log_warn "  - Database connection problems (check .env DATABASE_URL)"
  log_warn "  - Migration conflicts (try: npm run prisma:reset)"
  log_warn "  - PostgreSQL not ready (check: docker logs $CONTAINER_NAME)\n"
  exit 1
fi

echo -e "\n${BLUE}==========================================${NC}"
echo -e "${BLUE}          Setup complete!                 ${NC}"
echo -e "${BLUE}==========================================${NC}\n"
echo -e "${GREEN}Next steps:${NC}"
echo -e "  1. Review your .env file for correct configuration"
echo -e "  2. Start the development server: ${BLUE}npm run dev${NC}\n"