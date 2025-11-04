# Justfile for Oqool Monorepo
# Usage: just <command>

# Default recipe to display help information
default:
    @just --list

# Install all dependencies
install:
    @echo "📦 Installing dependencies..."
    npm install
    @echo "✅ Dependencies installed"

# Build all packages
build:
    @echo "🔨 Building all packages..."
    npm run build
    @echo "✅ Build complete"

# Build specific package
build-package package:
    @echo "🔨 Building {{package}}..."
    cd packages/{{package}} && npm run build
    @echo "✅ {{package}} built"

# Run development mode
dev:
    @echo "🚀 Starting development mode..."
    npm run dev

# Run tests
test:
    @echo "🧪 Running tests..."
    npm test

# Run tests in watch mode
test-watch:
    @echo "🧪 Running tests in watch mode..."
    npm test -- --watch

# Lint code
lint:
    @echo "🔍 Running linter..."
    npm run lint

# Fix linting issues
lint-fix:
    @echo "🔧 Fixing linting issues..."
    npm run lint:fix

# Format code
format:
    @echo "💅 Formatting code..."
    npm run format

# Clean build artifacts
clean:
    @echo "🧹 Cleaning build artifacts..."
    rm -rf node_modules packages/*/node_modules packages/*/dist
    @echo "✅ Clean complete"

# Start PM2 services
pm2-start:
    @echo "🚀 Starting PM2 services..."
    pm2 start ecosystem.config.js
    pm2 status

# Stop PM2 services
pm2-stop:
    @echo "⏸️  Stopping PM2 services..."
    pm2 stop all

# Restart PM2 services
pm2-restart:
    @echo "🔄 Restarting PM2 services..."
    pm2 restart all

# Show PM2 logs
pm2-logs:
    pm2 logs

# Docker build
docker-build:
    @echo "🐳 Building Docker images..."
    docker-compose build

# Docker up
docker-up:
    @echo "🐳 Starting Docker containers..."
    docker-compose up -d

# Docker down
docker-down:
    @echo "🐳 Stopping Docker containers..."
    docker-compose down

# Show project info
info:
    @echo "📦 Oqool Monorepo"
    @echo "  - @oqool/shared (Core systems)"
    @echo "  - @oqool/cli (Command-line tool)"
    @echo "  - oqool-desktop (Desktop IDE)"
    @echo "  - @oqoolai/cloud-editor (Cloud Editor)"
    @echo ""
    @echo "Node: $(node --version)"
    @echo "npm: $(npm --version)"
    @echo "Git branch: $(git branch --show-current)"

# Check everything
check: build test lint
    @echo "✅ All checks passed!"
