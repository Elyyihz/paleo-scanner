"""Domain Aggregate Root for a Dinosaur combining game and real fossil data."""

from dataclasses import dataclass
from typing import Optional
from app.core.domain.entities.paleo_pines_profile import PaleoPinesProfile
from app.core.domain.entities.real_fossil_profile import RealFossilProfile
from app.core.domain.entities.comparison_report import ComparisonReport


@dataclass(frozen=True)
class Dinosaur:
    """Aggregate Root representing a dinosaur species in Paleo-Scanner.

    Attributes:
        slug: Unique lowercase identifier (e.g. 'parasaurolophus').
        common_name: Popular display name (e.g. 'Parasaurolophus').
        game_profile: In-game characteristics and mechanics.
        fossil_profile: Real paleontological fossil record evidence.
    """

    slug: str
    common_name: str
    game_profile: PaleoPinesProfile
    fossil_profile: Optional[RealFossilProfile] = None

    def calculate_fidelity_score(self) -> float:
        """Calculate weighted scientific fidelity percentage (0.0 to 100.0).

        Returns:
            Float representing the percentage of scientific fidelity.
        """
        if not self.fossil_profile:
            return 70.0  # Baseline for species pending full fossil curation

        score = 0.0

        # 1. Diet Compatibility (30 points)
        if self.game_profile.diet == self.fossil_profile.real_diet:
            score += 30.0
        elif (
            self.game_profile.diet.value in ["Herbivore", "Omnivore"]
            and self.fossil_profile.real_diet.value in ["Herbivore", "Omnivore"]
        ):
            score += 18.0
        else:
            score += 5.0

        # 2. Scale & Mass Proportionality (25 points)
        length = self.fossil_profile.length_meters
        size_cat = self.game_profile.size_category.lower()

        if length <= 3.0 and "small" in size_cat:
            score += 25.0
        elif 3.0 < length <= 7.0 and "medium" in size_cat:
            score += 25.0
        elif 7.0 < length <= 10.0 and "large" in size_cat:
            score += 25.0
        elif length > 10.0 and ("large" in size_cat or "huge" in size_cat):
            score += 25.0
        else:
            score += 15.0  # Minor scale stylisation

        # 3. Biome & Habitat Plausibility (25 points)
        period = self.fossil_profile.geological_period.value
        biome = self.game_profile.biome.value

        # Late Cretaceous species in Valley/Forest have strong fossil flora correlation
        if "Cretaceous" in period and biome in ["Valley", "Forest"]:
            score += 25.0
        elif "Jurassic" in period and biome in ["Forest", "Valley"]:
            score += 22.0
        else:
            score += 18.0

        # 4. Gregarious / Social Behavior (20 points)
        social = self.game_profile.social.value
        if social in ["Pack", "Herd"]:
            score += 20.0  # Most known dinosaurs display bonebed gregarious evidence
        else:
            score += 16.0

        return round(min(score, 100.0), 1)

    def generate_comparison_report(self) -> ComparisonReport:
        """Generate side-by-side scientific comparison report.

        Returns:
            ComparisonReport detailing fidelity score, verdict, and insights.
        """
        fidelity = self.calculate_fidelity_score()

        if fidelity >= 85.0:
            verdict = "Alta Fidelidade Científica"
        elif fidelity >= 75.0:
            verdict = "Boa Precisão com Adaptações Lúdicas"
        else:
            verdict = "Adaptação Estilizada para Gameplay"

        diet_match = bool(
            self.fossil_profile
            and self.game_profile.diet == self.fossil_profile.real_diet
        )

        size_summary = (
            f"No jogo, é classificado como porte {self.game_profile.size_category}. "
            f"Fósseis indicam aproximadamente {self.fossil_profile.length_meters}m de comprimento "
            f"e {self.fossil_profile.mass_kg:,.0f} kg de massa corporal."
            if self.fossil_profile
            else f"Porte no jogo: {self.game_profile.size_category}."
        )

        insights = [
            f"Dieta in-game: {self.game_profile.diet.value} (Poppin favorito: {self.game_profile.poppin_favorite.value}).",
            (
                f"Dieta real: {self.fossil_profile.real_diet.value} durante o período {self.fossil_profile.geological_period.value}."
                if self.fossil_profile
                else "Dieta fóssil sob curadoria."
            ),
            (
                f"Características anatômicas reais: {self.fossil_profile.distinctive_features}"
                if self.fossil_profile
                else "Anatomia fóssil em mapeamento."
            ),
        ]

        return ComparisonReport(
            fidelity_percentage=fidelity,
            verdict=verdict,
            diet_match=diet_match,
            size_comparison_summary=size_summary,
            key_insights=insights,
        )
