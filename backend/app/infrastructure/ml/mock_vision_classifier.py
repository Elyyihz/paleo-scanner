"""Mock implementation of IVisionClassifierGateway for testing and fallback."""

import hashlib
from typing import List, Tuple
from app.core.domain.entities.prediction_result import PredictionResult
from app.core.domain.gateways.vision_classifier_gateway import IVisionClassifierGateway

KNOWN_SPECIES: List[str] = [
    "parasaurolophus",
    "gallimimus",
    "triceratops",
    "ankylosaurus",
    "stegosaurus",
    "velociraptor",
    "deinocheirus",
    "carnotaurus",
    "therizinosaurus",
    "allosaurus",
    "tyrannosaurus",
    "psittacosaurus",
]


class MockVisionClassifierGateway(IVisionClassifierGateway):
    """Deterministic mock classifier based on byte hash or default species."""

    def __init__(self, default_species: str = "parasaurolophus"):
        self._default_species = default_species

    def classify_image(self, image_bytes: bytes) -> PredictionResult:
        if not image_bytes:
            raise ValueError("Bytes vazios não podem ser classificados.")

        # Compute deterministic index from byte hash
        digest = hashlib.md5(image_bytes).hexdigest()
        idx = int(digest, 16) % len(KNOWN_SPECIES)
        top_slug = KNOWN_SPECIES[idx]

        second_slug = KNOWN_SPECIES[(idx + 1) % len(KNOWN_SPECIES)]
        third_slug = KNOWN_SPECIES[(idx + 2) % len(KNOWN_SPECIES)]

        top_candidates: List[Tuple[str, float]] = [
            (top_slug, 0.94),
            (second_slug, 0.04),
            (third_slug, 0.02),
        ]

        return PredictionResult(
            predicted_slug=top_slug,
            confidence=0.94,
            top_candidates=top_candidates,
        )
