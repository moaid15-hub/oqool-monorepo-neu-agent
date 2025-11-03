.PHONY: help install build dev test clean deploy

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Show this help
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "$(GREEN)📦 Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

build: ## Build all packages
	@echo "$(GREEN)🔨 Building all packages...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Build complete$(NC)"

build-shared: ## Build shared package only
	@echo "$(GREEN)🔨 Building @oqool/shared...$(NC)"
	cd packages/shared && npm run build

build-cli: ## Build CLI package only
	@echo "$(GREEN)🔨 Building @oqool/cli...$(NC)"
	cd packages/cli && npm run build

build-desktop: ## Build desktop package only
	@echo "$(GREEN)🔨 Building desktop...$(NC)"
	cd packages/desktop && npm run build

build-cloud: ## Build cloud-editor package only
	@echo "$(GREEN)🔨 Building cloud-editor...$(NC)"
	cd packages/cloud-editor && npm run build

dev: ## Start development mode for all packages
	@echo "$(GREEN)🚀 Starting development mode...$(NC)"
	npm run dev

dev-cli: ## Start CLI in development mode
	@echo "$(GREEN)🚀 Starting CLI dev...$(NC)"
	cd packages/cli && npm run dev

dev-desktop: ## Start desktop in development mode
	@echo "$(GREEN)🚀 Starting desktop dev...$(NC)"
	cd packages/desktop && npm run dev

dev-cloud: ## Start cloud-editor in development mode
	@echo "$(GREEN)🚀 Starting cloud-editor dev...$(NC)"
	cd packages/cloud-editor && npm run dev

test: ## Run all tests
	@echo "$(GREEN)🧪 Running tests...$(NC)"
	npm test

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)🧪 Running tests in watch mode...$(NC)"
	npm test -- --watch

lint: ## Run linter
	@echo "$(GREEN)🔍 Running linter...$(NC)"
	npm run lint

lint-fix: ## Fix linting issues
	@echo "$(GREEN)🔧 Fixing linting issues...$(NC)"
	npm run lint:fix

format: ## Format code with prettier
	@echo "$(GREEN)💅 Formatting code...$(NC)"
	npm run format

clean: ## Clean all build artifacts
	@echo "$(RED)🧹 Cleaning build artifacts...$(NC)"
	rm -rf node_modules packages/*/node_modules packages/*/dist
	@echo "$(GREEN)✅ Clean complete$(NC)"

clean-dist: ## Clean dist directories only
	@echo "$(RED)🧹 Cleaning dist directories...$(NC)"
	rm -rf packages/*/dist
	@echo "$(GREEN)✅ Dist cleaned$(NC)"

deploy-cloud: ## Deploy cloud-editor
	@echo "$(GREEN)🚀 Deploying cloud-editor...$(NC)"
	cd packages/cloud-editor && npm run deploy

start-pm2: ## Start all services with PM2
	@echo "$(GREEN)🚀 Starting services with PM2...$(NC)"
	pm2 start ecosystem.config.js
	@echo "$(GREEN)✅ Services started. Use 'pm2 status' to check$(NC)"

stop-pm2: ## Stop all PM2 services
	@echo "$(YELLOW)⏸️  Stopping PM2 services...$(NC)"
	pm2 stop all
	@echo "$(GREEN)✅ Services stopped$(NC)"

restart-pm2: ## Restart all PM2 services
	@echo "$(YELLOW)🔄 Restarting PM2 services...$(NC)"
	pm2 restart all
	@echo "$(GREEN)✅ Services restarted$(NC)"

logs: ## Show PM2 logs
	@echo "$(GREEN)📋 Showing PM2 logs...$(NC)"
	pm2 logs

status: ## Show PM2 status
	@echo "$(GREEN)📊 PM2 Status:$(NC)"
	pm2 status

monitor: ## Monitor PM2 processes
	pm2 monit

check: ## Check build and test status
	@echo "$(GREEN)🔍 Checking project status...$(NC)"
	@echo "$(YELLOW)Running build...$(NC)"
	@npm run build
	@echo "$(YELLOW)Running tests...$(NC)"
	@npm test
	@echo "$(GREEN)✅ All checks passed$(NC)"

docker-build: ## Build Docker images
	@echo "$(GREEN)🐳 Building Docker images...$(NC)"
	docker-compose build

docker-up: ## Start Docker containers
	@echo "$(GREEN)🐳 Starting Docker containers...$(NC)"
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "$(RED)🐳 Stopping Docker containers...$(NC)"
	docker-compose down

docker-logs: ## Show Docker logs
	@echo "$(GREEN)📋 Docker logs:$(NC)"
	docker-compose logs -f

info: ## Show project information
	@echo "$(GREEN)📦 Oqool Monorepo$(NC)"
	@echo "$(YELLOW)Packages:$(NC)"
	@echo "  - @oqool/shared (Core systems)"
	@echo "  - @oqool/cli (Command-line tool)"
	@echo "  - oqool-desktop (Desktop IDE)"
	@echo "  - @oqoolai/cloud-editor (Cloud Editor)"
	@echo ""
	@echo "$(YELLOW)Node version:$(NC) $$(node --version)"
	@echo "$(YELLOW)npm version:$(NC) $$(npm --version)"
	@echo "$(YELLOW)Git branch:$(NC) $$(git branch --show-current)"
