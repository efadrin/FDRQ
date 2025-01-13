#!/bin/bash

# Navigate to your project directory
cd /home/azureuser/fdrq

# Pull the latest changes from GitHub
git pull origin main  # or master, depending on your branch name

# Rebuild and restart containers
docker-compose down
docker-compose pull  # pulls latest versions of images if using remote images
docker-compose up -d --build

# Optional: Clean up unused images
docker image prune -f