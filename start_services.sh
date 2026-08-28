#!/bin/bash
# Start background database services
echo "Starting Postgres..."
podman run -d --name postgres -p 5432:5432 -v sih-2k26_postgres_data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres docker.io/library/postgres:15-alpine

echo "Starting Redis..."
podman run -d --name redis -p 6379:6379 docker.io/library/redis:7-alpine

echo "Starting Qdrant..."
podman run -d --name qdrant -p 6333:6333 -v sih-2k26_qdrant_data:/qdrant/storage docker.io/qdrant/qdrant:v1.9.0

echo "Services started."
