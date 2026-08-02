# Multi-stage Dockerfile for Credit Card Management Backend

# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
