"""SQLAlchemy implementation of the IDinosaurRepositoryGateway."""

import logging
from typing import List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.domain.entities.dinosaur import Dinosaur
from app.core.domain.entities.paleo_pines_profile import PaleoPinesProfile
from app.core.domain.entities.real_fossil_profile import RealFossilProfile
from app.core.domain.enums import (
    BiomeType,
    DietType,
    GeologicalPeriod,
    PoppinFlavor,
    SocialType,
)
from app.core.domain.gateways.dinosaur_repository_gateway import (
    IDinosaurRepositoryGateway,
)
from app.infrastructure.database.models import (
    DinosaurModel,
    PaleoPinesProfileModel,
)

logger = logging.getLogger(__name__)


class SQLAlchemyDinosaurRepository(IDinosaurRepositoryGateway):
    """Accesses and manages dinosaur entities stored in the relational database."""

    def __init__(self, session: Session):
        """Initialize repository with an active SQLAlchemy session.

        Args:
            session: Managed database session.
        """
        self._session = session

    def find_by_slug(self, slug: str) -> Optional[Dinosaur]:
        """Find a dinosaur by its unique slug identifier.

        Handles common aliases such as hyphen/underscore differences and T-Rex aliases.

        Args:
            slug: Dinosaur slug (e.g. 'parasaurolophus', 'tyrannosaurus').

        Returns:
            Dinosaur domain aggregate or None if not found.
        """
        s = slug.lower().strip()
        model = self._session.query(DinosaurModel).filter_by(slug=s).first()

        if not model:
            alt_s = s.replace("-", "_") if "-" in s else s.replace("_", "-")
            model = self._session.query(DinosaurModel).filter_by(slug=alt_s).first()

        if not model and s in ["tyrannosaurus", "t_rex", "t-rex"]:
            model = (
                self._session.query(DinosaurModel)
                .filter(DinosaurModel.slug.in_(["tyrannosaurus_rex", "tyrannosaurus"]))
                .first()
            )

        if not model:
            return None

        return self._to_domain(model)

    def list_all(
        self,
        biome: Optional[str] = None,
        diet: Optional[str] = None,
    ) -> List[Dinosaur]:
        """List dinosaurs filtered by optional game biome or diet.

        Args:
            biome: Optional biome string filter (e.g. 'Valley', 'Forest', 'Desert').
            diet: Optional diet string filter (e.g. 'Herbivore', 'Carnivore').

        Returns:
            Sorted list of dinosaur domain entities.
        """
        query = self._session.query(DinosaurModel).join(DinosaurModel.game_profile)

        if biome:
            query = query.filter(
                func.lower(PaleoPinesProfileModel.biome) == biome.lower()
            )

        if diet:
            query = query.filter(
                func.lower(PaleoPinesProfileModel.diet) == diet.lower()
            )

        models = query.order_by(DinosaurModel.common_name).all()
        return [self._to_domain(m) for m in models]

    def _to_domain(self, model: DinosaurModel) -> Dinosaur:
        """Convert a database model to the pure domain aggregate root.

        Args:
            model: DinosaurModel instance.

        Returns:
            Decoupled Dinosaur domain entity.
        """
        # Map game profile
        gp = model.game_profile
        if gp:
            try:
                biome = BiomeType(gp.biome)
            except ValueError:
                biome = BiomeType.VALLEY

            try:
                diet = DietType(gp.diet)
            except ValueError:
                diet = DietType.HERBIVORE

            try:
                social = SocialType(gp.social)
            except ValueError:
                social = SocialType.PACK

            try:
                poppin = PoppinFlavor(gp.poppin_favorite)
            except ValueError:
                poppin = PoppinFlavor.CRUNCHY

            game_profile = PaleoPinesProfile(
                biome=biome,
                diet=diet,
                social=social,
                poppin_favorite=poppin,
                wild_skill=gp.wild_skill,
                farm_skill=gp.farm_skill,
                size_category=gp.size_category,
                is_rideable=gp.is_rideable,
                pen_area_m2=gp.pen_area_m2,
                friendcall=gp.friendcall,
            )
        else:
            game_profile = PaleoPinesProfile(
                biome=BiomeType.VALLEY,
                diet=DietType.HERBIVORE,
                social=SocialType.PACK,
                poppin_favorite=PoppinFlavor.CRUNCHY,
                wild_skill="None",
                farm_skill="None",
                size_category="Medium",
                is_rideable=False,
                pen_area_m2=25,
                friendcall="",
            )

        # Map fossil profile
        fossil_profile = None
        fp = model.fossil_profile
        if fp:
            try:
                geo_period = GeologicalPeriod(fp.geological_period)
            except ValueError:
                geo_period = GeologicalPeriod.UNKNOWN

            try:
                fossil_diet = DietType(fp.real_diet)
            except ValueError:
                fossil_diet = DietType.UNKNOWN

            fossil_profile = RealFossilProfile(
                scientific_name=fp.scientific_name,
                taxonomy_family=fp.taxonomy_family,
                geological_period=geo_period,
                approximate_mya=fp.approximate_mya,
                length_meters=fp.length_meters,
                mass_kg=fp.mass_kg,
                real_diet=fossil_diet,
                fossil_locations=fp.fossil_locations or [],
                distinctive_features=fp.distinctive_features,
            )

        return Dinosaur(
            slug=model.slug,
            common_name=model.common_name,
            game_profile=game_profile,
            fossil_profile=fossil_profile,
        )
