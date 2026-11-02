import { Component, computed, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Visual breakdown of MobileNetV3 predictions, top candidates, and comparative report.
 */
@Component({
  selector: 'app-scan-results',
  standalone: true,
  imports: [SplitViewComparisonComponent],
  template: `
    @if (state.scanResult(); as res) {
      <div class="space-y-8 animate-fadeIn">
        <!-- Detection Summary Card -->
        <div class="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <!-- Species Identification Banner -->
            <div class="flex items-center gap-5 w-full lg:w-auto">
              @if (res.dinosaur?.portrait_url) {
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-2 border-cyan-400 p-1 shrink-0 overflow-hidden shadow-lg glow-cyan">
                  <img
                    [src]="state.getPortraitUrl(res.dinosaur!.portrait_url)"
                    [alt]="res.dinosaur!.common_name"
                    class="w-full h-full object-cover rounded-xl"
                  />
                </div>
              }
              <div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/50 mb-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Identificação Concluída
                </span>
                <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {{ res.dinosaur?.common_name || res.prediction.predicted_slug }}
                </h2>
                @if (res.dinosaur?.fossil_profile?.scientific_name) {
                  <p class="text-sm font-medium text-cyan-400/90 italic">
                    {{ res.dinosaur!.fossil_profile!.scientific_name }}
                  </p>
                }
              </div>
            </div>

            <!-- Confidence and Top Candidates -->
            <div class="w-full lg:w-80 bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">Grau de Certeza da IA</span>
                <span class="text-sm font-mono font-bold text-cyan-400">
                  {{ (res.prediction.confidence * 100).toFixed(1) }}%
                </span>
              </div>

              <!-- Top-3 candidate probability meters -->
              <div class="space-y-2">
                @for (cand of res.prediction.top_candidates; track cand.species_slug) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] text-slate-300">
                      <span class="truncate max-w-[160px]">{{ formatCandidateName(cand.species_slug) }}</span>
                      <span class="font-mono text-slate-400">{{ (cand.probability * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
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
            class="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-lg"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            <span>Digitalizar Outra Captura de Tela</span>
          </button>
        </div>
      </div>
    }
  `
})
export class ScanResultsComponent {
  public readonly state = inject(ScannerStateService);

  /**
   * Helper to format candidate slug into readable title.
   *
   * @param slug - Species slug.
   * @returns Clean title.
   */
  public formatCandidateName(slug: string): string {
    return slug
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
