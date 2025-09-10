#!/bin/bash

echo "🚀 Setup ambiente di sviluppo RPG_1..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check prerequisites
print_status "Verifica prerequisiti..."

command -v node >/dev/null 2>&1 || { print_error "Node.js non trovato. Installa Node.js 18+"; exit 1; }
command -v docker >/dev/null 2>&1 || { print_error "Docker non trovato. Installa Docker"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { print_error "Docker Compose non trovato. Installa Docker Compose"; exit 1; }

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    print_error "Node.js versione 18+ richiesta. Versione attuale: $(node --version)"
    exit 1
fi

print_success "Prerequisiti verificati"

# Copy environment files
print_status "Configurazione file environment..."

if [ ! -f .env ]; then
    cp .env.example .env
    print_success "File .env creato da template"
else
    print_warning "File .env già esistente"
fi

if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    print_success "File server/.env creato da template"
else
    print_warning "File server/.env già esistente"
fi

# Create logs directory
mkdir -p server/logs
print_success "Directory logs creata"

# Start database services
print_status "Avvio servizi database..."
docker-compose up -d postgres redis

# Wait for services to be ready
print_status "Attendo che i servizi siano pronti..."
sleep 15

# Check if services are running
if ! docker-compose ps | grep -q "postgres.*Up"; then
    print_error "PostgreSQL non è avviato correttamente"
    exit 1
fi

if ! docker-compose ps | grep -q "redis.*Up"; then
    print_error "Redis non è avviato correttamente"
    exit 1
fi

print_success "Servizi database avviati"

# Install root dependencies
if [ -f "package.json" ]; then
    print_status "Installazione dipendenze root..."
    npm install
    print_success "Dipendenze root installate"
fi

# Setup client
if [ -d "client" ]; then
    print_status "Setup client React..."
    cd client
    
    if [ ! -f "package.json" ]; then
        print_error "File package.json del client non trovato"
        cd ..
        exit 1
    fi
    
    npm install
    print_success "Dipendenze client installate"
    cd ..
fi

# Setup server
if [ -d "server" ]; then
    print_status "Setup server Node.js..."
    cd server
    
    if [ ! -f "package.json" ]; then
        print_error "File package.json del server non trovato"
        cd ..
        exit 1
    fi
    
    # Install dependencies (already done)
    print_status "Generazione client Prisma..."
    npx prisma generate
    
    print_status "Applicazione schema database..."
    npx prisma db push
    
    # Optional: Seed database
    if [ -f "src/utils/seed.ts" ]; then
        print_status "Popolamento database con dati di test..."
        npm run db:seed
    fi
    
    print_success "Server setup completato"
    cd ..
fi

# Create development scripts
print_status "Creazione script di sviluppo..."

cat > start-dev.sh << 'EOF'
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
EOF

chmod +x start-dev.sh

cat > stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Arresto ambiente di sviluppo..."

# Stop all Docker services
docker-compose down

echo "✅ Servizi arrestati"
EOF

chmod +x stop-dev.sh

print_success "Script di sviluppo creati"

# Final status
print_success "🎉 Setup completato!"
echo ""
echo -e "${GREEN}=== COMANDI UTILI ===${NC}"
echo -e "  🚀 Avvia sviluppo:     ${BLUE}./start-dev.sh${NC}"
echo -e "  🛑 Ferma sviluppo:     ${BLUE}./stop-dev.sh${NC}"
echo -e "  📊 Stato servizi:      ${BLUE}docker-compose ps${NC}"
echo -e "  📝 Log servizi:        ${BLUE}docker-compose logs -f${NC}"
echo ""
echo -e "${GREEN}=== URL LOCALI ===${NC}"
echo -e "  🖥️  Frontend:          ${BLUE}http://localhost:3000${NC}"
echo -e "  🔧 Backend API:        ${BLUE}http://localhost:5000/api${NC}"
echo -e "  ❤️  Health Check:      ${BLUE}http://localhost:5000/api/health${NC}"
echo -e "  🗄️  Database:          ${BLUE}postgresql://rpg_user:rpg_password@localhost:5432/rpg_db${NC}"
echo -e "  📦 Redis:              ${BLUE}redis://localhost:6379${NC}"
echo ""
echo -e "${YELLOW}⚠️  Ricorda di configurare le variabili d'ambiente nei file .env prima della produzione!${NC}"
