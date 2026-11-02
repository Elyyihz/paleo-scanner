"""Domain entity representing the output of a vision classifier."""

from dataclasses import dataclass
from typing import List, Tuple


@dataclass(frozen=True)
class PredictionResult:
    """Inference output produced by a vision classifier.

    Attributes:
        predicted_slug: Normalized identifier of the top predicted species.
        confidence: Probability score between 0.0 and 1.0.
        top_candidates: List of (species_slug, probability) pairs for top predictions.
    """

    predicted_slug: str
    confidence: float
    top_candidates: List[Tuple[str, float]]
