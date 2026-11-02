"""Use case to orchestrate the scanning and comparison workflow."""

from dataclasses import dataclass
from typing import Optional
from app.core.domain.entities.dinosaur import Dinosaur
from app.core.domain.entities.prediction_result import PredictionResult
from app.core.domain.entities.comparison_report import ComparisonReport
from app.core.domain.gateways.vision_classifier_gateway import IVisionClassifierGateway
from app.core.domain.gateways.dinosaur_repository_gateway import IDinosaurRepositoryGateway


@dataclass(frozen=True)
class ScanOutput:
    """Output DTO returned by the ScanDinosaurUseCase."""

    prediction: PredictionResult
    dinosaur: Optional[Dinosaur]
    comparison_report: Optional[ComparisonReport]


class ScanDinosaurUseCase:
    """Orchestrates image inference, database lookup, and comparative analysis."""

    def __init__(
        self,
        vision_gateway: IVisionClassifierGateway,
        dinosaur_repo: IDinosaurRepositoryGateway,
    ):
        """Initialize use case with injected gateways.

        Args:
            vision_gateway: Interface to the computer vision model.
            dinosaur_repo: Interface to the dinosaur repository.
        """
        self._vision_gateway = vision_gateway
        self._dinosaur_repo = dinosaur_repo

    def execute(self, image_bytes: bytes) -> ScanOutput:
        """Execute scan workflow.

        Args:
            image_bytes: Raw image file bytes.

        Returns:
            ScanOutput with prediction, matched dinosaur, and comparison report.

        Raises:
            ValueError: If image_bytes is empty.
        """
        if not image_bytes:
            raise ValueError("Bytes da imagem não podem ser vazios.")

        # 1. Classify species via vision gateway
        prediction = self._vision_gateway.classify_image(image_bytes)

        # 2. Retrieve dinosaur data from repository
        dinosaur = self._dinosaur_repo.find_by_slug(prediction.predicted_slug)

        # 3. Generate comparison report if species is recognized
        comparison_report = None
        if dinosaur:
            comparison_report = dinosaur.generate_comparison_report()

        return ScanOutput(
            prediction=prediction,
            dinosaur=dinosaur,
            comparison_report=comparison_report,
        )
