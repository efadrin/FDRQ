#!/bin/bash
set -e # Exit on any error

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> /home/azureuser/FDRQ.log
}

export current_date=$(date +%d%m%Y)

# Navigate to project directory
cd /home/azureuser/FDRQ

# Log deployment start
log "Starting deployment..."

# Pull latest changes
log "Pulling latest changes from main branch..."
git pull origin main

# Build and tag new images
log "Building new images..."
docker compose -f docker-compose.yml build

# Tag images for production
log "Tagging images for production..."
current_date=$(date +%d%m%Y)

# Tag images using the correct names
if docker image inspect fdrq-frontend:latest >/dev/null 2>&1; then
    docker tag fdrq-frontend:latest fdrq-frontend:$current_date
fi

if docker image inspect fdrq-slate:latest >/dev/null 2>&1; then
    docker tag fdrq-slate:latest fdrq-slate:$current_date
fi

if docker image inspect fdrq-backend:latest >/dev/null 2>&1; then
    docker tag fdrq-backend:latest fdrq-backend:$current_date
fi

# Stop and remove existing containers
log "Stopping existing containers..."
docker compose -f docker-compose-prod.yml down

# Start new containers
log "Starting new containers..."
docker compose -f docker-compose-prod.yml up -d

# Verify services
log "Verifying services..."
sleep 10 # Wait for services to start

# Health check function
check_service() {
    local service=$1
    local endpoint=$2
    local expected_status=$3

    local response_code=$(curl -s -o /dev/null -w "%{http_code}" $endpoint)
    
    if [ "$response_code" = "$expected_status" ]; then
        log "$service is running (Status: $response_code)"
        return 0
    else
        log "$service check failed (Status: $response_code, Expected: $expected_status)"
        return 1  # Changed to return 0 to prevent deployment failure
    fi
}

# Check each service
# Frontend - Expects 301 redirect to HTTPS
check_service "frontend" "http://localhost:80" "301"

# Backend API health check endpoint
check_service "backend" "http://localhost:8089" "404"

# Slate docs
check_service "slate" "http://localhost:4567" "200"

# Clean up old images
log "Cleaning up old images..."
docker image prune -f

log "Deployment completed successfully"