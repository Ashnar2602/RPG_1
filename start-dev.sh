#!/bin/bash
echo "🚀 Avvio ambiente di sviluppo..."

# Start database services
docker-compose up -d postgres redis

# Wait a bit for services
sleep 5

# Start server and client concurrently
if command -v concurrently >/dev/null 2>&1; then
    concurrently \
        --names "SERVER,CLIENT" \
        --prefix-colors "blue,green" \
        "cd server && npm run dev" \
        "cd client && npm run dev"
else
    echo "⚠️  Concurrently non installato. Avvia manualmente:"
    echo "   Terminal 1: cd server && npm run dev"
    echo "   Terminal 2: cd client && npm run dev"
fi
