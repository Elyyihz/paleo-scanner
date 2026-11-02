"""FastAPI main application entrypoint."""

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.presentation.api.v1.api_router import api_router

STATIC_DIR = Path(__file__).resolve().parent / "static"

app = FastAPI(
    title="🦖 Paleo-Scanner API",
    description="Motor comparativo e classificador de visão computacional para dinossauros de Paleo Pines e fósseis reais.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS setup for Angular frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static portraits directory if it exists
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include v1 endpoints
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Bem-vindo à Paleo-Scanner API!",
        "documentation": "/docs",
        "health": "/api/v1/health",
        "dinosaurs": "/api/v1/dinosaurs",
        "scan": "/api/v1/scan",
    }
