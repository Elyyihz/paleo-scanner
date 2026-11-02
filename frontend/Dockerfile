# ==============================================================================
# Paleo-Scanner Frontend Dockerfile (Angular 22 Standalone + Tailwind + Nginx)
# ==============================================================================

# Stage 1: Build Angular SPA
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source code and compile production artifacts
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve production bundle with optimized Nginx
FROM nginx:alpine

# Copy built browser bundle from build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration with reverse proxy for API and assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web application port
EXPOSE 4200

# Health check probe
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4200/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
