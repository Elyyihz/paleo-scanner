import { Component, computed, inject, input } from '@angular/core';
import { ComparisonReport, Dinosaur } from '../../core/models/dinosaur.model';
import { FidelityBadgeComponent } from '../../shared/components/fidelity-badge/fidelity-badge.component';
import { ScannerStateService } from '../../core/services/scanner-state.service';

/**
 * Split-view comparative matrix contrasting Paleo Pines game mechanics
 * with empirical paleontological fossil evidence.
 */
@Component({
  selector: 'app-split-view-comparison',
  standalone: true,
  imports: [FidelityBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Scientific Fidelity Overview (when report is present) -->
      @if (report(); as rep) {
        <div class="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs uppercase tracking-wider text-cyan-400 font-bold">Relatório de Precisão Científica</span>
                <span class="text-slate-600">·</span>
                <span class="text-xs text-slate-400">MobileNetV3 + Fóssil Gateway</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white">
                Veredito Paleontológico: <span class="text-cyan-300">{{ rep.verdict }}</span>
              </h3>
            </div>

            <div class="flex items-center gap-3">
              <app-fidelity-badge [percentage]="rep.fidelity_percentage" [showText]="true" />
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
            <!-- Diet Match -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                [class]="rep.diet_match ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'">
                @if (rep.diet_match) {
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                } @else {
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <div>
                <span class="text-slate-400 font-medium">Correspondência de Dieta</span>
                <p class="text-slate-200 font-semibold mt-0.5">
                  {{ rep.diet_match ? 'Dieta condizente com o registro fóssil' : 'Dieta divergente do fóssil real' }}
                </p>
              </div>
            </div>

            <!-- Size Comparison -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div class="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <span class="text-slate-400 font-medium">Proporção e Escala</span>
                <p class="text-slate-200 font-semibold mt-0.5">
                  {{ rep.size_comparison_summary }}
                </p>
              </div>
            </div>

            <!-- Scientific Insights -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 sm:col-span-2 lg:col-span-1">
              <div class="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div class="truncate">
                <span class="text-slate-400 font-medium">Insights Registrados</span>
                <p class="text-slate-200 font-semibold mt-0.5 truncate">
                  {{ rep.key_insights.length }} apontamento(s) críticos de biologia
                </p>
              </div>
            </div>
          </div>

          <!-- Insights Bullet List -->
          @if (rep.key_insights.length > 0) {
            <div class="mt-4 pt-3 border-t border-slate-800/60">
              <h4 class="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Notas Críticas de Biologia Evolutiva:</h4>
              <ul class="space-y-1.5">
                @for (insight of rep.key_insights; track insight) {
                  <li class="flex items-start gap-2 text-xs text-slate-300">
                    <span class="text-cyan-400 mt-0.5">▸</span>
                    <span>{{ insight }}</span>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      }

      <!-- Side-by-Side Comparison Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Paleo Pines In-Game Profile -->
        <div class="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-5 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <span class="text-xs uppercase font-bold tracking-wider text-emerald-400">Paleo Pines</span>
                  <h3 class="text-lg font-bold text-white">{{ dino().common_name }}</h3>
                </div>
              </div>

              <!-- Biome Badge -->
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold border" [class]="biomeBadgeClass()">
                {{ dino().game_profile.biome }}
              </span>
            </div>

            <!-- In-game traits list -->
            <div class="mt-5 grid grid-cols-2 gap-3.5 text-xs">
              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Dieta no Jogo</span>
                <span class="font-bold text-slate-100 text-sm">{{ dino().game_profile.diet }}</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Sabor Favorito de Poppin</span>
                <span class="font-bold text-amber-300 text-sm">🍬 {{ dino().game_profile.poppin_favorite }}</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Habilidade Selvagem</span>
                <span class="font-bold text-cyan-300 text-sm">🌿 {{ dino().game_profile.wild_skill }}</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Habilidade na Fazenda</span>
                <span class="font-bold text-blue-300 text-sm">🚜 {{ dino().game_profile.farm_skill }}</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Categoria de Tamanho</span>
                <span class="font-bold text-slate-100 text-sm">{{ dino().game_profile.size_category }}</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Montável com Sela?</span>
                <span class="font-bold text-sm" [class]="dino().game_profile.is_rideable ? 'text-emerald-400' : 'text-slate-400'">
                  {{ dino().game_profile.is_rideable ? '✓ Sim, Montável' : '✗ Não Montável' }}
                </span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Área de Cercado Mínima</span>
                <span class="font-mono font-bold text-slate-100 text-sm">{{ dino().game_profile.pen_area_m2 }} m²</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span class="text-slate-400 block mb-0.5">Sociabilidade</span>
                <span class="font-bold text-slate-100 text-sm">{{ dino().game_profile.social }}</span>
              </div>
            </div>

            <!-- Friendcall note -->
            @if (dino().game_profile.friendcall) {
              <div class="mt-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
                <span class="text-slate-400 font-medium block mb-1">Notas de Chamado (Flauta):</span>
                <span class="font-mono text-cyan-300">{{ dino().game_profile.friendcall }}</span>
              </div>
            }
          </div>

          <div class="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic">
            Dados extraídos diretamente do Database v3.0.3 e mecânicas de Paleo Pines.
          </div>
        </div>

        <!-- RIGHT: Real Fossil Paleontology Profile -->
        <div class="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            @if (dino().fossil_profile; as fossil) {
              <!-- Header -->
              <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                      <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                      <path d="M2 18l4-4"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-xs uppercase font-bold tracking-wider text-cyan-400">Paleontologia Real</span>
                    <h3 class="text-lg font-bold text-white italic">{{ fossil.scientific_name }}</h3>
                  </div>
                </div>

                <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                  {{ fossil.geological_period }}
                </span>
              </div>

              <!-- Scientific attributes -->
              <div class="mt-5 grid grid-cols-2 gap-3.5 text-xs">
                <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span class="text-slate-400 block mb-0.5">Família Taxonômica</span>
                  <span class="font-bold text-slate-100 text-sm">{{ fossil.taxonomy_family }}</span>
                </div>

                <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span class="text-slate-400 block mb-0.5">Datação Geológica</span>
                  <span class="font-mono font-bold text-cyan-300 text-sm">{{ fossil.approximate_mya }}</span>
                </div>

                <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span class="text-slate-400 block mb-0.5">Comprimento Estimado</span>
                  <span class="font-mono font-bold text-slate-100 text-sm">{{ fossil.length_meters }} metros</span>
                </div>

                <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span class="text-slate-400 block mb-0.5">Massa Corpórea Real</span>
                  <span class="font-mono font-bold text-slate-100 text-sm">{{ formatMass(fossil.mass_kg) }}</span>
                </div>

                <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 col-span-2">
                  <span class="text-slate-400 block mb-0.5">Dieta Paleontológica Real</span>
                  <span class="font-bold text-slate-100 text-sm">{{ fossil.real_diet }}</span>
                </div>
              </div>

              <!-- Distinctive features -->
              <div class="mt-4 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
                <span class="text-slate-400 font-bold block mb-1">Morfologia & Características Distintivas:</span>
                <p class="text-slate-300 leading-relaxed">{{ fossil.distinctive_features }}</p>
              </div>

              <!-- Fossil locations chips -->
              @if (fossil.fossil_locations.length > 0) {
                <div class="mt-4">
                  <span class="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Locais com Fósseis Encontrados:</span>
                  <div class="flex flex-wrap gap-1.5">
                    @for (loc of fossil.fossil_locations; track loc) {
                      <span class="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[11px] border border-slate-700/60">
                        📍 {{ loc }}
                      </span>
                    }
                  </div>
                </div>
              }
            } @else {
              <!-- Fallback when no curated fossil record is registered -->
              <div class="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <svg class="w-12 h-12 text-slate-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h4 class="text-base font-bold text-slate-200">Perfil Fóssil Não Catalogado</h4>
                <p class="text-xs max-w-sm mt-1 text-slate-400">
                  Ainda não há registro fóssil detalhado para este táxon no banco de dados.
                </p>
              </div>
            }
          </div>

          <div class="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic">
            Taxonomia alinhada aos artigos de referência e compêndios da Paleobiology Database.
          </div>
        </div>
      </div>
    </div>
  `
})
export class SplitViewComparisonComponent {
  private readonly state = inject(ScannerStateService);

  public readonly dinosaur = input.required<Dinosaur>();
  public readonly report = input<ComparisonReport | null>(null);

  public readonly dino = computed(() => this.dinosaur());

  public readonly biomeBadgeClass = computed(() => {
    const biome = this.dino().game_profile.biome.toLowerCase();
    if (biome.includes('dapplewood') || biome.includes('forest')) {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
    }
    if (biome.includes('ariacotta') || biome.includes('desert')) {
      return 'bg-amber-950/70 text-amber-300 border-amber-800/60';
    }
    return 'bg-teal-950/70 text-teal-300 border-teal-800/60';
  });

  /**
   * Formats numeric kilogram mass into human readable metric tons or kilograms.
   *
   * @param kg - Mass in kilograms.
   * @returns Formatted mass string.
   */
  public formatMass(kg: number): string {
    if (kg >= 1000) {
      const tons = (kg / 1000).toFixed(1);
      return `${tons} toneladas (${kg.toLocaleString('pt-BR')} kg)`;
    }
    return `${kg.toLocaleString('pt-BR')} kg`;
  }
}
