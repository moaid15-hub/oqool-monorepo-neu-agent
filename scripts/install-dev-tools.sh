#!/bin/bash
# Oqool Dev Tools Installation Script
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🛠️  Installing Dev Tools...${NC}"

# ripgrep
echo -e "${YELLOW}➜${NC} Installing ripgrep..."
sudo apt update && sudo apt install -y ripgrep || echo "Already installed"

# fd
echo -e "${YELLOW}➜${NC} Installing fd..."
sudo apt install -y fd-find || echo "Already installed"

# jq
echo -e "${YELLOW}➜${NC} Installing jq..."
sudo apt install -y jq || echo "Already installed"

# bat
echo -e "${YELLOW}➜${NC} Installing bat..."
sudo apt install -y bat || echo "Already installed"

echo -e "${GREEN}✅ Basic tools installed!${NC}"
echo -e "${GREEN}📖 See docs/DEV_TOOLS_SETUP.md for more tools${NC}"
