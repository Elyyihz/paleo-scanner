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
  imports: [
    VisualTriptychComponent,
    GeologicalTimelineComponent,
    SizeScaleComparisonComponent,
    FidelityGaugeComponent,
    FidelityBadgeComponent,
  ],
  template: `
    <div class="space-y-8 animate-fadeIn">
      <!-- 1. VISUAL TRIPTYCH (3 Photos: Game vs Real Fossil vs Life Paleoart) -->
      <app-visual-triptych [dino]="dino()" />

      <!-- 2. ANALYTICAL CHARTS & COMPARATIVES GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Circular Fidelity Gauge -->
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
      <div class="rounded-3xl border border-[#543b27] bg-[#1d140e] p-5 sm:p-7 shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3e2b1d] pb-4">
          <div>
            <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">Matriz Comparativa Direta</span>
            <h3 class="text-xl sm:text-2xl font-black text-[#fceddb]">
              Mecânicas de Jogo vs Fatos Paleontológicos
            </h3>
          </div>

          <div class="flex items-center gap-3">
            @if (report(); as rep) {
              <app-fidelity-badge [percentage]="rep.fidelity_percentage" />
            }
          </div>

          <!-- Mobile Tab Toggles -->
          <div class="flex md:hidden p-1 rounded-xl bg-[#2a1c12] border border-[#443021] text-xs font-bold" role="tablist">
            <button
              type="button"
              (click)="mobileTab.set('both')"
              class="px-3 py-1 rounded-lg transition-all"
              [class]="mobileTab() === 'both' ? 'bg-[#f4a261] text-[#16110c]' : 'text-[#dfd0be]'"
            >
              Ambos
            </button>
            <button
              type="button"
              (click)="mobileTab.set('game')"
              class="px-3 py-1 rounded-lg transition-all"
              [class]="mobileTab() === 'game' ? 'bg-[#52b788] text-[#16110c]' : 'text-[#dfd0be]'"
            >
              Jogo
            </button>
            <button
              type="button"
              (click)="mobileTab.set('real')"
              class="px-3 py-1 rounded-lg transition-all"
              [class]="mobileTab() === 'real' ? 'bg-[#f4a261] text-[#16110c]' : 'text-[#dfd0be]'"
            >
              Fóssil
            </button>
          </div>
        </div>

        <!-- 3-Column Comparison (Game | Connection Nodes | Real Fossil) -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_54px_1fr] gap-4 sm:gap-6 items-stretch">
          <!-- LEFT: GAME ATTRIBUTES -->
          @if (mobileTab() === 'both' || mobileTab() === 'game') {
            <div class="rounded-2xl border border-[#3e5643] bg-[#162118] p-5 flex flex-col justify-between space-y-4 shadow-md">
              <div class="flex items-center justify-between pb-3 border-b border-[#2b4432]">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-[#14301f] border border-[#2d6a4f] flex items-center justify-center text-[#74c69d]">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-sm sm:text-base text-[#74c69d]">Lado do Jogo (Paleo Pines)</h4>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border" [class]="biomeBadgeClass()">
                  {{ dino().game_profile.biome }}
                </span>
              </div>

              <!-- Comparison Rows Game -->
              <div class="space-y-3.5 text-xs">
                <!-- Row 1: Biome / Environment -->
                <div class="p-3 rounded-xl bg-[#0f1811] border border-[#233a2a]">
                  <span class="text-[#7ea68c] block text-[11px] font-semibold">Bioma / Hábitat:</span>
                  <span class="font-bold text-[#fceddb] text-sm">{{ dino().game_profile.biome }}</span>
                </div>

                <!-- Row 2: Diet -->
                <div class="p-3 rounded-xl bg-[#0f1811] border border-[#233a2a]">
                  <span class="text-[#7ea68c] block text-[11px] font-semibold">Dieta & Poppin Favorito:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    {{ dino().game_profile.diet }} (Sabor {{ dino().game_profile.poppin_favorite }})
                  </span>
                </div>

                <!-- Row 3: Social -->
                <div class="p-3 rounded-xl bg-[#0f1811] border border-[#233a2a]">
                  <span class="text-[#7ea68c] block text-[11px] font-semibold">Sociabilidade / Comportamento:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    {{ dino().game_profile.social === 'Pack' ? 'Bando (Pack)' : dino().game_profile.social === 'Herd' ? 'Manada (Herd)' : 'Solitário (Loner)' }}
                  </span>
                </div>

                <!-- Row 4: Skills -->
                <div class="p-3 rounded-xl bg-[#0f1811] border border-[#233a2a]">
                  <span class="text-[#7ea68c] block text-[11px] font-semibold">Habilidades Rancho & Selvagem:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    {{ dino().game_profile.farm_skill }} · {{ dino().game_profile.wild_skill }}
                  </span>
                </div>

                <!-- Row 5: Size & Riding -->
                <div class="p-3 rounded-xl bg-[#0f1811] border border-[#233a2a]">
                  <span class="text-[#7ea68c] block text-[11px] font-semibold">Porte & Montaria:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    Porte {{ dino().game_profile.size_category }} · {{ dino().game_profile.is_rideable ? 'Montável com sela' : 'Não montável' }}
                  </span>
                </div>
              </div>
            </div>
          }

          <!-- MIDDLE: CORRELATION CONNECTION NODES -->
          <div class="hidden md:flex flex-col items-center justify-around py-16" aria-hidden="true">
            <!-- Node 1: Habitat -->
            <div class="conn-node text-[#f4a261]" title="Correspondência de Hábitat">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>

            <!-- Node 2: Diet -->
            <div class="conn-node text-[#f4a261]" title="Correspondência de Dieta">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>

            <!-- Node 3: Social & Epoch -->
            <div class="conn-node text-[#f4a261]" title="Correlação Evolutiva">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>

            <!-- Node 4: Adaptations -->
            <div class="conn-node text-[#f4a261]" title="Adaptações Biológicas">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>

            <!-- Node 5: Scale -->
            <div class="conn-node text-[#f4a261]" title="Proporção Anatômica">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>
          </div>

          <!-- RIGHT: REAL FOSSIL EVIDENCE -->
          @if (mobileTab() === 'both' || mobileTab() === 'real') {
            <div class="rounded-2xl border border-[#6b4527] bg-[#22160d] p-5 flex flex-col justify-between space-y-4 shadow-md">
              <div class="flex items-center justify-between pb-3 border-b border-[#442c19]">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-[#382314] border border-[#6e4626] flex items-center justify-center text-[#f4a261]">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                      <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-sm sm:text-base text-[#f4a261]">Lado Real (Paleontologia)</h4>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#382314] text-[#f4a261] border border-[#6e4626]">
                  {{ dino().fossil_profile?.geological_period || 'Registro Fóssil' }}
                </span>
              </div>

              <!-- Comparison Rows Real -->
              <div class="space-y-3.5 text-xs">
                <!-- Row 1: Real Formations & Locations -->
                <div class="p-3 rounded-xl bg-[#140c07] border border-[#3a2515]">
                  <span class="text-[#c49a78] block text-[11px] font-semibold">Formações Geológicas & Locais:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    {{ dino().fossil_profile?.fossil_locations?.join(', ') || 'Morrison, Hell Creek, Tendaguru' }}
                  </span>
                </div>

                <!-- Row 2: Real Diet -->
                <div class="p-3 rounded-xl bg-[#140c07] border border-[#3a2515]">
                  <span class="text-[#c49a78] block text-[11px] font-semibold">Dieta Fóssil Comprovada:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    {{ dino().fossil_profile?.real_diet }} (Dentição e coprólitos sedimentares)
                  </span>
                </div>

                <!-- Row 3: Taxonomy & Epoch -->
                <div class="p-3 rounded-xl bg-[#140c07] border border-[#3a2515]">
                  <span class="text-[#c49a78] block text-[11px] font-semibold">Família & Datação Real:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    Família {{ dino().fossil_profile?.taxonomy_family }} · {{ dino().fossil_profile?.approximate_mya }}
                  </span>
                </div>

                <!-- Row 4: Anatomical Distinctive Features -->
                <div class="p-3 rounded-xl bg-[#140c07] border border-[#3a2515]">
                  <span class="text-[#c49a78] block text-[11px] font-semibold">Adaptações Fósseis Distintivas:</span>
                  <span class="font-bold text-[#fceddb] text-sm line-clamp-2">
                    {{ dino().fossil_profile?.distinctive_features }}
                  </span>
                </div>

                <!-- Row 5: Real Dimensions -->
                <div class="p-3 rounded-xl bg-[#140c07] border border-[#3a2515]">
                  <span class="text-[#c49a78] block text-[11px] font-semibold">Comprimento & Massa Fóssil:</span>
                  <span class="font-bold text-[#fceddb] text-sm">
                    ~{{ dino().fossil_profile?.length_meters }} m de comprimento · ~{{ dino().fossil_profile?.mass_kg?.toLocaleString() }} kg
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- 5. CRITICAL INSIGHTS LIST (When comparison report is available) -->
      @if (report(); as rep) {
        @if (rep.key_insights.length > 0) {
          <div class="rounded-3xl border border-[#6b4c34] bg-gradient-to-r from-[#2a1d13] via-[#23180f] to-[#2c1e14] p-5 sm:p-7 shadow-xl space-y-3">
            <h4 class="text-xs uppercase font-black text-[#f4a261] tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-[#e09f3e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Notas do Paleontólogo de Campo</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              @for (insight of rep.key_insights; track insight) {
                <div class="p-3.5 rounded-2xl bg-[#170e08] border border-[#442d1b] flex items-start gap-2.5 text-xs text-[#dfd0be]">
                  <span class="text-[#f4a261] font-bold text-base leading-none">▸</span>
                  <span class="leading-relaxed">{{ insight }}</span>
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
        return 'bg-[#1e3b28] text-[#74c69d] border-[#2d6a4f]';
      case 'forest':
        return 'bg-[#2d4a22] text-[#95d5b2] border-[#40916c]';
      case 'desert':
        return 'bg-[#4a3518] text-[#f4a261] border-[#7d5624]';
      default:
        return 'bg-[#291c13] text-[#dfd0be] border-[#443021]';
    }
  });
}
