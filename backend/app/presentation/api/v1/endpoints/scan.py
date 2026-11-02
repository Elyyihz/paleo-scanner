"""Endpoint for scanning and classifying dinosaur screenshots."""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from app.core.use_cases.scan_dinosaur import ScanDinosaurUseCase
from app.infrastructure.ml.keras_vision_classifier import KerasVisionClassifierGateway
from app.infrastructure.repositories.json_dinosaur_repository import JSONDinosaurRepository
from app.presentation.api.v1.endpoints.dinosaurs import to_dto
from app.presentation.schemas.scan_dto import (
    ComparisonReportDTO,
    PredictionCandidateDTO,
    PredictionDTO,
    ScanResponseDTO,
)

router = APIRouter()

MAX_FILE_SIZE_MB = 10
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]


def get_scan_use_case() -> ScanDinosaurUseCase:
    """Dependency provider for ScanDinosaurUseCase."""
    vision_gw = KerasVisionClassifierGateway()
    dino_repo = JSONDinosaurRepository()
    return ScanDinosaurUseCase(vision_gateway=vision_gw, dinosaur_repo=dino_repo)


@router.post(
    "/scan",
    response_model=ScanResponseDTO,
    status_code=status.HTTP_200_OK,
    tags=["Scanner"],
)
async def scan_dinosaur(
    file: UploadFile = File(..., description="Captura de tela ou imagem do dinossauro"),
    use_case: ScanDinosaurUseCase = Depends(get_scan_use_case),
):
    """Upload a Paleo Pines screenshot to detect the species and compare with fossils.

    - Processes the image via the CNN model.
    - Matches with in-game database and fossil evidence.
    - Computes the Scientific Fidelity Score.
    """
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Tipo de arquivo não suportado: {file.content_type}. Use JPEG, PNG ou WebP.",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O arquivo enviado está vazio.",
        )

    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Arquivo excede o limite máximo de {MAX_FILE_SIZE_MB}MB.",
        )

    output = use_case.execute(content)

    # Map Prediction
    pred_dto = PredictionDTO(
        predicted_slug=output.prediction.predicted_slug,
        confidence=output.prediction.confidence,
        top_candidates=[
            PredictionCandidateDTO(species_slug=c[0], probability=c[1])
            for c in output.prediction.top_candidates
        ],
    )

    # Map Dinosaur entity if matched
    dino_dto = to_dto(output.dinosaur) if output.dinosaur else None

    # Map Comparison Report
    comp_dto = None
    if output.comparison_report:
        comp_dto = ComparisonReportDTO(
            fidelity_percentage=output.comparison_report.fidelity_percentage,
            verdict=output.comparison_report.verdict,
            diet_match=output.comparison_report.diet_match,
            size_comparison_summary=output.comparison_report.size_comparison_summary,
            key_insights=output.comparison_report.key_insights,
        )

    return ScanResponseDTO(
        prediction=pred_dto,
        dinosaur=dino_dto,
        comparison_report=comp_dto,
    )
