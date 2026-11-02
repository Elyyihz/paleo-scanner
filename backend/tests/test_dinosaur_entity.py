"""Unit tests for Dinosaur domain entity and fidelity score calculation."""

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


def test_dinosaur_fidelity_score_high_match():
    game = PaleoPinesProfile(
        biome=BiomeType.VALLEY,
        diet=DietType.HERBIVORE,
        social=SocialType.HERD,
        poppin_favorite=PoppinFlavor.SWEET,
        wild_skill="Sprinter",
        farm_skill="Waterer",
        size_category="Large",
        is_rideable=True,
        pen_area_m2=50,
        friendcall="ABC",
    )
    fossil = RealFossilProfile(
        scientific_name="Parasaurolophus walkeri",
        taxonomy_family="Hadrosauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="76 - 73 Ma",
        length_meters=9.5,
        mass_kg=2500.0,
        real_diet=DietType.HERBIVORE,
        fossil_locations=["Dinosaur Park"],
        distinctive_features="Crista oca",
    )
    dino = Dinosaur(slug="parasaurolophus", common_name="Parasaurolophus", game_profile=game, fossil_profile=fossil)

    score = dino.calculate_fidelity_score()
    assert 75.0 <= score <= 100.0
    report = dino.generate_comparison_report()
    assert report.diet_match is True
    assert "Alta Fidelidade" in report.verdict or "Boa Precisão" in report.verdict


def test_dinosaur_diet_mismatch():
    game = PaleoPinesProfile(
        biome=BiomeType.DESERT,
        diet=DietType.HERBIVORE,
        social=SocialType.LONER,
        poppin_favorite=PoppinFlavor.SPICY,
        wild_skill="Sprinter",
        farm_skill="None",
        size_category="Large",
        is_rideable=True,
        pen_area_m2=25,
        friendcall="XYZ",
    )
    fossil = RealFossilProfile(
        scientific_name="Carnotaurus sastrei",
        taxonomy_family="Abelisauridae",
        geological_period=GeologicalPeriod.CRETACEOUS_LATE,
        approximate_mya="71 - 69 Ma",
        length_meters=8.0,
        mass_kg=1800.0,
        real_diet=DietType.CARNIVORE,
        fossil_locations=["La Colonia"],
        distinctive_features="Chifres frontais",
    )
    dino = Dinosaur(slug="carnotaurus", common_name="Carnotaurus", game_profile=game, fossil_profile=fossil)

    report = dino.generate_comparison_report()
    assert report.diet_match is False
