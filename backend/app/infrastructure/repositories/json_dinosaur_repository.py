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

SEED_PATH = Path(__file__).resolve().parent.parent / "database" / "dinosaurs_seed.json"

# Curation map of established real-world fossil data for key species
CURATED_FOSSILS: Dict[str, RealFossilProfile] = {
    "parasaurolophus": RealFossilProfile(
        scientific_name="Parasaurolophus walkeri",
        taxonomy_family="Hadrosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="76.5 - 73 Ma",
        length_meters=9.5,
        mass_kg=2500.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Dinosaur Park Formation (Canadá)", "Kaiparowits (EUA)"],
        distinctive_features="Crista cranial oca tubular conectada ao aparelho respiratório usada para vocalização ressonante.",
    ),
    "gallimimus": RealFossilProfile(
        scientific_name="Gallimimus bullatus",
        taxonomy_family="Ornithomimidae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="70 Ma",
        length_meters=6.0,
        mass_kg=450.0,
        real_diet=DietType.OMNIVORE,
        fossil_locations=["Nemegt Formation (Deserto de Gobi, Mongólia)"],
        distinctive_features="Pernas cursoriais extremamente alongadas capazes de atingir até 55 km/h; bico córneo edêntulo.",
    ),
    "triceratops": RealFossilProfile(
        scientific_name="Triceratops horridus",
        taxonomy_family="Ceratopsidae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="68 - 66 Ma",
        length_meters=8.5,
        mass_kg=7500.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Hell Creek Formation (EUA)", "Lance Formation (EUA)"],
        distinctive_features="Folho ósseo maciço de sustentação e três chifres usados contra o predador Tyrannosaurus rex.",
    ),
    "ankylosaurus": RealFossilProfile(
        scientific_name="Ankylosaurus magniventris",
        taxonomy_family="Ankylosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="68 - 66 Ma",
        length_meters=7.5,
        mass_kg=6000.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Hell Creek Formation (EUA)", "Scollard (Canadá)"],
        distinctive_features="Dorso couraçado por osteodermas fundidas e clava caudal distal com grande poder de impacto.",
    ),
    "stegosaurus": RealFossilProfile(
        scientific_name="Stegosaurus stenops",
        taxonomy_family="Stegosauridae",
        geological_period=GeologicalPeriod.JURASSIC,
        approximate_mya="155 - 150 Ma",
        length_meters=9.0,
        mass_kg=3500.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Morrison Formation (EUA)", "Lourinhã (Portugal)"],
        distinctive_features="Placas ósseas dérmicas dorsais vascularizadas e 4 espigões caudais defensivos (thagomizer).",
    ),
    "velociraptor": RealFossilProfile(
        scientific_name="Velociraptor mongoliensis",
        taxonomy_family="Dromaeosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="75 - 71 Ma",
        length_meters=2.0,
        mass_kg=18.0,
        real_diet=DietType.CARNIVORE,
        fossil_locations=["Djadochta Formation (Mongólia)"],
        distinctive_features="Presença inequívoca de penas confirmada por papilas ulnares e garra curva retrátil em foice no segundo dedo.",
    ),
    "deinocheirus": RealFossilProfile(
        scientific_name="Deinocheirus mirificus",
        taxonomy_family="Deinocheiridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="70 Ma",
        length_meters=11.0,
        mass_kg=6400.0,
        real_diet=DietType.OMNIVORE,
        fossil_locations=["Nemegt Formation (Mongólia)"],
        distinctive_features="Braços gigantescos de 2,4m, corcunda dorsal sustentada por espinhas neurais e dieta com peixes e plantas aquáticas.",
    ),
    "carnotaurus": RealFossilProfile(
        scientific_name="Carnotaurus sastrei",
        taxonomy_family="Abelisauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="71 - 69 Ma",
        length_meters=8.0,
        mass_kg=1800.0,
        real_diet=DietType.CARNIVORE,
        fossil_locations=["La Colonia Formation (Patagônia, Argentina)"],
        distinctive_features="Chifres frontais sólidos acima das órbitas oculares, membros anteriores minúsculos e cauda rápida para sprints curtos.",
    ),
    "therizinosaurus": RealFossilProfile(
        scientific_name="Therizinosaurus cheloniformis",
        taxonomy_family="Therizinosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="70 Ma",
        length_meters=10.0,
        mass_kg=5000.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Nemegt Formation (Mongólia)"],
        distinctive_features="Garras ungueais mais longas do reino animal (até 1 metro) usadas para ceifar ramos de árvores altas.",
    ),
    "psittacosaurus": RealFossilProfile(
        scientific_name="Psittacosaurus mongoliensis",
        taxonomy_family="Psittacosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_EARLY,
        approximate_mya="126 - 101 Ma",
        length_meters=1.8,
        mass_kg=20.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Yixian Formation (China)", "Mongólia"],
        distinctive_features="Bico semelhante ao de papagaio para triturar sementes e cerdas tegumentares filamentosas na cauda.",
    ),
    "allosaurus": RealFossilProfile(
        scientific_name="Allosaurus fragilis",
        taxonomy_family="Allosauridae",
        geological_period=GeologicalPeriod.JURASSIC,
        approximate_mya="155 - 145 Ma",
        length_meters=8.5,
        mass_kg=2000.0,
        real_diet=DietType.CARNIVORE,
        fossil_locations=["Morrison Formation (EUA)", "Portugal"],
        distinctive_features="Predador de topo jurássico com cristas lacrimais baixas e mandíbula com abertura ampla em machado.",
    ),
    "tyrannosaurus": RealFossilProfile(
        scientific_name="Tyrannosaurus rex",
        taxonomy_family="Tyrannosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="68 - 66 Ma",
        length_meters=12.3,
        mass_kg=8400.0,
        real_diet=DietType.CARNIVORE,
        fossil_locations=["Hell Creek (EUA)", "Lance (EUA)", "Frenchman (Canadá)"],
        distinctive_features="Maior força de mordida entre animais terrestres (~35.000 N), visão binocular e dentes serrilhados esmagadores de ossos.",
    ),
}


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
