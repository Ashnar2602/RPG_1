#!/bin/bash
echo "🛑 Arresto ambiente di sviluppo..."

# Stop all Docker services
docker-compose down

echo "✅ Servizi arrestati"
