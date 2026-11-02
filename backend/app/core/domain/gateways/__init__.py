"""Domain gateways export."""

from app.core.domain.gateways.vision_classifier_gateway import IVisionClassifierGateway
from app.core.domain.gateways.dinosaur_repository_gateway import IDinosaurRepositoryGateway

__all__ = [
    "IVisionClassifierGateway",
    "IDinosaurRepositoryGateway",
]
