"""Domain enums defining Paleo Pines and paleontological categories."""

from enum import Enum


class BiomeType(str, Enum):
    """Paleo Pines game biomes."""

    VALLEY = "Valley"
    FOREST = "Forest"
    DESERT = "Desert"
    UNKNOWN = "Unknown"


class PoppinFlavor(str, Enum):
    """Flavors of Paleo Pines friendship treats (Poppins)."""

    CRUNCHY = "Crunchy"
    SWEET = "Sweet"
    JUICY = "Juicy"
    SPICY = "Spicy"
    FRAGRANT = "Fragrant"
    EARTHY = "Earthy"
    UNKNOWN = "Unknown"


class DietType(str, Enum):
    """Dietary classifications."""

    HERBIVORE = "Herbivore"
    CARNIVORE = "Carnivore"
    OMNIVORE = "Omnivore"
    PISCIVORE = "Piscivore"
    UNKNOWN = "Unknown"


class SocialType(str, Enum):
    """Social behavior in Paleo Pines."""

    LONER = "Loner"
    PACK = "Pack"
    HERD = "Herd"
    UNKNOWN = "Unknown"


class GeologicalPeriod(str, Enum):
    """Real-world geological periods."""

    TRIASSIC = "Triassic"
    JURASSIC = "Jurassic"
    CRETACEOUS_EARLY = "Early Cretaceous"
    CRETACEOUS_LATE = "Late Cretaceous"
    PERMIAN = "Permian"
    UNKNOWN = "Unknown"
