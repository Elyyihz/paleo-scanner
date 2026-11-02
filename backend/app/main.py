"""FastAPI main application entrypoint."""

import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.infrastructure.database.seeder import seed_database_if_empty
from app.infrastructure.database.session import SessionLocal, init_db
from app.presentation.api.v1.api_router import api_router

logger = logging.getLogger("paleo_scanner")
logging.basicConfig(level=logging.INFO)

STATIC_DIR = Path(__file__).resolve().parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler initializing relational database and seed data."""
    logger.info("Initializing Paleo-Scanner relational database...")
    init_db()
    db = SessionLocal()
    try:
        count = seed_database_if_empty(db)
        logger.info("Paleo-Scanner relational catalog ready with %d species.", count)
    finally:
        db.close()
    yield
    logger.info("Shutting down Paleo-Scanner API.")


app = FastAPI(
    title="🦖 Paleo-Scanner API",
    description="Motor comparativo e classificador de visão computacional para dinossauros de Paleo Pines e fósseis reais.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS setup for Angular frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoCacheStaticFiles(StaticFiles):
    """Static file handler adding no-cache headers to ensure immediate local update reflection."""
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-cache, must-revalidate"
        return response


# Mount static assets directory with no-cache headers
if STATIC_DIR.exists():
    app.mount("/static", NoCacheStaticFiles(directory=STATIC_DIR), name="static")

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
