"""Pydantic v2 schemas / DTOs for the API presentation layer."""

from typing import List, Optional
from pydantic import BaseModel, Field


class PaleoPinesProfileDTO(BaseModel):
    biome: str
    diet: str
    social: str
    poppin_favorite: str
    wild_skill: str
    farm_skill: str
    size_category: str
    is_rideable: bool
    pen_area_m2: int
    friendcall: str


class RealFossilProfileDTO(BaseModel):
    scientific_name: str
    taxonomy_family: str
    geological_period: str
    approximate_mya: str
    length_meters: float
    mass_kg: float
    real_diet: str
    fossil_locations: List[str]
    distinctive_features: str


class ComparisonReportDTO(BaseModel):
    fidelity_percentage: float = Field(..., ge=0.0, le=100.0)
    verdict: str
    diet_match: bool
    size_comparison_summary: str
    key_insights: List[str]


class DinosaurDTO(BaseModel):
    slug: str
    common_name: str
    game_profile: PaleoPinesProfileDTO
    fossil_profile: Optional[RealFossilProfileDTO] = None
    portrait_url: str


class PredictionCandidateDTO(BaseModel):
    species_slug: str
    probability: float


class PredictionDTO(BaseModel):
    predicted_slug: str
    confidence: float
    top_candidates: List[PredictionCandidateDTO]


class ScanResponseDTO(BaseModel):
    prediction: PredictionDTO
    dinosaur: Optional[DinosaurDTO] = None
    comparison_report: Optional[ComparisonReportDTO] = None
