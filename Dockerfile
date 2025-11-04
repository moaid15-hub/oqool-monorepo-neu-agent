# Multi-stage Dockerfile for Oqool Monorepo
FROM node:20-alpine AS base

# تثبيت pnpm
RUN npm install -g pnpm turbo

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY turbo.json ./

# ====================================
# Stage 1: Dependencies
# ====================================
FROM base AS deps

COPY packages/cli/package*.json ./packages/cli/
COPY packages/desktop/package*.json ./packages/desktop/
COPY packages/cloud-editor/package*.json ./packages/cloud-editor/

RUN pnpm install --frozen-lockfile

# ====================================
# Stage 2: Builder
# ====================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build all packages
RUN turbo run build

# Remove dev dependencies
RUN pnpm prune --prod

# ====================================
# Stage 3: CLI Runner
# ====================================
FROM node:20-alpine AS cli

WORKDIR /app

COPY --from=builder /app/packages/cli/dist ./dist
COPY --from=builder /app/packages/cli/package.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]

# ====================================
# Stage 4: Cloud Editor Runner
# ====================================
FROM node:20-alpine AS cloud

WORKDIR /app

COPY --from=builder /app/packages/cloud-editor/dist ./dist
COPY --from=builder /app/packages/cloud-editor/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/server.js"]
