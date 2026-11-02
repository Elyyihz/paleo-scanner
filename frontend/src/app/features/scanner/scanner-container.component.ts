import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { UploadZoneComponent } from './upload-zone/upload-zone.component';
import { ScanResultsComponent } from './scan-results/scan-results.component';

/**
 * Main container for the visual scanning flow with high-priority upload zone placed immediately above the fold.
 */
@Component({
  selector: 'app-scanner-container',
  standalone: true,
  imports: [UploadZoneComponent, ScanResultsComponent],
  template: `
    <div class="space-y-6">
      <!-- Concise Top Header (Immediately visible without scrolling) -->
      @if (!state.hasScanResult()) {
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b2436] border border-[#174463] text-[#06b6d4] text-xs font-mono font-bold shadow-xs">
            <svg class="w-3.5 h-3.5 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
            </svg>
            <span>RECONHECIMENTO BIO-VISUAL (38 ESPÉCIES)</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-black text-[#f8fafc] tracking-tight">
            Descubra o Fóssil Real do Seu Dinossauro
          </h2>

          <p class="text-xs sm:text-sm text-[#94a3b8] max-w-lg mx-auto">
            Envie uma captura de tela de <strong class="text-[#06b6d4]">Paleo Pines</strong> para identificar a espécie e comparar traços anatômicos com a paleontologia moderna.
          </p>
        </div>

        <!-- Drag & Drop Zone placed right at the top -->
        <div class="max-w-2xl mx-auto">
          <app-upload-zone />
        </div>
      } @else {
        <div>
          <app-scan-results />
        </div>
      }
    </div>
  `
})
export class ScannerContainerComponent {
  public readonly state = inject(ScannerStateService);
}
