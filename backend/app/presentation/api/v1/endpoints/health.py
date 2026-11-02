"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["Monitoring"])
def health_check():
    """Verify backend availability and status."""
    return {
        "status": "healthy",
        "service": "paleo-scanner-api",
        "version": "1.0.0",
    }
