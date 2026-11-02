"""Database seeder populating relational storage with in-game and scientific fossil data."""

import json
import logging
from pathlib import Path
from typing import Optional
from sqlalchemy.orm import Session
from app.infrastructure.database.curated_fossil_data import CURATED_FOSSILS
from app.infrastructure.database.models import (
    DinosaurModel,
    PaleoPinesProfileModel,
    RealFossilProfileModel,
)

logger = logging.getLogger(__name__)

SEED_FILE_PATH = Path(__file__).resolve().parent / "dinosaurs_seed.json"


def seed_database_if_empty(session: Session, seed_file: Optional[Path] = None) -> int:
    """Populate the database with the 39 dinosaur species if records are missing.

    Args:
        session: Active SQLAlchemy Session.
        seed_file: Optional path override to the dinosaurs JSON seed file.

    Returns:
        Number of dinosaur species inserted or present in the database.
    """
    existing_count = session.query(DinosaurModel).count()
    if existing_count >= 39:
        logger.info(
            "Relational database already contains %d species; skipping seed.",
            existing_count,
        )
        return existing_count

    file_to_read = seed_file or SEED_FILE_PATH
    if not file_to_read.exists():
        logger.warning(
            "Seed file not found at %s. Cannot seed database.",
            file_to_read,
        )
        return existing_count

    with open(file_to_read, "r", encoding="utf-8") as f:
        raw_seed = json.load(f)

    logger.info(
        "Seeding %d dinosaur species with complete paleontological profiles...",
        len(raw_seed),
    )

    seeded_count = 0
    for item in raw_seed:
        slug = item["slug"]

        existing_dino = session.query(DinosaurModel).filter_by(slug=slug).first()
        if existing_dino:
            continue

        dino_model = DinosaurModel(
            slug=slug,
            common_name=item.get("common_name", slug.title()),
        )
        session.add(dino_model)
        session.flush()

        game_profile = PaleoPinesProfileModel(
            dinosaur_id=dino_model.id,
            biome=item.get("biome", "Valley"),
            diet=item.get("diet", "Herbivore"),
            social=item.get("social", "Pack"),
            poppin_favorite=item.get("poppin_favorite", "Crunchy"),
            wild_skill=item.get("wild_skill", "None"),
            farm_skill=item.get("farm_skill", "None"),
            size_category=item.get("size", "Medium"),
            is_rideable=bool(item.get("ridable", False)),
            pen_area_m2=int(item.get("pen_m2", 25)),
            friendcall=item.get("friendcall", ""),
            description=item.get("description", ""),
            wiki_link=item.get("wiki_link"),
            paleo_gg_link=item.get("paleo_gg_link"),
            speed_trot=item.get("speed_trot"),
            speed_sprint=item.get("speed_sprint"),
        )
        session.add(game_profile)

        fossil_data = CURATED_FOSSILS.get(slug)
        if fossil_data:
            fossil_profile = RealFossilProfileModel(
                dinosaur_id=dino_model.id,
                scientific_name=fossil_data.scientific_name,
                taxonomy_family=fossil_data.taxonomy_family,
                geological_period=fossil_data.geological_period.value,
                approximate_mya=fossil_data.approximate_mya,
                length_meters=fossil_data.length_meters,
                mass_kg=fossil_data.mass_kg,
                real_diet=fossil_data.real_diet.value,
                fossil_locations=fossil_data.fossil_locations,
                distinctive_features=fossil_data.distinctive_features,
            )
            session.add(fossil_profile)

        seeded_count += 1

    session.commit()
    logger.info(
        "Successfully seeded %d new dinosaurs into the relational database.",
        seeded_count,
    )
    return session.query(DinosaurModel).count()
