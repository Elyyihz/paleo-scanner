import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { DinosaurCardComponent } from './dinosaur-card/dinosaur-card.component';
import { DinosaurModalComponent } from './dinosaur-modal/dinosaur-modal.component';

/**
 * Filterable and searchable species catalog styled in warm earthy Paleo Pines ranch aesthetics.
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
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs uppercase font-bold tracking-wider text-[#f4a261]">Acervo Pré-Histórico</span>
              <span class="text-[#5e4533]">·</span>
              <span class="text-xs text-[#a89582]">Rancho de Paleo Pines</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-[#fceddb] tracking-tight">
              Catálogo de Espécies
            </h2>
            <p class="text-xs sm:text-sm text-[#b8a490] mt-1">
              Explore os 39 dinossauros catalogados em Paleo Pines e seus registros paleontológicos correspondentes.
            </p>
          </div>

          <!-- Live search input -->
          <div class="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou espécie..."
              [value]="state.searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full px-4 py-2.5 pl-10 rounded-2xl bg-[#221811] border border-[#4d3725] text-[#fceddb] placeholder-[#8c7764] text-sm focus:outline-none focus:border-[#f4a261] focus:ring-1 focus:ring-[#f4a261] transition-colors shadow-inner"
            />
            <svg class="w-4 h-4 text-[#8c7764] absolute left-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            @if (state.searchQuery()) {
              <button
                type="button"
                (click)="state.searchQuery.set('')"
                class="absolute right-3.5 top-3 text-[#8c7764] hover:text-[#fceddb] text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            }
          </div>
        </div>

        <!-- Filter Chips: Biomes and Diets -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#3e2c1e]">
          <!-- Biomes -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-[#a89582] font-bold mr-1">Bioma:</span>
            <button
              type="button"
              (click)="state.selectedBiome.set('all')"
              class="px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'all'
                ? 'bg-[#d97706] text-amber-50 shadow-md shadow-amber-950/50'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Todos
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Valley')"
              class="px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'Valley'
                ? 'bg-[#193a38] text-[#5eead4] border border-[#134e4a] shadow-md'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Veridian Valley
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Forest')"
              class="px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'Forest'
                ? 'bg-[#1c3a27] text-[#74c69d] border border-[#2d6a4f] shadow-md'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Dapplewood (Forest)
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Desert')"
              class="px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
              [class]="state.selectedBiome() === 'Desert'
                ? 'bg-[#422915] text-[#f4a261] border border-[#7a4c25] shadow-md'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Ariacotta (Desert)
            </button>
          </div>

          <!-- Diets -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-[#a89582] font-bold mr-1">Dieta:</span>
            <button
              type="button"
              (click)="state.selectedDiet.set('all')"
              class="px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'all'
                ? 'bg-[#e6d5c3] text-[#291c12] font-black'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Todas
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Herbivore')"
              class="px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'Herbivore'
                ? 'bg-[#1c3a27] text-[#74c69d] border border-[#2d6a4f]'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Herbívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Carnivore')"
              class="px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'Carnivore'
                ? 'bg-[#3f1d1d] text-[#fca5a5] border border-[#822a21]'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Carnívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Omnivore')"
              class="px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              [class]="state.selectedDiet() === 'Omnivore'
                ? 'bg-[#391e3e] text-[#f0abfc] border border-[#702d78]'
                : 'bg-[#221811] text-[#b8a490] hover:text-[#fceddb] border border-[#443122]'"
            >
              Onívoro
            </button>
          </div>
        </div>

        <!-- Counter summary -->
        <div class="text-xs text-[#a89582] flex items-center justify-between">
          <span>
            Exibindo <strong class="text-[#f4a261]">{{ state.filteredDinosaurs().length }}</strong> de {{ state.totalSpeciesCount() }} espécies
          </span>
          @if (state.searchQuery() || state.selectedBiome() !== 'all' || state.selectedDiet() !== 'all') {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-xs text-[#f4a261] hover:text-[#ffbe76] underline cursor-pointer font-bold"
            >
              Limpar Filtros
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (state.isLoadingCatalog()) {
        <div class="py-24 text-center space-y-4">
          <div class="w-12 h-12 border-4 border-[#543d2b] border-t-[#f4a261] rounded-full animate-spin mx-auto"></div>
          <p class="text-sm text-[#b8a490]">Carregando o caderno de espécies de Paleo Pines...</p>
        </div>
      }

      <!-- Error State -->
      @if (state.catalogError(); as err) {
        <div class="p-6 rounded-3xl bg-[#3f1917] border border-[#822a21] text-center space-y-3">
          <p class="text-sm text-[#fca5a5]">{{ err }}</p>
          <button
            type="button"
            (click)="state.fetchCatalog()"
            class="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#68221b] text-rose-100 hover:bg-[#822a21] cursor-pointer"
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
          <div class="py-20 text-center rounded-3xl border border-dashed border-[#4d3827] bg-[#201710] p-8">
            <div class="w-16 h-16 rounded-2xl bg-[#2e2117] flex items-center justify-center text-3xl mx-auto mb-3">
              🔍
            </div>
            <h3 class="text-lg font-bold text-[#fceddb]">Nenhum dinossauro encontrado</h3>
            <p class="text-xs text-[#a89582] mt-1 max-w-sm mx-auto">
              Nenhuma espécie corresponde aos filtros de busca ou bioma selecionados.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="mt-4 px-4 py-2 rounded-2xl text-xs font-bold bg-[#342417] text-[#f4a261] hover:bg-[#443021] border border-[#573f2c] cursor-pointer"
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
