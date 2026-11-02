"""Gateway interface for vision classification."""

from abc import ABC, abstractmethod
from app.core.domain.entities.prediction_result import PredictionResult


class IVisionClassifierGateway(ABC):
    """Abstract Port defining image classification capabilities."""

    @abstractmethod
    def classify_image(self, image_bytes: bytes) -> PredictionResult:
        """Classify species from image bytes.

        Args:
            image_bytes: Raw bytes of the uploaded image.

        Returns:
            PredictionResult with species slug, confidence, and top candidates.
        """
        pass
