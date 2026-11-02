/**
 * In-game behavioral and habitat profile from Paleo Pines.
 */
export interface PaleoPinesProfile {
  biome: string;
  diet: string;
  social: string;
  poppin_favorite: string;
  wild_skill: string;
  farm_skill: string;
  size_category: string;
  is_rideable: boolean;
  pen_area_m2: number;
  friendcall: string;
}

/**
 * Paleontological fossil data profile grounded in scientific taxonomy.
 */
export interface RealFossilProfile {
  scientific_name: string;
  taxonomy_family: string;
  geological_period: string;
  approximate_mya: string;
  length_meters: number;
  mass_kg: number;
  real_diet: string;
  fossil_locations: string[];
  distinctive_features: string;
  fossil_image_url?: string;
  paleoart_image_url?: string;
}

/**
 * Automated comparative analysis contrasting in-game traits with paleontological facts.
 */
export interface ComparisonReport {
  fidelity_percentage: number;
  verdict: string;
  diet_match: boolean;
  size_comparison_summary: string;
  key_insights: string[];
}

/**
 * Dinosaur entity representing both game representation and scientific counterpart.
 */
export interface Dinosaur {
  slug: string;
  common_name: string;
  game_profile: PaleoPinesProfile;
  fossil_profile: RealFossilProfile | null;
  portrait_url: string;
}

/**
 * Confidence candidate emitted by the MobileNetV3 visual classifier.
 */
export interface PredictionCandidate {
  species_slug: string;
  probability: number;
}

/**
 * Aggregated inference outcome from visual classification.
 */
export interface Prediction {
  predicted_slug: string;
  confidence: number;
  top_candidates: PredictionCandidate[];
}

/**
 * Complete API payload returned upon submitting a dinosaur screenshot.
 */
export interface ScanResponse {
  prediction: Prediction;
  dinosaur: Dinosaur | null;
  comparison_report: ComparisonReport | null;
}

/**
 * Backend health check status payload.
 */
export interface HealthStatus {
  status: string;
  service: string;
  version: string;
}
