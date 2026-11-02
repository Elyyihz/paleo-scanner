import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Visual breakdown of MobileNetV3 predictions, top candidates, and comparative report
 * in high-tech bio-scanner styling.
 */
@Component({
  selector: 'app-scan-results',
  standalone: true,
  imports: [SplitViewComparisonComponent],
  template: `
    @if (state.scanResult(); as res) {
      <div class="space-y-8 animate-fadeIn">
        <!-- Detection Summary Card with HUD Corners -->
        <div class="rounded-2xl border border-[#174463] bg-[#0a2030]/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <i class="corner tl"></i>
          <i class="corner tr"></i>
          <i class="corner bl"></i>
          <i class="corner br"></i>

          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <!-- Species Identification Banner -->
            <div class="flex items-center gap-5 w-full lg:w-auto">
              @if (res.dinosaur?.portrait_url) {
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#040e16] border border-[#174463] p-1.5 shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
                  <img
                    [src]="state.getPortraitUrl(res.dinosaur!.portrait_url)"
                    [alt]="res.dinosaur!.common_name"
                    class="w-full h-full object-contain rounded-xl"
                  />
                </div>
              }
              <div>
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#062c20] text-[#34d399] border border-[#0d6b4a] mb-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  IDENTIFICAÇÃO CONCLUÍDA
                </span>
                <h2 class="text-2xl sm:text-4xl font-black text-[#f8fafc] tracking-tight">
                  {{ res.dinosaur?.common_name || res.prediction.predicted_slug }}
                </h2>
                @if (res.dinosaur?.fossil_profile?.scientific_name) {
                  <p class="text-sm font-mono font-semibold text-[#06b6d4] italic">
                    {{ res.dinosaur!.fossil_profile!.scientific_name }}
                  </p>
                }
              </div>
            </div>

            <!-- Confidence and Top Candidates in Tech Frame -->
            <div class="w-full lg:w-80 bg-[#071927] p-4 rounded-xl border border-[#174463] space-y-3 shadow-inner">
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase font-mono font-bold text-[#94a3b8] tracking-wider">Certeza do Classificador</span>
                <span class="text-sm font-mono font-black text-[#06b6d4]">
                  {{ (res.prediction.confidence * 100).toFixed(1) }}%
                </span>
              </div>

              <!-- Top-3 candidate probability meters -->
              <div class="space-y-2">
                @for (cand of res.prediction.top_candidates; track cand.species_slug) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] text-[#cbd5e1] font-mono">
                      <span class="truncate max-w-[160px]">{{ formatCandidateName(cand.species_slug) }}</span>
                      <span class="text-[#38bdf8]">{{ (cand.probability * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="h-2 w-full bg-[#040e16] rounded-full overflow-hidden border border-[#174463]/60">
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-[#0891b2] to-[#06b6d4] transition-all duration-500"
                        [style.width.%]="cand.probability * 100"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Embedded Split-View Comparison -->
        @if (res.dinosaur) {
          <app-split-view-comparison
            [dinosaur]="res.dinosaur"
            [report]="res.comparison_report"
          />
        }

        <!-- Actions footer -->
        <div class="flex justify-center pt-4">
          <button
            type="button"
            (click)="state.clearScan()"
            class="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-white bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:brightness-110 border border-cyan-400/40 transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-950/40 hover:scale-[1.02]"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            <span>Identificar Outro Dinossauro</span>
          </button>
        </div>
      </div>
    }
  `
})
export class ScanResultsComponent {
  public readonly state = inject(ScannerStateService);

  public formatCandidateName(slug: string): string {
    return slug
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
