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

# Check for compiled frontend distribution (production container or local build)
FRONTEND_DIST = (
    Path("/app/frontend_dist")
    if Path("/app/frontend_dist").exists()
    else (Path(__file__).resolve().parents[2] / "frontend" / "dist" / "frontend" / "browser")
)

if FRONTEND_DIST.exists():
    from fastapi import HTTPException
    from fastapi.responses import FileResponse

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("static/") or full_path in ("docs", "redoc", "openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"error": "Frontend build not found"}
else:
    @app.get("/", tags=["Root"])
    def root():
        return {
            "message": "Bem-vindo à Paleo-Scanner API!",
            "documentation": "/docs",
            "health": "/api/v1/health",
            "dinosaurs": "/api/v1/dinosaurs",
            "scan": "/api/v1/scan",
        }
