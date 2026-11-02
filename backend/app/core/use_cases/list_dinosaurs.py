"""Use case to list catalog of dinosaurs with filtering."""

from typing import List, Optional
from app.core.domain.entities.dinosaur import Dinosaur
from app.core.domain.gateways.dinosaur_repository_gateway import IDinosaurRepositoryGateway


class ListDinosaursUseCase:
    """Use case to list all available dinosaur profiles."""

    def __init__(self, dinosaur_repo: IDinosaurRepositoryGateway):
        """Initialize use case with repository gateway."""
        self._dinosaur_repo = dinosaur_repo

    def execute(
        self,
        biome: Optional[str] = None,
        diet: Optional[str] = None,
    ) -> List[Dinosaur]:
        """Fetch list of dinosaurs with optional filters.

        Args:
            biome: Optional biome name.
            diet: Optional diet name.

        Returns:
            List of Dinosaur entities.
        """
        return self._dinosaur_repo.list_all(biome=biome, diet=diet)
