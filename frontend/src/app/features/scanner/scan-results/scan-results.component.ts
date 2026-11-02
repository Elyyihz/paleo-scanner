import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Visual breakdown of MobileNetV3 predictions, top candidates, and comparative report
 * in sober scientific laboratory workstation styling.
 */
@Component({
  selector: 'app-scan-results',
  standalone: true,
  host: { class: 'block w-full' },
  imports: [SplitViewComparisonComponent],
  template: `
    @if (state.scanResult(); as res) {
      <div class="flex flex-col gap-6 animate-fadeIn">
        <!-- Detection Summary Card -->
        <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <i class="corner tl"></i>
          <i class="corner tr"></i>
          <i class="corner bl"></i>
          <i class="corner br"></i>

          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <!-- Species Identification Banner -->
            <div class="flex items-center gap-4 w-full lg:w-auto">
              @if (res.dinosaur?.portrait_url) {
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded bg-[#080c10] border border-[#222d3a] p-1.5 shrink-0 overflow-hidden shadow-md flex items-center justify-center">
                  <img
                    [src]="state.getPortraitUrl(res.dinosaur!.portrait_url)"
                    [alt]="res.dinosaur!.common_name"
                    class="w-full h-full object-contain rounded"
                  />
                </div>
              }
              <div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-[#0f241a] text-[#4ade80] border border-[#1b4d31] mb-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
                  IDENTIFICAÇÃO CONCLUÍDA
                </span>
                <h2 class="text-2xl sm:text-3xl font-bold text-[#ebe6dc] tracking-tight">
                  {{ res.dinosaur?.common_name || res.prediction.predicted_slug }}
                </h2>
                @if (res.dinosaur?.fossil_profile?.scientific_name) {
                  <p class="text-sm font-mono text-[#c8873a] italic">
                    {{ res.dinosaur!.fossil_profile!.scientific_name }}
                  </p>
                }
              </div>
            </div>

            <!-- Confidence and Top Candidates in Tech Frame -->
            <div class="w-full lg:w-80 bg-[#0c1015] p-4 rounded border border-[#222d3a] space-y-3 shadow-inner">
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase font-mono font-medium text-[#94a3b8] tracking-wider">Certeza do Classificador</span>
                <span class="text-sm font-mono font-bold text-[#c8873a]">
                  {{ (res.prediction.confidence * 100).toFixed(1) }}%
                </span>
              </div>

              <!-- Top-3 candidate probability meters -->
              <div class="space-y-2">
                @for (cand of res.prediction.top_candidates; track cand.species_slug) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] text-[#cbd5e1] font-mono">
                      <span class="truncate max-w-[160px]">{{ formatCandidateName(cand.species_slug) }}</span>
                      <span class="text-[#c8873a]">{{ (cand.probability * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-[#16202a] rounded overflow-hidden">
                      <div
                        class="h-full rounded bg-gradient-to-r from-[#8c5a22] to-[#c8873a] transition-all duration-500"
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
        <div class="flex justify-center pt-2">
          <button
            type="button"
            (click)="state.clearScan()"
            class="flex items-center gap-2.5 px-5 py-2.5 rounded font-mono text-xs uppercase tracking-wider font-bold text-[#0c1015] bg-[#c8873a] hover:bg-[#dba159] transition-all cursor-pointer shadow-md shadow-amber-950/30"
          >
            <svg class="w-4 h-4 text-[#0c1015]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            <span>Identificar Outro Espécime</span>
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
