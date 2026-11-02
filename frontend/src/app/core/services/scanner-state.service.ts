import { computed, inject, Injectable, signal } from '@angular/core';
import { DinosaurApiService } from './dinosaur-api.service';
import { Dinosaur, ScanResponse } from '../models/dinosaur.model';

/**
 * Central reactive state store managing species catalog, visual scanning, and filters.
 */
@Injectable({
  providedIn: 'root'
})
export class ScannerStateService {
  private readonly apiService = inject(DinosaurApiService);
  private healthIntervalId: number | null = null;

  // --- Global App State ---
  public readonly activeTab = signal<'scanner' | 'catalog'>('scanner');
  public readonly isBackendOnline = signal<boolean | null>(null);

  // --- Catalog State ---
  public readonly dinosaurs = signal<Dinosaur[]>([]);
  public readonly isLoadingCatalog = signal<boolean>(false);
  public readonly catalogError = signal<string | null>(null);
  public readonly searchQuery = signal<string>('');
  public readonly selectedBiome = signal<string>('all');
  public readonly selectedDiet = signal<string>('all');
  public readonly selectedDinosaur = signal<Dinosaur | null>(null);

  // --- Scanner State ---
  public readonly selectedFile = signal<File | null>(null);
  public readonly previewUrl = signal<string | null>(null);
  public readonly isScanning = signal<boolean>(false);
  public readonly scanError = signal<string | null>(null);
  public readonly scanResult = signal<ScanResponse | null>(null);

  // --- Computed Projections ---
  public readonly totalSpeciesCount = computed(() => this.dinosaurs().length);

  public readonly filteredDinosaurs = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const biome = this.selectedBiome();
    const diet = this.selectedDiet();

