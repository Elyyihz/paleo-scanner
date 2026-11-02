"""Database session management and engine configuration using SQLAlchemy."""

import os
from pathlib import Path
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from app.infrastructure.database.models import Base

DATABASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = DATABASE_DIR / "paleo_scanner.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def init_db(engine_override=None) -> None:
    """Create all relational tables if they do not already exist.

    Args:
        engine_override: Optional SQLAlchemy engine (e.g. for in-memory testing).
    """
    target_engine = engine_override or engine
    Base.metadata.create_all(bind=target_engine)


def get_db_session() -> Generator[Session, None, None]:
    """Dependency provider yielding a managed database session.

    Yields:
        Active SQLAlchemy Session instance, automatically closed upon completion.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
