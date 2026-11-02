import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { DinosaurCardComponent } from './dinosaur-card/dinosaur-card.component';
import { DinosaurModalComponent } from './dinosaur-modal/dinosaur-modal.component';

/**
 * Filterable and searchable species catalog styled in high-tech bio-archive scanner aesthetics
 * with clean vector icons.
 */
@Component({
  selector: 'app-catalog-container',
  standalone: true,
  host: { class: 'block w-full' },
  imports: [DinosaurCardComponent, DinosaurModalComponent],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Title & Filters Bar -->
      <div class="space-y-5">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs uppercase font-mono font-bold tracking-wider text-[#06b6d4]">[BIO-ARCHIVE]</span>
              <span class="text-[#174463]">·</span>
              <span class="text-xs font-mono text-[#94a3b8]">39 REGISTROS CATALOGADOS</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-[#f8fafc] tracking-tight">
              Catálogo de Espécies
            </h2>
            <p class="text-xs sm:text-sm text-[#94a3b8] mt-1">
              Explore os 39 espécimes de Paleo Pines e correlacione seus traços com registros fósseis e reconstituições paleontológicas.
            </p>
          </div>

          <!-- Live search input -->
          <div class="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou espécie..."
              [value]="state.searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#091f2f] border border-[#174463] text-[#f8fafc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors shadow-inner"
            />
            <svg class="w-4 h-4 text-[#64748b] absolute left-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            @if (state.searchQuery()) {
              <button
                type="button"
                (click)="state.searchQuery.set('')"
                class="absolute right-3.5 top-3 text-[#64748b] hover:text-[#f8fafc] text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            }
          </div>
        </div>

        <!-- Filter Chips: Biomes and Diets -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#174463]">
          <!-- Biomes -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-[#94a3b8] font-mono font-bold mr-1 uppercase text-[11px]">Bioma:</span>
            <button
              type="button"
              (click)="state.selectedBiome.set('all')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'all'
                ? 'bg-[#0891b2] text-white border border-cyan-400/40 shadow-md shadow-cyan-950/60'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Todos
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Valley')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'Valley'
                ? 'bg-[#0c4a6e] text-[#38bdf8] border border-[#0284c7] shadow-md'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Veridian Valley
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Forest')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'Forest'
                ? 'bg-[#064e3b] text-[#34d399] border border-[#059669] shadow-md'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Dapplewood (Forest)
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Desert')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'Desert'
                ? 'bg-[#78350f] text-[#fbbf24] border border-[#d97706] shadow-md'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Ariacotta (Desert)
            </button>
          </div>

          <!-- Diets -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-[#94a3b8] font-mono font-bold mr-1 uppercase text-[11px]">Dieta:</span>
            <button
              type="button"
              (click)="state.selectedDiet.set('all')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'all'
                ? 'bg-[#0f2c42] text-[#38bdf8] border border-[#174463]'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Todas
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Herbivore')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'Herbivore'
                ? 'bg-[#064e3b] text-[#34d399] border border-[#059669]'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Herbívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Carnivore')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'Carnivore'
                ? 'bg-[#4c0519] text-[#fb7185] border border-[#be123c]'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Carnívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Omnivore')"
              class="px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'Omnivore'
                ? 'bg-[#3b0764] text-[#c084fc] border border-[#7e22ce]'
                : 'bg-[#091f2f] text-[#94a3b8] hover:text-[#f8fafc] border border-[#174463]'"
            >
              Onívoro
            </button>
          </div>
        </div>

        <!-- Counter summary -->
        <div class="text-xs font-mono text-[#94a3b8] flex items-center justify-between">
          <span>
            Exibindo <strong class="text-[#06b6d4]">{{ state.filteredDinosaurs().length }}</strong> de {{ state.totalSpeciesCount() }} espécies
          </span>
          @if (state.searchQuery() || state.selectedBiome() !== 'all' || state.selectedDiet() !== 'all') {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-xs font-mono text-[#06b6d4] hover:text-[#38bdf8] underline cursor-pointer font-bold"
            >
              Limpar Filtros
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (state.isLoadingCatalog()) {
        <div class="py-24 text-center space-y-4">
          <div class="w-12 h-12 border-4 border-[#174463] border-t-[#06b6d4] rounded-full animate-spin mx-auto"></div>
          <p class="text-sm font-mono text-[#94a3b8]">Carregando o acervo paleontológico...</p>
        </div>
      }

      <!-- Error State -->
      @if (state.catalogError(); as err) {
        <div class="p-6 rounded-2xl bg-[#3b1115] border border-[#8b2229] text-center space-y-3">
          <p class="text-sm text-[#fca5a5]">{{ err }}</p>
          <button
            type="button"
            (click)="state.fetchCatalog()"
            class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#52161c] text-[#fca5a5] hover:bg-[#8b2229] cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      }

      <!-- Dinosaurs Grid -->
      @if (!state.isLoadingCatalog() && !state.catalogError()) {
        @if (state.filteredDinosaurs().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            @for (dino of state.filteredDinosaurs(); track dino.slug) {
              <app-dinosaur-card [dinosaur]="dino" />
            }
          </div>
        } @else {
          <!-- Empty Results with Vector Search Lens Icon -->
          <div class="py-20 text-center rounded-2xl border border-dashed border-[#174463] bg-[#071927]/60 p-8">
            <div class="w-16 h-16 rounded-xl bg-[#091f2f] border border-[#174463] flex items-center justify-center text-[#06b6d4] mx-auto mb-3 shadow-inner">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-[#f8fafc]">Nenhum dinossauro encontrado</h3>
            <p class="text-xs text-[#94a3b8] mt-1 max-w-sm mx-auto">
              Nenhuma espécie corresponde aos filtros de busca ou bioma selecionados.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="mt-4 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#091f2f] text-[#06b6d4] hover:bg-[#0f2c42] border border-[#174463] cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        }
      }

      <!-- Details Modal -->
      <app-dinosaur-modal />
    </div>
  `
})
export class CatalogContainerComponent {
  public readonly state = inject(ScannerStateService);

  public onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.state.searchQuery.set(target.value);
  }

  public resetFilters(): void {
    this.state.searchQuery.set('');
    this.state.selectedBiome.set('all');
    this.state.selectedDiet.set('all');
  }
}
