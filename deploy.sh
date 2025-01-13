#!/bin/bash
set -e  # Exit on any error

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> /home/azureuser/FDRQ.log
}

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
docker tag fdrq-frontend:latest fdrq-frontend:$current_date
docker tag slate:latest fdrq-slate:$current_date
docker tag fdrq-backend:test fdrq-backend:$current_date

# Stop and remove existing containers
log "Stopping existing containers..."
docker compose -f docker-compose-prod.yml down

# Start new containers
log "Starting new containers..."
docker compose -f docker-compose-prod.yml up -d

# Verify services
log "Verifying services..."
sleep 30  # Wait for services to start

# Health check function
check_service() {
    local service=$1
    local port=$2
    if curl -sf http://localhost:$port > /dev/null; then
        log "$service is running"
        return 0
    else
        log "$service failed to start"
        return 1
    fi
}

# Check each service
check_service "frontend" 80
check_service "backend" 8089
check_service "slate" 4567

# Clean up old images
log "Cleaning up old images..."
docker image prune -f

log "Deployment completed successfully"