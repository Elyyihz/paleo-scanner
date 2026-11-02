import { Component, HostListener, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Modal dialog presenting comprehensive comparison details for a selected dinosaur
 * in warm earthy Paleo Pines style.
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
          class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          (click)="state.closeDinosaurModal()"
        ></div>

        <!-- Dialog Container -->
        <div class="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div
            class="relative w-full max-w-5xl rounded-3xl border border-[#5a402a] bg-[#1e1610] p-6 sm:p-8 shadow-2xl overflow-hidden text-left"
            (click)="$event.stopPropagation()"
          >
            <!-- Close Button -->
            <button
              type="button"
              (click)="state.closeDinosaurModal()"
              class="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#2a1e16] hover:bg-[#38281d] text-[#c2ae9b] hover:text-[#fceddb] flex items-center justify-center transition-colors border border-[#4d3826] cursor-pointer z-10"
              title="Fechar (Esc)"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Modal Header with Portrait -->
            <div class="flex items-center gap-5 pb-6 border-b border-[#3e2c1e]">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#17100a] border-2 border-[#8c5836] p-1 shrink-0 overflow-hidden shadow-lg glow-wood">
                @if (dino.portrait_url) {
                  <img
                    [src]="state.getPortraitUrl(dino.portrait_url)"
                    [alt]="dino.common_name"
                    class="w-full h-full object-cover rounded-xl"
                  />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-2xl">🦖</div>
                }
              </div>

              <div>
                <span class="text-xs uppercase font-bold tracking-wider text-[#f4a261]">
                  Dossiê Comparativo de Espécie
                </span>
                <h2 class="text-2xl sm:text-3xl font-black text-[#fceddb]">
                  {{ dino.common_name }}
                </h2>
                @if (dino.fossil_profile?.scientific_name) {
                  <p class="text-sm text-[#b8a490] italic">
                    {{ dino.fossil_profile!.scientific_name }}
                  </p>
                }
              </div>
            </div>

            <!-- Content Body: Split View -->
            <div class="mt-6 max-h-[70vh] overflow-y-auto pr-2">
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
}
