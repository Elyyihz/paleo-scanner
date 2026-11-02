import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { UploadZoneComponent } from './upload-zone/upload-zone.component';
import { ScanResultsComponent } from './scan-results/scan-results.component';

/**
 * Main container for the visual scanning flow.
 */
@Component({
  selector: 'app-scanner-container',
  standalone: true,
  imports: [UploadZoneComponent, ScanResultsComponent],
  template: `
    <div class="space-y-10">
      <!-- Hero Intro Header -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Classificador Neural Treinado em 38 Espécies
        </div>
        <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Descubra o Fóssil Real por Trás do Seu Dinossauro
        </h2>
        <p class="text-sm sm:text-base text-slate-400 leading-relaxed">
          Envie uma captura de tela do seu dinossauro de <strong class="text-slate-200">Paleo Pines</strong> para que a rede neural identifique a espécie instantaneamente e gere um raio-X comparativo com a anatomia e o período fóssil real.
        </p>
      </div>

      <!-- Main Action Area: Upload vs. Results -->
      @if (!state.hasScanResult()) {
        <div class="max-w-3xl mx-auto">
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
