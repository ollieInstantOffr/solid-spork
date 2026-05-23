# Stage 1: Dependencies
# python3 + make + g++ needed to compile better-sqlite3 from source on Alpine
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma/ ./prisma/
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create the data directory that SQLite will write to, owned by nextjs
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Public assets
COPY --from=builder /app/public ./public

# Next.js standalone server + static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Full node_modules — needed for prisma migrate deploy at startup
# (Prisma v7 has deep deps like 'effect' that make cherry-picking fragile)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Generated Prisma client (output = "../app/generated/prisma" in schema)
COPY --from=builder --chown=nextjs:nodejs /app/app/generated ./app/generated

# Prisma schema + migrations + config for runtime migrate
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Entrypoint
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
