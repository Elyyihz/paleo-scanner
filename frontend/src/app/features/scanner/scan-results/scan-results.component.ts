import { Component, inject } from '@angular/core';
import { ScannerStateService } from '../../../core/services/scanner-state.service';
import { SplitViewComparisonComponent } from '../../comparison/split-view-comparison.component';

/**
 * Visual breakdown of MobileNetV3 predictions, top candidates, and comparative report
 * in warm earthy Paleo Pines styling.
 */
@Component({
  selector: 'app-scan-results',
  standalone: true,
  imports: [SplitViewComparisonComponent],
  template: `
    @if (state.scanResult(); as res) {
      <div class="space-y-8 animate-fadeIn">
        <!-- Detection Summary Card -->
        <div class="rounded-3xl border border-[#6b4c34] bg-gradient-to-r from-[#291f16] via-[#241a12] to-[#2e2115] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
            <!-- Species Identification Banner -->
            <div class="flex items-center gap-5 w-full lg:w-auto">
              @if (res.dinosaur?.portrait_url) {
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#17100b] border-2 border-[#8c5836] p-1 shrink-0 overflow-hidden shadow-lg glow-wood">
                  <img
                    [src]="state.getPortraitUrl(res.dinosaur!.portrait_url)"
                    [alt]="res.dinosaur!.common_name"
                    class="w-full h-full object-cover rounded-xl"
                  />
                </div>
              }
              <div>
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#1e3b28] text-[#74c69d] border border-[#2d6a4f] mb-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse"></span>
                  Identificação Concluída
                </span>
                <h2 class="text-2xl sm:text-4xl font-black text-[#fceddb] tracking-tight">
                  {{ res.dinosaur?.common_name || res.prediction.predicted_slug }}
                </h2>
                @if (res.dinosaur?.fossil_profile?.scientific_name) {
                  <p class="text-sm font-semibold text-[#f4a261] italic">
                    {{ res.dinosaur!.fossil_profile!.scientific_name }}
                  </p>
                }
              </div>
            </div>

            <!-- Confidence and Top Candidates in warm frame -->
            <div class="w-full lg:w-80 bg-[#1c140e] p-4 rounded-2xl border border-[#443122] space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase font-bold text-[#a89582] tracking-wider">Certeza do Classificador</span>
                <span class="text-sm font-mono font-bold text-[#f4a261]">
                  {{ (res.prediction.confidence * 100).toFixed(1) }}%
                </span>
              </div>

              <!-- Top-3 candidate probability meters -->
              <div class="space-y-2">
                @for (cand of res.prediction.top_candidates; track cand.species_slug) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] text-[#dfd0be]">
                      <span class="truncate max-w-[160px]">{{ formatCandidateName(cand.species_slug) }}</span>
                      <span class="font-mono text-[#a89582]">{{ (cand.probability * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="h-2 w-full bg-[#2a1d14] rounded-full overflow-hidden border border-[#443122]">
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] transition-all duration-500"
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
            class="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-[#fceddb] bg-[#322317] hover:bg-[#443021] border border-[#5e412b] transition-all duration-200 cursor-pointer shadow-lg hover:shadow-amber-950/40"
          >
            <svg class="w-4 h-4 text-[#f4a261]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
