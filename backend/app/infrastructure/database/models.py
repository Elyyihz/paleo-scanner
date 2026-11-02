"""SQLAlchemy ORM models for relational persistence of dinosaurs and fossil profiles."""

from datetime import datetime, timezone
from typing import List
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class DinosaurModel(Base):
    """Relational table representing a dinosaur entity.

    Serves as the root record linking in-game attributes with real-world fossil evidence.
    """

    __tablename__ = "dinosaurs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(64), unique=True, index=True, nullable=False)
    common_name = Column(String(100), nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # 1-to-1 relationship with game characteristics
    game_profile = relationship(
        "PaleoPinesProfileModel",
        back_populates="dinosaur",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="joined",
    )

    # 1-to-1 relationship with paleontological fossil record
    fossil_profile = relationship(
        "RealFossilProfileModel",
        back_populates="dinosaur",
        uselist=False,
        cascade="all, delete-orphan",
        lazy="joined",
    )


class PaleoPinesProfileModel(Base):
    """In-game attributes and mechanics as portrayed in Paleo Pines."""

    __tablename__ = "paleo_pines_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dinosaur_id = Column(
        Integer,
        ForeignKey("dinosaurs.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    biome = Column(String(50), nullable=False)
    diet = Column(String(50), nullable=False)
    social = Column(String(50), nullable=False)
    poppin_favorite = Column(String(50), nullable=False)
    wild_skill = Column(String(50), nullable=False)
    farm_skill = Column(String(50), nullable=False)
    size_category = Column(String(50), nullable=False)
    is_rideable = Column(Boolean, default=False, nullable=False)
    pen_area_m2 = Column(Integer, default=25, nullable=False)
    friendcall = Column(String(100), default="", nullable=False)
    description = Column(Text, default="", nullable=False)
    wiki_link = Column(String(255), nullable=True)
    paleo_gg_link = Column(String(255), nullable=True)
    speed_trot = Column(Float, nullable=True)
    speed_sprint = Column(Float, nullable=True)

    dinosaur = relationship("DinosaurModel", back_populates="game_profile")


class RealFossilProfileModel(Base):
    """Real-world scientific fossil evidence compiled from paleontological excavations."""

    __tablename__ = "real_fossil_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dinosaur_id = Column(
        Integer,
        ForeignKey("dinosaurs.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    scientific_name = Column(String(100), nullable=False)
    taxonomy_family = Column(String(100), nullable=False)
    geological_period = Column(String(50), nullable=False)
    approximate_mya = Column(String(50), nullable=False)
    length_meters = Column(Float, nullable=False)
    mass_kg = Column(Float, nullable=False)
    real_diet = Column(String(50), nullable=False)
    fossil_locations = Column(JSON, nullable=False)
    distinctive_features = Column(Text, nullable=False)

    dinosaur = relationship("DinosaurModel", back_populates="fossil_profile")
