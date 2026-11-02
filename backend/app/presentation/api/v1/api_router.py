"""Central API v1 router definition."""

from fastapi import APIRouter
from app.presentation.api.v1.endpoints import health, dinosaurs, scan

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(dinosaurs.router)
api_router.include_router(scan.router)
