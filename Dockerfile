# ==============================================================================
# Paleo-Scanner Unified Production Dockerfile (Angular 22 + FastAPI + CNN Model)
# Multi-stage build designed for 1-click cloud deployment (Render, Railway, Fly.io, HF Spaces)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Angular Frontend SPA
# ------------------------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build -- --configuration production

# ------------------------------------------------------------------------------
# Stage 2: Runtime Backend & AI Inference (FastAPI + tf_keras + Angular SPA)
# ------------------------------------------------------------------------------
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    TF_USE_LEGACY_KERAS=1 \
    PYTHONPATH=/app/backend:/app \
    PORT=8000

# Install system dependencies for Pillow, GLib, and HTTP health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements (supports both x86_64 and aarch64 / ARM64)
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application source code
COPY backend/app/ ./backend/app/

# Copy machine learning models and class indices
COPY ml/models/ /app/ml/models/

# Copy compiled Angular production build from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist/frontend/browser /app/frontend_dist

# Expose default HTTP port
EXPOSE 8000

# Health check probe
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/v1/health || exit 1

# Start Uvicorn ASGI server respecting dynamic $PORT from cloud providers
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
