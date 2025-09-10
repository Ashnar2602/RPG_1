#!/bin/bash

echo "🗄️ Reset database completo..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Confirm action
read -p "⚠️  Sei sicuro di voler resettare completamente il database? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Operazione annullata"
    exit 0
fi

# Stop containers
print_status "Arresto container..."
docker-compose down

# Remove volumes
print_status "Rimozione volumi database..."
docker volume rm rpg_1_postgres_data rpg_1_redis_data 2>/dev/null || true

print_success "Volumi rimossi"

# Restart services
print_status "Riavvio servizi database..."
docker-compose up -d postgres redis

# Wait for services
print_status "Attendo che PostgreSQL sia pronto..."
sleep 15

# Verify services are running
if ! docker-compose ps | grep -q "postgres.*Up"; then
    print_error "PostgreSQL non è avviato correttamente"
    exit 1
fi

if ! docker-compose ps | grep -q "redis.*Up"; then
    print_error "Redis non è avviato correttamente"
    exit 1
fi

print_success "Servizi database riavviati"

# Re-run database setup
if [ -d "server" ] && [ -f "server/package.json" ]; then
    print_status "Rigenerazione database schema..."
    cd server
    
    # Generate Prisma client
    npx prisma generate
    
    # Push schema to database
    npx prisma db push
    
    # Optional: Seed database
    if [ -f "src/utils/seed.ts" ]; then
        print_status "Popolamento database con dati iniziali..."
        npm run db:seed 2>/dev/null || print_warning "Seed script non disponibile o fallito"
    fi
    
    cd ..
    print_success "Database setup completato"
fi

print_success "🎉 Database reset completato!"
echo ""
echo -e "${GREEN}=== STATO SERVIZI ===${NC}"
docker-compose ps
echo ""
echo -e "${BLUE}Il database è ora pulito e pronto per l'uso.${NC}"
