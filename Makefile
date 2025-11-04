# Oqool Monorepo Makefile
# Alternative to Taskfile for systems without Task installed

.PHONY: help install dev build test clean docker

help: ## Show this help
	@echo "Oqool Monorepo - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	npm install
	npm run install:all

# Development
dev: ## Start all packages in dev mode
	npm run dev

dev-cli: ## Start CLI in dev mode
	npm run dev:cli

dev-desktop: ## Start Desktop in dev mode
	npm run dev:desktop

dev-cloud: ## Start Cloud Editor in dev mode
	npm run dev:cloud

# Build
build: ## Build all packages
	npm run build

build-cli: ## Build CLI package
	npm run build:cli

build-desktop: ## Build Desktop package
	npm run build:desktop

build-cloud: ## Build Cloud Editor package
	npm run build:cloud

# Testing
test: ## Run all tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

# Code Quality
lint: ## Lint all packages
	npm run lint

format: ## Format code
	npm run format

typecheck: ## Type check all packages
	npm run type-check

# Docker
docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

# PM2
pm2-start: ## Start with PM2
	npm run pm2:start

pm2-stop: ## Stop PM2 processes
	npm run pm2:stop

pm2-logs: ## View PM2 logs
	npm run pm2:logs

# Analysis
analyze: ## Analyze bundle sizes
	npm run analyze

check-size: ## Check bundle size limits
	npm run check:size

# Cleanup
clean: ## Clean build artifacts
	npm run clean
	rm -rf bundle-analysis logs

clean-deep: ## Deep clean including node_modules
	$(MAKE) clean
	rm -rf node_modules packages/*/node_modules

# CI/CD
ci: install lint typecheck test build ## Run full CI pipeline

release: clean ci ## Prepare for release
	@echo "✅ Ready for release!"
