# ==============================================================================
# Paleo-Scanner Backend Dockerfile (FastAPI + Clean Architecture + tf_keras CNN)
# ==============================================================================
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    TF_USE_LEGACY_KERAS=1 \
    PYTHONPATH=/app/backend:/app

# Install OS libraries required for Pillow, libgl, and HTTP healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY backend/app/ ./app

# Copy trained machine learning models and class indices
COPY ml/models/ /app/ml/models/

# Expose FastAPI REST service port
EXPOSE 8000

ENV PORT=8000

# Health check probe
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/v1/health || exit 1

# Start Uvicorn ASGI server respecting dynamic $PORT from cloud providers
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
