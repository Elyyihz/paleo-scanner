import { Component, computed, inject, input, signal } from '@angular/core';
import { ComparisonReport, Dinosaur } from '../../core/models/dinosaur.model';
import { VisualTriptychComponent } from './visual-triptych/visual-triptych.component';
import { GeologicalTimelineComponent } from './geological-timeline/geological-timeline.component';
import { SizeScaleComparisonComponent } from './size-scale-comparison/size-scale-comparison.component';
import { FidelityGaugeComponent } from './fidelity-gauge/fidelity-gauge.component';
import { FidelityBadgeComponent } from '../../shared/components/fidelity-badge/fidelity-badge.component';
import { ScannerStateService } from '../../core/services/scanner-state.service';

/**
 * Advanced comparative matrix contrasting Paleo Pines game mechanics
 * with empirical paleontological fossil evidence using visual triptychs,
 * circular fidelity gauge, geological timeline, and scale comparison tools.
 */
@Component({
  selector: 'app-split-view-comparison',
  standalone: true,
  host: { class: 'block w-full' },
  imports: [
    VisualTriptychComponent,
    GeologicalTimelineComponent,
    SizeScaleComparisonComponent,
    FidelityGaugeComponent,
    FidelityBadgeComponent,
  ],
  template: `
    <div class="flex flex-col gap-8 animate-fadeIn">
      <!-- 1. STANDARDIZED VISUAL TRIPTYCH (Game vs Real Fossil vs Life Paleoart) -->
      <app-visual-triptych [dino]="dino()" />

      <!-- 2. ANALYTICAL CHARTS & COMPARATIVES GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Circular Fidelity HUD Gauge -->
        @if (report(); as rep) {
          <div class="lg:col-span-1">
            <app-fidelity-gauge
              [percentage]="rep.fidelity_percentage"
              [verdict]="rep.verdict"
              [dietMatch]="rep.diet_match"
            />
          </div>
        }

        <!-- Geological Timeline Chart -->
        <div [class]="report() ? 'lg:col-span-2' : 'lg:col-span-3'">
          <app-geological-timeline [fossil]="dino().fossil_profile" />
        </div>
      </div>

      <!-- 3. INTERACTIVE SCALE COMPARISON TOOL -->
      <app-size-scale-comparison
        [fossil]="dino().fossil_profile"
        [dinoName]="dino().common_name"
      />

      <!-- 4. SIDE-BY-SIDE MATRIX WITH CENTRAL CORRELATION NODES -->
      <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2633] pb-4">
          <div>
            <span class="text-xs uppercase font-mono tracking-wider text-[#c8873a] font-bold">[MATRIZ COMPARATIVA]</span>
            <h3 class="text-xl sm:text-2xl font-black text-[#ebe6dc]">
              Mecânicas de Jogo vs Fatos Paleontológicos
            </h3>
          </div>

          <div class="flex items-center gap-3">
            @if (report(); as rep) {
              <app-fidelity-badge [percentage]="rep.fidelity_percentage" />
            }
          </div>

          <!-- Mobile Tab Toggles -->
          <div class="flex md:hidden p-0.5 rounded-md bg-[#0c1015] border border-[#222d3a] text-xs font-mono font-bold" role="tablist">
            <button
              type="button"
              (click)="mobileTab.set('both')"
              class="px-3 py-1 rounded transition-all"
              [class]="mobileTab() === 'both' ? 'bg-[#1e293b] text-white' : 'text-[#94a3b8]'"
            >
              Ambos
            </button>
            <button
              type="button"
              (click)="mobileTab.set('game')"
              class="px-3 py-1 rounded transition-all"
              [class]="mobileTab() === 'game' ? 'bg-[#143322] text-[#4ade80]' : 'text-[#94a3b8]'"
            >
              Jogo
            </button>
            <button
              type="button"
              (click)="mobileTab.set('real')"
              class="px-3 py-1 rounded transition-all"
              [class]="mobileTab() === 'real' ? 'bg-[#332010] text-[#fcd34d]' : 'text-[#94a3b8]'"
            >
              Fóssil
            </button>
          </div>
        </div>

        <!-- 3-Column Comparison (Game | Connection Nodes | Real Fossil) -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_54px_1fr] gap-4 sm:gap-6 items-start">
          <!-- LEFT: GAME ATTRIBUTES -->
          @if (mobileTab() === 'both' || mobileTab() === 'game') {
            <div class="rounded border border-[#1b3a26] bg-[#0e1612] p-4 sm:p-5 flex flex-col">
              <div class="flex items-center justify-between min-h-[46px] pb-3 border-b border-[#1b3a26] mb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded bg-[#143322] border border-[#1e5033] flex items-center justify-center text-[#4ade80]">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-sm sm:text-base text-[#4ade80]">No Jogo (Paleo Pines)</h4>
                </div>
                <span class="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border whitespace-nowrap shrink-0" [class]="biomeBadgeClass()">
                  {{ dino().game_profile.biome }}
                </span>
              </div>

              <!-- Comparison Rows Game -->
              <div class="flex flex-col gap-2.5 text-xs font-mono">
                <!-- Row 1: Biome / Environment -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0a0f0d] border border-[#1b3a26] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#86efac] block text-[10px] sm:text-[11px] font-semibold">BIOMA / HÁBITAT:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">{{ dino().game_profile.biome }}</span>
                </div>

                <!-- Row 2: Diet -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0a0f0d] border border-[#1b3a26] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#86efac] block text-[10px] sm:text-[11px] font-semibold">DIETA & POPPIN FAVORITO:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    {{ dino().game_profile.diet }} (Sabor {{ dino().game_profile.poppin_favorite }})
                  </span>
                </div>

                <!-- Row 3: Social -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0a0f0d] border border-[#1b3a26] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#86efac] block text-[10px] sm:text-[11px] font-semibold">SOCIABILIDADE:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    {{ dino().game_profile.social === 'Pack' ? 'Bando (Pack)' : dino().game_profile.social === 'Herd' ? 'Manada (Herd)' : 'Solitário (Loner)' }}
                  </span>
                </div>

                <!-- Row 4: Skills -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0a0f0d] border border-[#1b3a26] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#86efac] block text-[10px] sm:text-[11px] font-semibold">HABILIDADES NO RANCHO:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    {{ dino().game_profile.farm_skill }} · {{ dino().game_profile.wild_skill }}
                  </span>
                </div>

                <!-- Row 5: Size & Riding -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0a0f0d] border border-[#1b3a26] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#86efac] block text-[10px] sm:text-[11px] font-semibold">PORTE & SELA:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    Porte {{ dino().game_profile.size_category }} · {{ dino().game_profile.is_rideable ? 'Montável' : 'Não montável' }}
                  </span>
                </div>
              </div>
            </div>
          }

          <!-- MIDDLE: CORRELATION CONNECTION NODES -->
          <div class="hidden md:flex flex-col pt-4 sm:pt-5" aria-hidden="true">
            <!-- Header spacer to align arrows with attribute rows -->
            <div class="min-h-[46px] pb-3 border-b border-transparent mb-3"></div>
            <div class="flex flex-col gap-2.5">
              <div class="h-[76px] sm:h-[82px] flex items-center justify-center">
                <div class="conn-node text-[#c8873a]" title="Correspondência de Hábitat">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </div>
              </div>
              <div class="h-[76px] sm:h-[82px] flex items-center justify-center">
                <div class="conn-node text-[#c8873a]" title="Correspondência de Dieta">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </div>
              </div>
              <div class="h-[76px] sm:h-[82px] flex items-center justify-center">
                <div class="conn-node text-[#c8873a]" title="Correlação Evolutiva">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </div>
              </div>
              <div class="h-[76px] sm:h-[82px] flex items-center justify-center">
                <div class="conn-node text-[#c8873a]" title="Adaptações Biológicas">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </div>
              </div>
              <div class="h-[76px] sm:h-[82px] flex items-center justify-center">
                <div class="conn-node text-[#c8873a]" title="Proporção Anatômica">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: REAL FOSSIL EVIDENCE -->
          @if (mobileTab() === 'both' || mobileTab() === 'real') {
            <div class="rounded border border-[#3a2c1b] bg-[#16120e] p-4 sm:p-5 flex flex-col">
              <div class="flex items-center justify-between min-h-[46px] pb-3 border-b border-[#3a2c1b] mb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded bg-[#332010] border border-[#6b3d16] flex items-center justify-center text-[#fcd34d]">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                      <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-sm sm:text-base text-[#fcd34d]">Lado Real (Paleontologia)</h4>
                </div>
                <span class="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#332010] text-[#fcd34d] border border-[#6b3d16] whitespace-nowrap shrink-0">
                  {{ dino().fossil_profile?.geological_period || 'Registro Fóssil' }}
                </span>
              </div>

              <!-- Comparison Rows Real -->
              <div class="flex flex-col gap-2.5 text-xs font-mono">
                <!-- Row 1: Real Formations & Locations -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0f0c09] border border-[#3a2c1b] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#fde68a] block text-[10px] sm:text-[11px] font-semibold">FORMAÇÕES & LOCAIS FÓSSEIS:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm line-clamp-2">
                    {{ dino().fossil_profile?.fossil_locations?.join(', ') || 'Morrison, Hell Creek, Tendaguru' }}
                  </span>
                </div>

                <!-- Row 2: Real Diet -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0f0c09] border border-[#3a2c1b] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#fde68a] block text-[10px] sm:text-[11px] font-semibold">DIETA FÓSSIL COMPROVADA:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    {{ dino().fossil_profile?.real_diet }} (Dentição e coprólitos)
                  </span>
                </div>

                <!-- Row 3: Taxonomy & Epoch -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0f0c09] border border-[#3a2c1b] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#fde68a] block text-[10px] sm:text-[11px] font-semibold">CLADO & DATAÇÃO REAL:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    Família {{ dino().fossil_profile?.taxonomy_family }} · {{ dino().fossil_profile?.approximate_mya }}
                  </span>
                </div>

                <!-- Row 4: Anatomical Distinctive Features -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0f0c09] border border-[#3a2c1b] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#fde68a] block text-[10px] sm:text-[11px] font-semibold">ADAPTAÇÕES DISTINTIVAS:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm line-clamp-2">
                    {{ dino().fossil_profile?.distinctive_features }}
                  </span>
                </div>

                <!-- Row 5: Real Dimensions -->
                <div class="p-2.5 sm:p-3 rounded bg-[#0f0c09] border border-[#3a2c1b] h-[76px] sm:h-[82px] flex flex-col justify-center">
                  <span class="text-[#fde68a] block text-[10px] sm:text-[11px] font-semibold">DIMENSÕES CORPÓREAS:</span>
                  <span class="font-bold text-[#ebe6dc] text-xs sm:text-sm">
                    ~{{ dino().fossil_profile?.length_meters }} m de comprimento · ~{{ dino().fossil_profile?.mass_kg?.toLocaleString() }} kg
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- 5. CRITICAL INSIGHTS TELEMETRY (When comparison report is available) -->
      @if (report(); as rep) {
        @if (rep.key_insights.length > 0) {
          <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-sm space-y-3">
            <h4 class="text-xs uppercase font-mono font-bold text-[#c8873a] tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-[#c8873a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>[ANÁLISE & NOTAS PALEONTOLÓGICAS]</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              @for (insight of rep.key_insights; track insight) {
                <div class="p-3 rounded bg-[#0c1015] border border-[#222d3a] flex items-start gap-2.5 text-xs font-mono text-[#94a3b8]">
                  <span class="text-[#c8873a] font-bold text-base leading-none">▸</span>
                  <span class="leading-relaxed text-[#d6d0c4]">{{ insight }}</span>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `
})
export class SplitViewComparisonComponent {
  public readonly dinosaur = input.required<Dinosaur>();
  public readonly report = input<ComparisonReport | null>(null);

  public readonly state = inject(ScannerStateService);
  public readonly mobileTab = signal<'both' | 'game' | 'real'>('both');

  public readonly dino = computed(() => this.dinosaur());

  public readonly biomeBadgeClass = computed(() => {
    const biome = this.dino().game_profile.biome.toLowerCase();
    switch (biome) {
      case 'valley':
        return 'bg-[#062c20] text-[#34d399] border-[#0d6b4a]';
      case 'forest':
        return 'bg-[#042f2e] text-[#2dd4bf] border-[#0f766e]';
      case 'desert':
        return 'bg-[#291e0a] text-[#fcd34d] border-[#78350f]';
      default:
        return 'bg-[#0c2e42] text-[#38bdf8] border-[#0369a1]';
    }
  });
}
