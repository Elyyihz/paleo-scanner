import { Component, HostListener, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Modal dialog presenting comprehensive comparison details for a selected dinosaur
 * in sober scientific laboratory workstation style with vector icons.
 */
@Component({
  selector: 'app-dinosaur-modal',
  standalone: true,
  imports: [SplitViewComparisonComponent],
  template: `
    @if (state.selectedDinosaur(); as dino) {
      <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-[#06090d]/85 backdrop-blur-sm transition-opacity"
          (click)="state.closeDinosaurModal()"
        ></div>

        <!-- Dialog Container -->
        <div class="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div
            class="relative w-full max-w-5xl rounded-lg border border-[#2c3b4c] bg-[#0e141b] p-5 sm:p-7 shadow-2xl overflow-hidden text-left"
            (click)="$event.stopPropagation()"
          >
            <!-- Modal Header with Portrait and Navigation Controls -->
            <div class="flex items-center justify-between gap-4 pb-5 border-b border-[#222d3a]">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded bg-[#080c10] border border-[#222d3a] p-1.5 shrink-0 overflow-hidden shadow-md flex items-center justify-center">
                  @if (dino.portrait_url) {
                    <img
                      [src]="state.getPortraitUrl(dino.portrait_url)"
                      [alt]="dino.common_name"
                      class="w-full h-full object-contain rounded"
                      (error)="onImageError($event, dino.slug)"
                    />
                  } @else {
                    <svg class="w-8 h-8 text-[#37475a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                      <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                      <path d="M2 18l4-4"/>
                    </svg>
                  }
                </div>

                <div class="min-w-0">
                  <span class="text-xs uppercase font-mono font-medium tracking-wider text-[#c8873a]">
                    [DOSSIÊ COMPARATIVO DE ESPÉCIE]
                  </span>
                  <h2 class="text-2xl sm:text-3xl font-bold text-[#ebe6dc] truncate">
                    {{ dino.common_name }}
                  </h2>
                  @if (dino.fossil_profile?.scientific_name) {
                    <p class="text-sm font-mono text-[#94a3b8] italic truncate">
                      {{ dino.fossil_profile!.scientific_name }}
                    </p>
                  }
                </div>
              </div>

              <!-- Action Controls: Navigation & Close -->
              <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <!-- Specimen Counter -->
                <div class="hidden md:flex flex-col items-end mr-1 text-right">
                  <span class="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Espécime</span>
                  <span class="text-xs font-mono font-semibold text-[#c8873a]">
                    #{{ state.currentDinosaurIndex() + 1 }} / {{ state.filteredDinosaurs().length }}
                  </span>
                </div>

                <!-- Previous Specimen Button -->
                <button
                  type="button"
                  (click)="state.previousDinosaur()"
                  class="h-9 px-2.5 rounded bg-[#16202a] hover:bg-[#222d3a] text-[#94a3b8] hover:text-[#ebe6dc] flex items-center gap-1.5 transition-colors border border-[#222d3a] cursor-pointer text-xs font-mono font-medium"
                  title="Espécime Anterior (Seta Esquerda ←)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span class="hidden sm:inline">Anterior</span>
                  <kbd class="hidden lg:inline text-[10px] px-1 py-0.5 rounded bg-[#0c1015] border border-[#222d3a] text-[#64748b]">←</kbd>
                </button>

                <!-- Next Specimen Button -->
                <button
                  type="button"
                  (click)="state.nextDinosaur()"
                  class="h-9 px-2.5 rounded bg-[#16202a] hover:bg-[#222d3a] text-[#94a3b8] hover:text-[#ebe6dc] flex items-center gap-1.5 transition-colors border border-[#222d3a] cursor-pointer text-xs font-mono font-medium"
                  title="Próximo Espécime (Seta Direita →)"
                >
                  <span class="hidden sm:inline">Próximo</span>
                  <kbd class="hidden lg:inline text-[10px] px-1 py-0.5 rounded bg-[#0c1015] border border-[#222d3a] text-[#64748b]">→</kbd>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                <!-- Divider -->
                <div class="h-6 w-px bg-[#222d3a] mx-0.5"></div>

                <!-- Close Button -->
                <button
                  type="button"
                  (click)="state.closeDinosaurModal()"
                  class="w-9 h-9 rounded bg-[#16202a] hover:bg-[#222d3a] text-[#94a3b8] hover:text-[#ebe6dc] flex items-center justify-center transition-colors border border-[#222d3a] cursor-pointer"
                  title="Fechar (Esc)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content Body: Split View -->
            <div class="mt-5 max-h-[70vh] overflow-y-auto pr-1">
              <app-split-view-comparison [dinosaur]="dino" />
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DinosaurModalComponent {
  public readonly state = inject(ScannerStateService);

  @HostListener('document:keydown.escape')
  public handleEscape(): void {
    this.state.closeDinosaurModal();
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  public handleArrowRight(event: Event): void {
    if (this.isInputElement(event.target)) return;
    event.preventDefault();
    this.state.nextDinosaur();
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  public handleArrowLeft(event: Event): void {
    if (this.isInputElement(event.target)) return;
    event.preventDefault();
    this.state.previousDinosaur();
  }

  private isInputElement(target: EventTarget | null): boolean {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  }

  public onImageError(event: Event, slug: string): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes(`/static/portraits/${slug}.png`)) {
      img.src = `/static/portraits/${slug}.png`;
    }
  }
}
