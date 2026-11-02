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
  }

  /**
   * Pings backend API to monitor connectivity status.
   */
  public verifyBackendHealth(): void {
    this.apiService.checkHealth().subscribe({
      next: () => this.isBackendOnline.set(true),
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
      error: err => {
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
}
