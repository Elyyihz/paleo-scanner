"""Domain entity representing a comparative scientific report."""

from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class ComparisonReport:
    """Side-by-side comparative analysis between game fiction and fossil evidence.

    Attributes:
        fidelity_percentage: Overall score between 0.0 and 100.0%.
        verdict: Qualitative assessment ('Alta Precisão', 'Adaptação Lúdica', etc.).
        diet_match: Whether in-game diet matches fossil evidence.
        size_comparison_summary: Narrative contrasting game size with fossil scale.
        key_insights: Bullet points highlighting interesting scientific facts.
    """

    fidelity_percentage: float
    verdict: str
    diet_match: bool
    size_comparison_summary: str
    key_insights: List[str]
