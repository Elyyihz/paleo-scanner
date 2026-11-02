"""Use case to retrieve dinosaur details by slug."""

from typing import Optional
from app.core.domain.entities.dinosaur import Dinosaur
from app.core.domain.gateways.dinosaur_repository_gateway import IDinosaurRepositoryGateway


class GetDinosaurUseCase:
    """Use case to fetch a single dinosaur profile."""

    def __init__(self, dinosaur_repo: IDinosaurRepositoryGateway):
        """Initialize use case with repository gateway."""
        self._dinosaur_repo = dinosaur_repo

    def execute(self, slug: str) -> Optional[Dinosaur]:
        """Fetch dinosaur by slug.

        Args:
            slug: Normalized identifier (e.g. 'triceratops').

        Returns:
            Dinosaur entity if present, None otherwise.
        """
        if not slug or not slug.strip():
            raise ValueError("Slug não pode ser vazio.")
        return self._dinosaur_repo.find_by_slug(slug.strip().lower())