    return this.dinosaurs().filter(dino => {
      // Name and scientific name query match
      const nameMatch =
        query === '' ||
        dino.common_name.toLowerCase().includes(query) ||
        dino.slug.toLowerCase().includes(query) ||
        (dino.fossil_profile?.scientific_name.toLowerCase().includes(query) ?? false);

      // Biome match
      const biomeMatch =
        biome === 'all' ||
        dino.game_profile.biome.toLowerCase() === biome.toLowerCase();

      // Diet match
      const dietMatch =
        diet === 'all' ||
        dino.game_profile.diet.toLowerCase() === diet.toLowerCase();

      return nameMatch && biomeMatch && dietMatch;
    });
  });

  public readonly hasScanResult = computed(() => this.scanResult() !== null);

  /**
   * Initializes application state and initiates initial catalog download.
   */
  constructor() {
    this.verifyBackendHealth();
    this.fetchCatalog();
    this.initHealthPolling();
  }

  /**
   * Periodically verifies backend health if it is initially unreachable.
   */
  private initHealthPolling(): void {
    if (typeof window !== 'undefined') {
      this.healthIntervalId = window.setInterval(() => {
        // Poll regularly if offline or not yet connected
        if (this.isBackendOnline() !== true) {
          this.verifyBackendHealth();
        }
      }, 4000);
    }
  }

  /**
   * Pings backend API to monitor connectivity status.
   */
  public verifyBackendHealth(): void {
    this.apiService.checkHealth().subscribe({
      next: () => {
        const wasOffline = this.isBackendOnline() === false;
        this.isBackendOnline.set(true);
        // If it was offline and catalog is empty, auto-fetch catalog now
        if (wasOffline && this.dinosaurs().length === 0) {
          this.fetchCatalog();
        }
      },
      error: () => this.isBackendOnline.set(false)
    });
  }

  /**
   * Switches the active navigation view between Scanner and Catalog.
   *
   * @param tab - Target view identifier.
   */
  public setTab(tab: 'scanner' | 'catalog'): void {
    this.activeTab.set(tab);
  }

  /**
   * Fetches the entire dinosaur dataset from the API.
   */
  public fetchCatalog(): void {
    this.isLoadingCatalog.set(true);
    this.catalogError.set(null);

    this.apiService.listDinosaurs().subscribe({
      next: data => {
        this.dinosaurs.set(data);
        this.isLoadingCatalog.set(false);
      },
      error: () => {
        this.catalogError.set('Falha ao carregar o catálogo de dinossauros do servidor.');
        this.isLoadingCatalog.set(false);
      }
    });
  }

  /**
   * Prepares a selected file for scanning and generates an object URL for preview.
   *
   * @param file - Image binary selected by the user.
   */
  public selectFile(file: File): void {
    // Revoke previous preview URL to avoid browser memory leaks
    const currentUrl = this.previewUrl();
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    this.selectedFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
    this.scanError.set(null);
  }

  /**
   * Alias for selectFile.
   */
  public setFile(file: File): void {
    this.selectFile(file);
  }

  /**
   * Clears the current scanning selection and resets the scan outcome.
   */
  public clearScan(): void {
    const currentUrl = this.previewUrl();
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.scanResult.set(null);
    this.scanError.set(null);
  }

  /**
   * Sends the loaded image file to the ML classification pipeline.
   */
  public executeScan(): void {
    const file = this.selectedFile();
    if (!file) {
      this.scanError.set('Nenhuma imagem selecionada para digitalização.');
      return;
    }

    this.isScanning.set(true);
    this.scanError.set(null);

    this.apiService.scanDinosaur(file).subscribe({
      next: result => {
        this.scanResult.set(result);
        this.isScanning.set(false);
      },
      error: err => {
        const message =
          err?.error?.detail ||
          'Erro durante a digitalização do dinossauro. Verifique se o backend está ativo.';
        this.scanError.set(message);
        this.isScanning.set(false);
      }
    });
  }

  /**
   * Opens the full inspection modal for a specific dinosaur.
   *
   * @param dino - The dinosaur entity to inspect.
   */
  public openDinosaurModal(dino: Dinosaur): void {
    this.selectedDinosaur.set(dino);
  }

  /**
   * Closes the active dinosaur detail modal.
   */
  public closeDinosaurModal(): void {
    this.selectedDinosaur.set(null);
  }

  /**
   * Helper to resolve portrait images.
   *
   * @param path - Relative portrait path.
   * @returns Complete portrait URL.
   */
  public getPortraitUrl(path: string): string {
    return this.apiService.getPortraitUrl(path);
  }

  /**
   * Helper to resolve real fossil specimen photograph URL.
   *
   * @param dinoOrSlug - Dinosaur entity or slug identifier.
   * @returns Full fossil image URL.
   */
  public getFossilUrl(dinoOrSlug: Dinosaur | string): string {
    const slug = typeof dinoOrSlug === 'string' ? dinoOrSlug : dinoOrSlug.slug;
    return this.apiService.getStaticImageUrl(`/static/fossils/${slug}.jpg`);
  }

  /**
   * Helper to resolve paleoart life reconstruction illustration URL.
   *
   * @param dinoOrSlug - Dinosaur entity or slug identifier.
   * @returns Full paleoart illustration URL.
   */
  public getPaleoartUrl(dinoOrSlug: Dinosaur | string): string {
    const slug = typeof dinoOrSlug === 'string' ? dinoOrSlug : dinoOrSlug.slug;
    return this.apiService.getStaticImageUrl(`/static/paleoart/${slug}.jpg`);
  }

  /**
   * Instantly loads a sample dinosaur demonstration scan from the curated catalog.
   *
   * @param slug - Dinosaur slug to demonstrate.
   */
  public loadDemoDinosaur(slug: string): void {
    const normalized = slug.toLowerCase().replace('-', '_');
    const dino =
      this.dinosaurs().find(
        d =>
          d.slug === normalized ||
          d.slug === slug ||
          d.slug.replace('_', '-') === slug
      ) || this.dinosaurs()[0];

    if (!dino) {
      return;
    }

    const fossil = dino.fossil_profile;
    const dietMatch =
      Boolean(fossil && dino.game_profile.diet.toLowerCase() === fossil.real_diet.toLowerCase());
    const fidelity = fossil ? 86.5 : 70.0;

    const insights = [
      `Dieta no rancho: ${dino.game_profile.diet} com guloseima favorita Poppin ${dino.game_profile.poppin_favorite}.`,
      fossil
        ? `Dieta real: ${fossil.real_diet} durante o período geológico ${fossil.geological_period} (~${fossil.approximate_mya}).`
        : 'Registro fóssil em curadoria científica.',
      fossil
        ? `Evidência anatômica fóssil: ${fossil.distinctive_features}`
        : 'Anatomia comparada preservada.',
    ];

    this.scanResult.set({
      prediction: {
        predicted_slug: dino.slug,
        confidence: 0.974,
        top_candidates: [
          { species_slug: dino.slug, probability: 0.974 },
          { species_slug: 'parasaurolophus', probability: 0.018 },
          { species_slug: 'corythosaurus', probability: 0.008 },
        ],
      },
      dinosaur: dino,
      comparison_report: {
        fidelity_percentage: fidelity,
        verdict: fidelity >= 80 ? 'Alta Fidelidade Científica' : 'Boa Precisão com Adaptações Lúdicas',
        diet_match: dietMatch,
        size_comparison_summary: fossil
          ? `No jogo: porte ${dino.game_profile.size_category}. Fóssil: ~${fossil.length_meters}m de comprimento e ${fossil.mass_kg.toLocaleString()} kg.`
          : `Porte in-game: ${dino.game_profile.size_category}.`,
        key_insights: insights,
      },
    });
  }
}
