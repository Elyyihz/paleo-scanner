import { Component, computed, inject, input } from '@angular/core';
import { ComparisonReport, Dinosaur } from '../../core/models/dinosaur.model';
import { FidelityBadgeComponent } from '../../shared/components/fidelity-badge/fidelity-badge.component';
import { ScannerStateService } from '../../core/services/scanner-state.service';

/**
 * Split-view comparative matrix contrasting Paleo Pines game mechanics
 * with empirical paleontological fossil evidence in warm earthy styling.
 */
@Component({
  selector: 'app-split-view-comparison',
  standalone: true,
  imports: [FidelityBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Scientific Fidelity Overview (when report is present) -->
      @if (report(); as rep) {
        <div class="rounded-3xl border border-[#6b4c34] bg-gradient-to-r from-[#2a1e16] via-[#241912] to-[#302117] p-5 sm:p-7 shadow-xl relative overflow-hidden">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#473323] pb-5">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">Relatório Paleontológico</span>
                <span class="text-[#7d6856]">·</span>
                <span class="text-xs text-[#b8a490]">Caderno de Campo de Paleo Pines</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#fceddb]">
                Veredito Científico: <span class="text-[#f4a261]">{{ rep.verdict }}</span>
              </h3>
            </div>

            <div class="flex items-center gap-3">
              <app-fidelity-badge [percentage]="rep.fidelity_percentage" [showText]="true" />
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
            <!-- Diet Match -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1c140e] border border-[#443224]">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                [class]="rep.diet_match ? 'bg-[#1b3a26] text-[#74c69d] border border-[#2d6a4f]' : 'bg-[#3d1a16] text-[#fca5a5] border border-[#822a21]'">
                @if (rep.diet_match) {
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                } @else {
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <div>
                <span class="text-[#a89582] font-semibold">Correspondência de Dieta</span>
                <p class="text-[#fceddb] font-bold mt-0.5">
                  {{ rep.diet_match ? 'Dieta condizente com o registro fóssil' : 'Dieta divergente do fóssil real' }}
                </p>
              </div>
            </div>

            <!-- Size Comparison -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1c140e] border border-[#443224]">
              <div class="w-9 h-9 rounded-xl bg-[#3b2817] text-[#f4a261] border border-[#714d2e] flex items-center justify-center shrink-0 shadow-sm">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <span class="text-[#a89582] font-semibold">Proporção e Escala</span>
                <p class="text-[#fceddb] font-bold mt-0.5">
                  {{ rep.size_comparison_summary }}
                </p>
              </div>
            </div>

            <!-- Scientific Insights -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1c140e] border border-[#443224] sm:col-span-2 lg:col-span-1">
              <div class="w-9 h-9 rounded-xl bg-[#203625] text-[#74c69d] border border-[#2d6a4f] flex items-center justify-center shrink-0 shadow-sm">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div class="truncate">
                <span class="text-[#a89582] font-semibold">Apontamentos Críticos</span>
                <p class="text-[#fceddb] font-bold mt-0.5 truncate">
                  {{ rep.key_insights.length }} observações evolutivas
                </p>
              </div>
            </div>
          </div>

          <!-- Insights Bullet List -->
          @if (rep.key_insights.length > 0) {
            <div class="mt-4 pt-3.5 border-t border-[#473323]">
              <h4 class="text-xs uppercase font-bold text-[#e09f3e] tracking-wider mb-2">Notas do Paleontólogo:</h4>
              <ul class="space-y-1.5">
                @for (insight of rep.key_insights; track insight) {
                  <li class="flex items-start gap-2 text-xs text-[#dfd0be]">
                    <span class="text-[#f4a261] mt-0.5 font-bold">▸</span>
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
        <div class="rounded-3xl border border-[#4d6a52]/40 bg-[#221a13] p-5 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-[#443122]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#1c3a27] border border-[#2d6a4f] flex items-center justify-center text-[#74c69d] shadow-sm">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <span class="text-xs uppercase font-bold tracking-wider text-[#52b788]">No Jogo (Paleo Pines)</span>
                  <h3 class="text-xl font-bold text-[#fceddb]">{{ dino().common_name }}</h3>
                </div>
              </div>

              <!-- Biome Badge -->
              <span class="px-3 py-1 rounded-full text-xs font-bold border shadow-sm" [class]="biomeBadgeClass()">
                {{ dino().game_profile.biome }}
              </span>
            </div>

            <!-- In-game traits list -->
            <div class="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Dieta no Rancho</span>
                <span class="font-bold text-[#fceddb] text-sm">{{ dino().game_profile.diet }}</span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Sabor Favorito de Poppin</span>
                <span class="font-bold text-[#f4a261] text-sm">🍬 {{ dino().game_profile.poppin_favorite }}</span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Habilidade Selvagem</span>
                <span class="font-bold text-[#74c69d] text-sm">🌿 {{ dino().game_profile.wild_skill }}</span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Habilidade na Fazenda</span>
                <span class="font-bold text-[#e09f3e] text-sm">🚜 {{ dino().game_profile.farm_skill }}</span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Porte / Tamanho</span>
                <span class="font-bold text-[#fceddb] text-sm">{{ dino().game_profile.size_category }}</span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Montável com Sela?</span>
                <span class="font-bold text-sm" [class]="dino().game_profile.is_rideable ? 'text-[#74c69d]' : 'text-[#a89582]'">
                  {{ dino().game_profile.is_rideable ? '✓ Sim, Montável' : '✗ Não Montável' }}
                </span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Área do Cercado</span>
                <span class="font-mono font-bold text-[#fceddb] text-sm">{{ dino().game_profile.pen_area_m2 }} m²</span>
              </div>

              <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                <span class="text-[#a89582] block mb-0.5">Sociabilidade</span>
                <span class="font-bold text-[#fceddb] text-sm">{{ dino().game_profile.social }}</span>
              </div>
            </div>

            <!-- Friendcall note -->
            @if (dino().game_profile.friendcall) {
              <div class="mt-4 p-3.5 rounded-2xl bg-[#1a120c] border border-[#3e2c1e] text-xs">
                <span class="text-[#a89582] font-semibold block mb-1">Notas de Chamado (Flauta):</span>
                <span class="font-mono text-[#f4a261]">{{ dino().game_profile.friendcall }}</span>
              </div>
            }
          </div>

          <div class="mt-6 pt-3 border-t border-[#443122] text-[11px] text-[#8a7664] italic">
            Dados extraídos diretamente do Database oficial e mecânicas de Paleo Pines.
          </div>
        </div>

        <!-- RIGHT: Real Fossil Paleontology Profile -->
        <div class="rounded-3xl border border-[#7d5b3d]/40 bg-[#221a13] p-5 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            @if (dino().fossil_profile; as fossil) {
              <!-- Header -->
              <div class="flex items-center justify-between pb-4 border-b border-[#443122]">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#3d2716] border border-[#6b4527] flex items-center justify-center text-[#f4a261] shadow-sm">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                      <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                      <path d="M2 18l4-4"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-xs uppercase font-bold tracking-wider text-[#f4a261]">Paleontologia Real</span>
                    <h3 class="text-xl font-bold text-[#fceddb] italic">{{ fossil.scientific_name }}</h3>
                  </div>
                </div>

                <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#382717] text-[#f4a261] border border-[#614227]">
                  {{ fossil.geological_period }}
                </span>
              </div>

              <!-- Scientific attributes -->
              <div class="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                  <span class="text-[#a89582] block mb-0.5">Família Taxonômica</span>
                  <span class="font-bold text-[#fceddb] text-sm">{{ fossil.taxonomy_family }}</span>
                </div>

                <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                  <span class="text-[#a89582] block mb-0.5">Datação Geológica</span>
                  <span class="font-mono font-bold text-[#f4a261] text-sm">{{ fossil.approximate_mya }}</span>
                </div>

                <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                  <span class="text-[#a89582] block mb-0.5">Comprimento Real</span>
                  <span class="font-mono font-bold text-[#fceddb] text-sm">{{ fossil.length_meters }} metros</span>
                </div>

                <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e]">
                  <span class="text-[#a89582] block mb-0.5">Massa Corpórea Fóssil</span>
                  <span class="font-mono font-bold text-[#fceddb] text-sm">{{ formatMass(fossil.mass_kg) }}</span>
                </div>

                <div class="p-3 rounded-2xl bg-[#1a120c] border border-[#3e2c1e] col-span-2">
                  <span class="text-[#a89582] block mb-0.5">Dieta Paleontológica Real</span>
                  <span class="font-bold text-[#fceddb] text-sm">{{ fossil.real_diet }}</span>
                </div>
              </div>

              <!-- Distinctive features -->
              <div class="mt-4 p-3.5 rounded-2xl bg-[#1a120c] border border-[#3e2c1e] text-xs">
                <span class="text-[#f4a261] font-bold block mb-1">Morfologia & Características:</span>
                <p class="text-[#dfd0be] leading-relaxed">{{ fossil.distinctive_features }}</p>
              </div>

              <!-- Fossil locations chips -->
              @if (fossil.fossil_locations.length > 0) {
                <div class="mt-4">
                  <span class="text-[11px] uppercase font-bold text-[#a89582] tracking-wider block mb-1.5">Locais com Fósseis Descobertos:</span>
                  <div class="flex flex-wrap gap-1.5">
                    @for (loc of fossil.fossil_locations; track loc) {
                      <span class="px-2.5 py-0.5 rounded-lg bg-[#2e2117] text-[#dfd0be] text-[11px] border border-[#4f3827]">
                        📍 {{ loc }}
                      </span>
                    }
                  </div>
                </div>
              }
            } @else {
              <div class="flex flex-col items-center justify-center py-12 text-center text-[#a89582]">
                <svg class="w-12 h-12 text-[#634f3f] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h4 class="text-base font-bold text-[#fceddb]">Perfil Fóssil Não Catalogado</h4>
                <p class="text-xs max-w-sm mt-1 text-[#a89582]">
                  Ainda não há registro fóssil detalhado para este táxon no banco de dados.
                </p>
              </div>
            }
          </div>

          <div class="mt-6 pt-3 border-t border-[#443122] text-[11px] text-[#8a7664] italic">
            Taxonomia alinhada aos compêndios científicos da Paleobiology Database.
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
      return 'bg-[#1b3d28] text-[#74c69d] border-[#2d6a4f]';
    }
    if (biome.includes('ariacotta') || biome.includes('desert')) {
      return 'bg-[#422915] text-[#f4a261] border-[#7a4c25]';
    }
    return 'bg-[#193a38] text-[#5eead4] border-[#134e4a]';
  });

  public formatMass(kg: number): string {
    if (kg >= 1000) {
      const tons = (kg / 1000).toFixed(1);
      return `${tons} toneladas (${kg.toLocaleString('pt-BR')} kg)`;
    }
    return `${kg.toLocaleString('pt-BR')} kg`;
  }
}
