# Multi-stage Dockerfile for HDDP Website & API
# Stage 1: Build Angular Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Copy and install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./

# Copy compiled frontend static build
COPY --from=frontend-builder /app/frontend/dist/hddp-frontend/browser /app/frontend/dist/hddp-frontend/browser

EXPOSE 4000
CMD ["node", "server.js"]
