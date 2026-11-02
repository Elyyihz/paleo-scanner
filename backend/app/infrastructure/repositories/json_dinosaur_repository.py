"""Implementation of IDinosaurRepositoryGateway using seeded JSON storage."""

import json
from pathlib import Path
from typing import Dict, List, Optional
from app.core.domain.entities.dinosaur import Dinosaur
from app.core.domain.entities.paleo_pines_profile import PaleoPinesProfile
from app.core.domain.entities.real_fossil_profile import RealFossilProfile
from app.core.domain.enums import (
    BiomeType,
    DietType,
    GeologicalPeriod,
    PoppinFlavor,
    SocialType,
)
from app.core.domain.gateways.dinosaur_repository_gateway import IDinosaurRepositoryGateway
from app.infrastructure.database.curated_fossil_data import CURATED_FOSSILS

SEED_PATH = Path(__file__).resolve().parent.parent / "database" / "dinosaurs_seed.json"


class JSONDinosaurRepository(IDinosaurRepositoryGateway):
    """Loads and indexes dinosaur entities from the JSON seed file."""

    def __init__(self, seed_file: Path = SEED_PATH):
        self._seed_file = seed_file
        self._cache: Dict[str, Dinosaur] = {}
        self._load()

    def _load(self):
        if not self._seed_file.exists():
            return

        with open(self._seed_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        for item in raw_data:
            slug = item["slug"]

            # Map in-game enum values safely
            try:
                biome = BiomeType(item.get("biome", "Valley"))
            except ValueError:
                biome = BiomeType.VALLEY

            try:
                diet = DietType(item.get("diet", "Herbivore"))
            except ValueError:
                diet = DietType.HERBIVORE

            try:
                social = SocialType(item.get("social", "Pack"))
            except ValueError:
                social = SocialType.PACK

            try:
                poppin = PoppinFlavor(item.get("poppin_favorite", "Crunchy"))
            except ValueError:
                poppin = PoppinFlavor.CRUNCHY

            game_profile = PaleoPinesProfile(
                biome=biome,
                diet=diet,
                social=social,
                poppin_favorite=poppin,
                wild_skill=item.get("wild_skill", "None"),
                farm_skill=item.get("farm_skill", "None"),
                size_category=item.get("size", "Medium"),
                is_rideable=item.get("ridable", False),
                pen_area_m2=int(item.get("pen_m2", 25)),
                friendcall=item.get("friendcall", ""),
            )

            # Retrieve matched curated real fossil profile
            fossil_profile = CURATED_FOSSILS.get(slug)

            dinosaur = Dinosaur(
                slug=slug,
                common_name=item["common_name"],
                game_profile=game_profile,
                fossil_profile=fossil_profile,
            )
            self._cache[slug] = dinosaur

    def find_by_slug(self, slug: str) -> Optional[Dinosaur]:
        s = slug.lower().strip()
        if s in self._cache:
            return self._cache[s]
        alt_s = s.replace("-", "_") if "-" in s else s.replace("_", "-")
        if alt_s in self._cache:
            return self._cache[alt_s]
        if s in ["tyrannosaurus", "t_rex", "t-rex"]:
            return self._cache.get("tyrannosaurus_rex") or self._cache.get("tyrannosaurus")
        return None

    def list_all(
        self,
        biome: Optional[str] = None,
        diet: Optional[str] = None,
    ) -> List[Dinosaur]:
        results = list(self._cache.values())
        if biome:
            results = [d for d in results if d.game_profile.biome.value.lower() == biome.lower()]
        if diet:
            results = [d for d in results if d.game_profile.diet.value.lower() == diet.lower()]
        return sorted(results, key=lambda d: d.common_name)
