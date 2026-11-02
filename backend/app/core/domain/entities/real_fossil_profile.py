"""Domain entity representing real-world paleontological fossil evidence."""

from dataclasses import dataclass
from typing import List
from app.core.domain.enums import DietType, GeologicalPeriod


@dataclass(frozen=True)
class RealFossilProfile:
    """Scientific attributes verified through fossil discoveries.

    Attributes:
        scientific_name: Formal binomial Latin nomenclature.
        taxonomy_family: Clade or family (e.g. Hadrosauridae, Ceratopsidae).
        geological_period: Period when the species lived.
        approximate_mya: Approximate era in millions of years ago (e.g. '76 - 73 Ma').
        length_meters: Estimated adult body length in meters.
        mass_kg: Estimated adult body mass in kilograms.
        real_diet: Fossil-evidenced diet deduced from dentition and coprolites.
        fossil_locations: Geological formations or modern countries where fossils were found.
        distinctive_features: Key anatomical features (crest, thagomizer, armor).
    """

    scientific_name: str
    taxonomy_family: str
    geological_period: GeologicalPeriod
    approximate_mya: str
    length_meters: float
    mass_kg: float
    real_diet: DietType
    fossil_locations: List[str]
    distinctive_features: str
