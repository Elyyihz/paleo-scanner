import { Component, HostListener, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { DinosaurCardComponent } from './dinosaur-card/dinosaur-card.component';
import { DinosaurModalComponent } from './dinosaur-modal/dinosaur-modal.component';

/**
 * Filterable and searchable species catalog styled in sober paleobiological laboratory archive aesthetics
 * with clean vector icons and responsive controls.
 */
@Component({
  selector: 'app-catalog-container',
  standalone: true,
  host: { class: 'block w-full' },
  imports: [DinosaurCardComponent, DinosaurModalComponent],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Title & Filters Bar -->
      <div class="space-y-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs uppercase font-mono font-semibold tracking-wider text-[#c8873a]">[BIO-ARQUIVO]</span>
              <span class="text-[#222d3a]">·</span>
              <span class="text-xs font-mono text-[#94a3b8]">{{ state.totalSpeciesCount() }} REGISTROS CATALOGADOS</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#ebe6dc] tracking-tight">
              Catálogo de Espécies
            </h2>
            <p class="text-xs sm:text-sm text-[#94a3b8] mt-1">
              Explore os {{ state.totalSpeciesCount() }} espécimes de Paleo Pines e correlacione seus traços com registros fósseis e reconstituições paleontológicas.
            </p>
          </div>

          <!-- Live search input -->
          <div class="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou espécie..."
              [value]="state.searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full px-3.5 py-2 pl-9 rounded bg-[#0c1015] border border-[#222d3a] text-[#ebe6dc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#c8873a] focus:ring-1 focus:ring-[#c8873a] transition-colors shadow-inner"
            />
            <svg class="w-4 h-4 text-[#64748b] absolute left-3 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            @if (state.searchQuery()) {
              <button
                type="button"
                (click)="state.searchQuery.set('')"
                class="absolute right-3 top-2.5 text-[#64748b] hover:text-[#ebe6dc] text-xs cursor-pointer font-bold"
              >
                ✕
              </button>
            }
          </div>
        </div>

        <!-- Filter Chips: Biomes and Diets -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#222d3a]">
          <!-- Biomes -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-[#94a3b8] font-mono font-medium mr-1 uppercase text-[11px]">Bioma:</span>
            <button
              type="button"
              (click)="state.selectedBiome.set('all')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedBiome() === 'all'
                ? 'bg-[#c8873a] text-[#0c1015] border border-[#c8873a] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Todos
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Valley')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedBiome() === 'Valley'
                ? 'bg-[#183321] text-[#4ade80] border border-[#2e7d4b] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Veridian Valley
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Forest')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedBiome() === 'Forest'
                ? 'bg-[#1c2e24] text-[#86efac] border border-[#276749] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Dapplewood (Forest)
            </button>
            <button
              type="button"
              (click)="state.selectedBiome.set('Desert')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedBiome() === 'Desert'
                ? 'bg-[#3b2313] text-[#fcd34d] border border-[#b45309] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Ariacotta (Desert)
            </button>
          </div>

          <!-- Diets -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-[#94a3b8] font-mono font-medium mr-1 uppercase text-[11px]">Dieta:</span>
            <button
              type="button"
              (click)="state.selectedDiet.set('all')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedDiet() === 'all'
                ? 'bg-[#1a232e] text-[#ebe6dc] border border-[#37475a] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Todas
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Herbivore')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedDiet() === 'Herbivore'
                ? 'bg-[#183321] text-[#4ade80] border border-[#2e7d4b] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Herbívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Carnivore')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedDiet() === 'Carnivore'
                ? 'bg-[#3b1517] text-[#f87171] border border-[#991b1b] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Carnívoro
            </button>
            <button
              type="button"
              (click)="state.selectedDiet.set('Omnivore')"
              class="px-2.5 py-1 rounded font-mono text-xs font-medium transition-colors cursor-pointer"
              [class]="state.selectedDiet() === 'Omnivore'
                ? 'bg-[#2a1d3b] text-[#d8b4fe] border border-[#6b21a8] font-bold'
                : 'bg-[#0c1015] text-[#94a3b8] hover:text-[#ebe6dc] border border-[#222d3a] hover:bg-[#16202a]'"
            >
              Onívoro
            </button>
          </div>
        </div>

        <!-- Counter summary -->
        <div class="text-xs font-mono text-[#94a3b8] flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <span>
              Exibindo <strong class="text-[#c8873a] font-bold">{{ state.filteredDinosaurs().length }}</strong> de {{ state.totalSpeciesCount() }} espécies
            </span>
            <span class="hidden md:inline-flex items-center gap-1 text-[#64748b]">
              · Navegue com <kbd class="px-1.5 py-0.5 rounded bg-[#16202a] border border-[#222d3a] text-[#c8873a] text-[10px]">←</kbd> <kbd class="px-1.5 py-0.5 rounded bg-[#16202a] border border-[#222d3a] text-[#c8873a] text-[10px]">→</kbd>
            </span>
          </div>
          @if (state.searchQuery() || state.selectedBiome() !== 'all' || state.selectedDiet() !== 'all') {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-[#c8873a] hover:underline cursor-pointer font-bold"
            >
              Limpar filtros
            </button>
          }
        </div>
      </div>

      <!-- Dino Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        @for (dino of state.filteredDinosaurs(); track dino.slug) {
          <app-dinosaur-card [dinosaur]="dino" />
        }
      </div>

      <!-- Empty state when no matches -->
      @if (state.filteredDinosaurs().length === 0) {
        <div class="p-12 text-center rounded-lg border border-[#222d3a] bg-[#121820] space-y-3">
          <div class="w-12 h-12 rounded bg-[#0c1015] border border-[#222d3a] flex items-center justify-center text-[#c8873a] mx-auto">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-[#ebe6dc]">Nenhuma espécie encontrada</h3>
          <p class="text-xs text-[#94a3b8] max-w-sm mx-auto">
            Não encontramos nenhum registro fóssil correspondente aos filtros ativos. Tente redefinir a busca.
          </p>
          <button
            type="button"
            (click)="resetFilters()"
            class="px-3.5 py-1.5 text-xs font-mono font-bold rounded bg-[#c8873a] text-[#0c1015] hover:bg-[#dba159] transition-colors cursor-pointer"
          >
            Redefinir Busca
          </button>
        </div>
      }

      <!-- Dinosaur Detail Modal -->
      <app-dinosaur-modal />
    </div>
  `
})
export class CatalogContainerComponent {
  public readonly state = inject(ScannerStateService);

  @HostListener('document:keydown.arrowright', ['$event'])
  public handleArrowRight(event: Event): void {
    if (this.isInputElement(event.target) || this.state.selectedDinosaur()) return;
    const dinos = this.state.filteredDinosaurs();
    if (dinos.length > 0) {
      event.preventDefault();
      this.state.openDinosaurModal(dinos[0]);
    }
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  public handleArrowLeft(event: Event): void {
    if (this.isInputElement(event.target) || this.state.selectedDinosaur()) return;
    const dinos = this.state.filteredDinosaurs();
    if (dinos.length > 0) {
      event.preventDefault();
      this.state.openDinosaurModal(dinos[dinos.length - 1]);
    }
  }

  private isInputElement(target: EventTarget | null): boolean {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  }

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
