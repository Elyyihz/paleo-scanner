"""Endpoints for querying the dinosaur catalog."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.domain.entities.dinosaur import Dinosaur
from app.core.domain.gateways.dinosaur_repository_gateway import (
    IDinosaurRepositoryGateway,
)
from app.core.use_cases.get_dinosaur import GetDinosaurUseCase
from app.core.use_cases.list_dinosaurs import ListDinosaursUseCase
from app.infrastructure.database.session import get_db_session
from app.infrastructure.repositories.sql_dinosaur_repository import (
    SQLAlchemyDinosaurRepository,
)
from app.presentation.schemas.scan_dto import (
    DinosaurDTO,
    PaleoPinesProfileDTO,
    RealFossilProfileDTO,
)

router = APIRouter()


def get_repository(
    db: Session = Depends(get_db_session),
) -> IDinosaurRepositoryGateway:
    """Dependency provider returning the relational database repository."""
    return SQLAlchemyDinosaurRepository(session=db)


def to_dto(dino: Dinosaur) -> DinosaurDTO:
    """Map domain entity to presentation DTO."""
    game_dto = PaleoPinesProfileDTO(
        biome=dino.game_profile.biome.value,
        diet=dino.game_profile.diet.value,
        social=dino.game_profile.social.value,
        poppin_favorite=dino.game_profile.poppin_favorite.value,
        wild_skill=dino.game_profile.wild_skill,
        farm_skill=dino.game_profile.farm_skill,
        size_category=dino.game_profile.size_category,
        is_rideable=dino.game_profile.is_rideable,
        pen_area_m2=dino.game_profile.pen_area_m2,
        friendcall=dino.game_profile.friendcall,
    )

    fossil_dto = None
    if dino.fossil_profile:
        fossil_dto = RealFossilProfileDTO(
            scientific_name=dino.fossil_profile.scientific_name,
            taxonomy_family=dino.fossil_profile.taxonomy_family,
            geological_period=dino.fossil_profile.geological_period.value,
            approximate_mya=dino.fossil_profile.approximate_mya,
            length_meters=dino.fossil_profile.length_meters,
            mass_kg=dino.fossil_profile.mass_kg,
            real_diet=dino.fossil_profile.real_diet.value,
            fossil_locations=dino.fossil_profile.fossil_locations,
            distinctive_features=dino.fossil_profile.distinctive_features,
        )

    return DinosaurDTO(
        slug=dino.slug,
        common_name=dino.common_name,
        game_profile=game_dto,
        fossil_profile=fossil_dto,
        portrait_url=f"/static/portraits/{dino.slug}.png",
    )


@router.get("/dinosaurs", response_model=List[DinosaurDTO], tags=["Dinosaurs"])
def list_dinosaurs(
    biome: Optional[str] = Query(None, description="Filtrar por bioma (Valley, Forest, Desert)"),
    diet: Optional[str] = Query(None, description="Filtrar por dieta (Herbivore, Carnivore, Omnivore)"),
    repo: IDinosaurRepositoryGateway = Depends(get_repository),
):
    """Retrieve catalog of all dinosaur species in Paleo Pines."""
    use_case = ListDinosaursUseCase(repo)
    dinosaurs = use_case.execute(biome=biome, diet=diet)
    return [to_dto(d) for d in dinosaurs]


@router.get("/dinosaurs/{slug}", response_model=DinosaurDTO, tags=["Dinosaurs"])
def get_dinosaur(
    slug: str,
    repo: IDinosaurRepositoryGateway = Depends(get_repository),
):
    """Retrieve details and real fossil comparison profile for a specific species."""
    use_case = GetDinosaurUseCase(repo)
    try:
        dino = use_case.execute(slug)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if not dino:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dinossauro com slug '{slug}' não encontrado.",
        )
    return to_dto(dino)
