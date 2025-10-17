#!/bin/bash

# Script de setup do projeto NSR
echo "🚀 Iniciando setup do projeto NSR..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Execute este script da raiz do projeto NSR"
    exit 1
fi

# 1. Frontend Setup
echo -e "${BLUE}📦 Configurando Frontend...${NC}"
cd frontend

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚙️  Criando arquivo .env.local${NC}"
    cp .env.example .env.local
fi

echo -e "${BLUE}📥 Instalando dependências do frontend...${NC}"
npm install

echo -e "${GREEN}✅ Frontend configurado!${NC}"
echo ""

cd ..

# 2. Verificar Docker
echo -e "${BLUE}🐳 Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não encontrado. Instale o Docker para usar containers.${NC}"
else
    echo -e "${GREEN}✅ Docker encontrado!${NC}"
    
    # Perguntar se quer buildar os containers
    read -p "Deseja buildar os containers Docker agora? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🔨 Buildando containers...${NC}"
        docker-compose build
        echo -e "${GREEN}✅ Containers buildados!${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Setup concluído!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "  Opção 1 - Executar localmente:"
echo "    cd frontend"
echo "    npm run dev"
echo "    Acesse: http://localhost:3000"
echo ""
echo "  Opção 2 - Executar com Docker:"
echo "    docker-compose up"
echo "    Acesse: http://localhost:3000"
echo ""
echo -e "${YELLOW}📖 Consulte o README.md para mais informações${NC}"
