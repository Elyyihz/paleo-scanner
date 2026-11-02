"""Domain entity representing a dinosaur's traits in the Paleo Pines game."""

from dataclasses import dataclass
from app.core.domain.enums import BiomeType, DietType, PoppinFlavor, SocialType


@dataclass(frozen=True)
class PaleoPinesProfile:
    """Attributes and mechanics of a dinosaur inside Paleo Pines.

    Attributes:
        biome: Primary preferred in-game biome.
        diet: Game-defined diet.
        social: Social behavior requirement (Loner, Pack, Herd).
        poppin_favorite: Preferred flavor of Poppin treat.
        wild_skill: Locomotion or tracking skill in the wild.
        farm_skill: Farming ability (Waterer, Stomper, Clearer, etc.).
        size_category: Size category (Small, Medium, Large, Huge).
        is_rideable: Whether the dinosaur can be mounted with a saddle.
        pen_area_m2: Minimum enclosure area in square meters.
        friendcall: Melodic notes played on the flute to befriend the species.
    """

    biome: BiomeType
    diet: DietType
    social: SocialType
    poppin_favorite: PoppinFlavor
    wild_skill: str
    farm_skill: str
    size_category: str
    is_rideable: bool
    pen_area_m2: int
    friendcall: str
