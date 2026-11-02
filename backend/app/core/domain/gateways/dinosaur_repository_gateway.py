"""Gateway interface for dinosaur data persistence and retrieval."""

from abc import ABC, abstractmethod
from typing import List, Optional
from app.core.domain.entities.dinosaur import Dinosaur


class IDinosaurRepositoryGateway(ABC):
    """Abstract Port defining dinosaur repository operations."""

    @abstractmethod
    def find_by_slug(self, slug: str) -> Optional[Dinosaur]:
        """Retrieve a dinosaur entity by its normalized slug.

        Args:
            slug: Lowercase identifier (e.g. 'parasaurolophus').

        Returns:
            Dinosaur entity if found, None otherwise.
        """
        pass

    @abstractmethod
    def list_all(
        self,
        biome: Optional[str] = None,
        diet: Optional[str] = None,
    ) -> List[Dinosaur]:
        """List dinosaur species with optional filtering.

        Args:
            biome: Optional biome filter (e.g. 'Valley', 'Forest', 'Desert').
            diet: Optional diet filter (e.g. 'Herbivore', 'Carnivore').

        Returns:
            List of Dinosaur entities.
        """
        pass
