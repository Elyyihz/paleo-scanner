import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../core/services/scanner-state.service';
import { UploadZoneComponent } from './upload-zone/upload-zone.component';
import { ScanResultsComponent } from './scan-results/scan-results.component';

/**
 * Main container for the visual scanning flow styled in warm Paleo Pines atmosphere.
 */
@Component({
  selector: 'app-scanner-container',
  standalone: true,
  imports: [UploadZoneComponent, ScanResultsComponent],
  template: `
    <div class="space-y-10">
      <!-- Hero Intro Header with Paleo Pines Logo -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <!-- Logo Display -->
        <div class="flex justify-center mb-1">
          <img
            src="/logo.png"
            alt="Paleo Pines"
            class="h-24 sm:h-32 w-auto object-contain drop-shadow-lg"
          />
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2e2116] border border-[#5a402a] text-[#f4a261] text-xs font-bold shadow-sm">
          <span class="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
          Inteligência Artificial Treinada em 38 Espécies do Jogo
        </div>

        <h2 class="text-3xl sm:text-5xl font-black text-[#fceddb] tracking-tight leading-tight">
          Descubra o Fóssil Real por Trás do Seu Dinossauro
        </h2>

        <p class="text-sm sm:text-base text-[#b8a490] leading-relaxed max-w-2xl mx-auto">
          Envie uma imagem do seu dinossauro de <strong class="text-[#f4a261]">Paleo Pines</strong> para descobrir a espécie exata e comparar como ele vivia na pré-história real: peso fóssil, época geológica, dieta e anatomia.
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
