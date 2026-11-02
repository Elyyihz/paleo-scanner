"""Domain entities export."""

from app.core.domain.entities.paleo_pines_profile import PaleoPinesProfile
from app.core.domain.entities.real_fossil_profile import RealFossilProfile
from app.core.domain.entities.prediction_result import PredictionResult
from app.core.domain.entities.comparison_report import ComparisonReport
from app.core.domain.entities.dinosaur import Dinosaur

__all__ = [
    "PaleoPinesProfile",
    "RealFossilProfile",
    "PredictionResult",
    "ComparisonReport",
    "Dinosaur",
]
