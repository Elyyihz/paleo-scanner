"""Unit and integration tests for SQLAlchemy relational persistence and paleontological profiles."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.infrastructure.database.models import Base
from app.infrastructure.database.seeder import seed_database_if_empty
from app.infrastructure.repositories.sql_dinosaur_repository import (
    SQLAlchemyDinosaurRepository,
)
from app.core.domain.enums import DietType, GeologicalPeriod


@pytest.fixture
def in_memory_session():
    """Create a temporary isolated SQLite in-memory database session."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(bind=engine)
    session = session_factory()

    # Seed the database
    seed_database_if_empty(session)

    try:
        yield session
    finally:
        session.close()


def test_database_seeding_count(in_memory_session):
    """Verify that exactly 39 species are seeded with complete relationships."""
    repo = SQLAlchemyDinosaurRepository(in_memory_session)
    dinosaurs = repo.list_all()
    assert len(dinosaurs) == 39

    # Re-running seeder should be idempotent
    count = seed_database_if_empty(in_memory_session)
    assert count == 39


def test_all_39_species_have_rich_fossil_profiles(in_memory_session):
    """Verify 100% fossil record coverage: every single species must have real scientific data."""
    repo = SQLAlchemyDinosaurRepository(in_memory_session)
    dinosaurs = repo.list_all()

    for dino in dinosaurs:
        fossil = dino.fossil_profile
        assert (
            fossil is not None
        ), f"Dinosaur {dino.slug} is missing its real fossil profile!"
        assert len(fossil.scientific_name) > 3
        assert len(fossil.taxonomy_family) > 3
        assert fossil.geological_period != GeologicalPeriod.UNKNOWN
        assert fossil.length_meters > 0.0
        assert fossil.mass_kg > 0.0
        assert fossil.real_diet != DietType.UNKNOWN
        assert len(fossil.fossil_locations) >= 1
        assert len(fossil.distinctive_features) > 10


def test_find_by_slug_and_aliases(in_memory_session):
    """Test retrieving dinosaurs by primary slug and normalized alias variations."""
    repo = SQLAlchemyDinosaurRepository(in_memory_session)

    # Direct slug
    para = repo.find_by_slug("parasaurolophus")
    assert para is not None
    assert para.common_name == "Parasaurolophus"
    assert "Hadrosauridae" in para.fossil_profile.taxonomy_family

    # Tyrannosaurus alias handling
    trex = repo.find_by_slug("tyrannosaurus")
    assert trex is not None
    assert trex.fossil_profile.scientific_name == "Tyrannosaurus rex"

    trex_dash = repo.find_by_slug("t-rex")
    assert trex_dash is not None

    # Lucky companion
    lucky = repo.find_by_slug("lucky")
    assert lucky is not None
    assert "Parasaurolophus" in lucky.fossil_profile.scientific_name

    # Non-existent slug
    unknown = repo.find_by_slug("godzillasaurus_rex")
    assert unknown is None


def test_list_all_filtering(in_memory_session):
    """Test filtering catalog by in-game biomes and diets."""
    repo = SQLAlchemyDinosaurRepository(in_memory_session)

    # Filter by biome
    valleys = repo.list_all(biome="Valley")
    assert len(valleys) > 0
    assert all(d.game_profile.biome.value == "Valley" for d in valleys)

    deserts = repo.list_all(biome="Desert")
    assert len(deserts) > 0
    assert all(d.game_profile.biome.value == "Desert" for d in deserts)

    # Filter by diet
    carnivores = repo.list_all(diet="Carnivore")
    assert len(carnivores) > 0
    assert all(d.game_profile.diet.value == "Carnivore" for d in carnivores)


def test_scientific_fidelity_score_calculation(in_memory_session):
    """Verify fidelity score calculation produces high fidelity for anatomically sound profiles."""
    repo = SQLAlchemyDinosaurRepository(in_memory_session)

    stego = repo.find_by_slug("stegosaurus")
    assert stego is not None
    score = stego.calculate_fidelity_score()
    assert 70.0 <= score <= 100.0

    report = stego.generate_comparison_report()
    assert "Fidelidade" in report.verdict or "Precisão" in report.verdict
    assert report.diet_match is True
    assert len(report.key_insights) >= 3
