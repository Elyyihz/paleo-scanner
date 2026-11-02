import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { DinosaurCardComponent } from './dinosaur-card/dinosaur-card.component';
import { DinosaurModalComponent } from './dinosaur-modal/dinosaur-modal.component';

/**
 * Filterable and searchable species catalog showcasing the 39 Paleo Pines dinosaurs.
 */
@Component({
  selector: 'app-catalog-container',
  standalone: true,
  imports: [DinosaurCardComponent, DinosaurModalComponent],
  template: `
    <div class="space-y-8">
      <!-- Title & Filters Bar -->
      <div class="space-y-5">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Catálogo de Espécies
            </h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Explore os 39 dinossauros catalogados em Paleo Pines e seus registros paleontológicos.
            </p>
          </div>

          <!-- Live search input -->
          <div class="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou espécie..."
              [value]="state.searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-inner"
            />
            <svg class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            @if (state.searchQuery()) {
              <button
                type="button"
                (click)="state.searchQuery.set('')"
                class="absolute right-3 top-3 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            }
          </div>
        </div>

        <!-- Filter Chips: Biomes and Diets -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <!-- Biomes -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-slate-500 font-semibold mr-1">Bioma:</span>
            <button
              type="button"
              (click)="state.selectedBiome.set('all')"
              class="px-3 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedBiome() === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Todos
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Valley')"
              class="px-3 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedBiome() === 'Valley'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Valley
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Forest')"
              class="px-3 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedBiome() === 'Forest'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Dapplewood (Forest)
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Desert')"
              class="px-3 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedBiome() === 'Desert'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Ariacotta (Desert)
            </button>
          </div>

          <!-- Diets -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-slate-500 font-semibold mr-1">Dieta:</span>
            <button
              type="button"
              (click)="state.selectedDiet.set('all')"
              class="px-2.5 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedDiet() === 'all'
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Todas
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Herbivore')"
              class="px-2.5 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedDiet() === 'Herbivore'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Herbívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Carnivore')"
              class="px-2.5 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedDiet() === 'Carnivore'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Carnívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Omnivore')"
              class="px-2.5 py-1 rounded-lg font-medium transition-all"
              [class]="state.selectedDiet() === 'Omnivore'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'"
            >
              Onívoro
            </button>
          </div>
        </div>

        <!-- Counter summary -->
        <div class="text-xs text-slate-400 flex items-center justify-between">
          <span>
            Exibindo <strong class="text-cyan-400">{{ state.filteredDinosaurs().length }}</strong> de {{ state.totalSpeciesCount() }} espécies
          </span>
          @if (state.searchQuery() || state.selectedBiome() !== 'all' || state.selectedDiet() !== 'all') {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Limpar Filtros
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (state.isLoadingCatalog()) {
        <div class="py-24 text-center space-y-4">
          <div class="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
          <p class="text-sm text-slate-400">Carregando catálogo de dinossauros...</p>
        </div>
      }

      <!-- Error State -->
      @if (state.catalogError(); as err) {
        <div class="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-center space-y-3">
          <p class="text-sm text-rose-300">{{ err }}</p>
          <button
            type="button"
            (click)="state.fetchCatalog()"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-900 text-rose-100 hover:bg-rose-800"
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
          <!-- Empty Results -->
          <div class="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
            <div class="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-3xl mx-auto mb-3">
              🔍
            </div>
            <h3 class="text-lg font-bold text-white">Nenhum dinossauro encontrado</h3>
            <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Nenhuma espécie corresponde aos filtros de busca ou bioma selecionados.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-cyan-300 hover:bg-slate-700"
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
