import { Component, HostListener, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Modal dialog presenting comprehensive comparison details for a selected dinosaur
 * in high-tech bio-scanner style with vector icons.
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
          class="fixed inset-0 bg-[#05131e]/85 backdrop-blur-sm transition-opacity"
          (click)="state.closeDinosaurModal()"
        ></div>

        <!-- Dialog Container -->
        <div class="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div
            class="relative w-full max-w-5xl rounded-2xl border border-[#174463] bg-[#071927] p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden text-left"
            (click)="$event.stopPropagation()"
          >
            <!-- Close Button -->
            <button
              type="button"
              (click)="state.closeDinosaurModal()"
              class="absolute top-5 right-5 w-10 h-10 rounded-xl bg-[#091f2f] hover:bg-[#0f2c42] text-[#94a3b8] hover:text-[#f8fafc] flex items-center justify-center transition-colors border border-[#174463] cursor-pointer z-10"
              title="Fechar (Esc)"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Modal Header with Portrait -->
            <div class="flex items-center gap-5 pb-6 border-b border-[#174463]">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#040e16] border border-[#174463] p-1.5 shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
                @if (dino.portrait_url) {
                  <img
                    [src]="state.getPortraitUrl(dino.portrait_url)"
                    [alt]="dino.common_name"
                    class="w-full h-full object-contain rounded-xl"
                    (error)="onImageError($event, dino.slug)"
                  />
                } @else {
                  <svg class="w-8 h-8 text-[#174463]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                    <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                    <path d="M2 18l4-4"/>
                  </svg>
                }
              </div>

              <div>
                <span class="text-xs uppercase font-mono font-bold tracking-wider text-[#06b6d4]">
                  [DOSSIÊ COMPARATIVO DE ESPÉCIE]
                </span>
                <h2 class="text-2xl sm:text-3xl font-black text-[#f8fafc]">
                  {{ dino.common_name }}
                </h2>
                @if (dino.fossil_profile?.scientific_name) {
                  <p class="text-sm font-mono text-[#94a3b8] italic">
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

  public onImageError(event: Event, slug: string): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes(`/static/portraits/${slug}.png`)) {
      img.src = `/static/portraits/${slug}.png`;
    }
  }
}
