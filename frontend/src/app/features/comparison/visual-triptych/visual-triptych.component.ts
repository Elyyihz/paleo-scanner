import { Component, computed, inject, input, signal } from '@angular/core';
import { Dinosaur } from '../../../core/models/dinosaur.model';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

interface ZoomedSpecimen {
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  telemetry: string;
}

/**
 * High-tech standardized specimen triptych displaying uncropped images:
 * 1. In-game 3D rendering (Paleo Pines)
 * 2. Excavated fossil skeleton / museum mount (Photograph)
 * 3. Life restoration biological paleoart (Scientific Illustration)
 */
@Component({
  selector: 'app-visual-triptych',
  standalone: true,
  template: `
    <div class="rounded-3xl border border-[#174463] bg-[#0a2030] p-5 sm:p-7 shadow-xl space-y-6">
      <!-- Section Header with Viewport Switcher -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#143750] pb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs uppercase font-mono tracking-wider text-[#06b6d4] font-bold">[BIO-SPECIMEN DOSSIER]</span>
            <span class="text-[#335d7a]">·</span>
            <span class="text-xs text-[#94a3b8] font-mono">3-WAY VISUAL TRIPTYCH</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-[#f8fafc]">
            Análise Visual de <span class="text-[#38bdf8]">{{ dino().common_name }}</span>
          </h3>
        </div>

        <!-- Filter tabs for small screens or focused inspection -->
        <div class="flex p-1 rounded-xl bg-[#071927] border border-[#174463] text-xs font-mono font-bold" role="tablist">
          <button
            type="button"
            (click)="activeView.set('all')"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer"
            [class]="activeView() === 'all' ? 'bg-[#0891b2] text-white shadow-xs' : 'text-[#94a3b8] hover:text-[#f8fafc]'"
          >
            Todas (3)
          </button>
          <button
            type="button"
            (click)="activeView.set('game')"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer"
            [class]="activeView() === 'game' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#94a3b8] hover:text-[#f8fafc]'"
          >
            Jogo
          </button>
          <button
            type="button"
            (click)="activeView.set('fossil')"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer"
            [class]="activeView() === 'fossil' ? 'bg-[#d97706] text-white shadow-xs' : 'text-[#94a3b8] hover:text-[#f8fafc]'"
          >
            Fóssil
          </button>
          <button
            type="button"
            (click)="activeView.set('paleoart')"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer"
            [class]="activeView() === 'paleoart' ? 'bg-[#0284c7] text-white shadow-xs' : 'text-[#94a3b8] hover:text-[#f8fafc]'"
          >
            Em Vida
          </button>
        </div>
      </div>

      <!-- 3-Column Standardized Specimen Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- 1. IN-GAME PALEO PINES -->
        @if (activeView() === 'all' || activeView() === 'game') {
          <div class="rounded-2xl border border-[#1b4332] bg-[#071927] p-4 flex flex-col justify-between group hover:border-[#10b981] transition-all duration-300 shadow-md relative overflow-hidden">
            <div>
              <!-- HUD Header -->
              <div class="flex items-center justify-between mb-3 text-[11px] font-mono">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#062c20] text-[#34d399] border border-[#0d6b4a]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  01 // PALEO PINES
                </span>
                <span class="text-[#6ee7b7] font-semibold">ESTILIZADO</span>
              </div>

              <!-- Standardized Uncropped Specimen Viewport -->
              <div
                class="specimen-viewport relative h-56 sm:h-64 rounded-xl border border-[#133e31] overflow-hidden flex items-center justify-center cursor-zoom-in group/img"
                (click)="openZoom('game')"
                title="Clique para ampliar o espécime"
              >
                <!-- Reticle crosshairs -->
                <div class="absolute top-2 left-2 text-[10px] font-mono text-[#065f46] select-none">+ 01.A</div>
                <div class="absolute bottom-2 right-2 text-[10px] font-mono text-[#065f46] select-none">SCAN // 3D</div>

                <img
                  [src]="gamePortrait()"
                  [alt]="'Visual no jogo de ' + dino().common_name"
                  class="w-full h-full object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'portrait')"
                />

                <!-- Zoom Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#062c20] text-[#34d399] border border-[#0d6b4a]">
                    🔍 EXPANDIR
                  </span>
                </div>
              </div>

              <!-- Metadata Description -->
              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#f8fafc]">{{ dino().common_name }}</h4>
                <p class="text-xs text-[#94a3b8] line-clamp-2">
                  Modelagem volumétrica expressiva e estilizada para gameplay no rancho de Paleo Pines.
                </p>
              </div>
            </div>

            <!-- Telemetry Footer -->
            <div class="mt-4 pt-3 border-t border-[#133e31] flex items-center justify-between text-[11px] font-mono text-[#6ee7b7]">
              <span>PORTE: {{ dino().game_profile.size_category }}</span>
              <span>BIOMA: {{ dino().game_profile.biome }}</span>
            </div>
          </div>
        }

        <!-- 2. REAL EXCAVATED FOSSIL PHOTOGRAPH -->
        @if (activeView() === 'all' || activeView() === 'fossil') {
          <div class="rounded-2xl border border-[#523317] bg-[#071927] p-4 flex flex-col justify-between group hover:border-[#f59e0b] transition-all duration-300 shadow-md relative overflow-hidden">
            <div>
              <!-- HUD Header -->
              <div class="flex items-center justify-between mb-3 text-[11px] font-mono">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#38200d] text-[#fbbf24] border border-[#78350f]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  02 // FÓSSIL REAL
                </span>
                <span class="text-[#fcd34d] font-semibold">OSTEOLOGIA</span>
              </div>

              <!-- Standardized Uncropped Specimen Viewport -->
              <div
                class="specimen-viewport relative h-56 sm:h-64 rounded-xl border border-[#3e2714] overflow-hidden flex items-center justify-center cursor-zoom-in group/img"
                (click)="openZoom('fossil')"
                title="Clique para ampliar o fóssil"
              >
                <!-- Reticle crosshairs -->
                <div class="absolute top-2 left-2 text-[10px] font-mono text-[#78350f] select-none">+ 02.B</div>
                <div class="absolute bottom-2 right-2 text-[10px] font-mono text-[#78350f] select-none">MUSEUM // MOUNT</div>

                <img
                  [src]="fossilPhoto()"
                  [alt]="'Fóssil real de ' + dino().common_name"
                  class="w-full h-full object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'fossil')"
                />

                <!-- Zoom Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#38200d] text-[#fbbf24] border border-[#78350f]">
                    🔍 EXPANDIR
                  </span>
                </div>
              </div>

              <!-- Metadata Description -->
              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#f8fafc] italic truncate">
                  {{ dino().fossil_profile?.scientific_name || dino().common_name }}
                </h4>
                <p class="text-xs text-[#94a3b8] line-clamp-2">
                  Espécime osteológico autêntico escavado em sedimentos geológicos e catalogado em acervo de museu.
                </p>
              </div>
            </div>

            <!-- Telemetry Footer -->
            <div class="mt-4 pt-3 border-t border-[#3e2714] flex items-center justify-between text-[11px] font-mono text-[#fcd34d]">
              <span>COMP: ~{{ dino().fossil_profile?.length_meters || '?' }} m</span>
              <span class="truncate max-w-[120px]">{{ dino().fossil_profile?.geological_period }}</span>
            </div>
          </div>
        }

        <!-- 3. PALEOART LIFE RESTORATION -->
        @if (activeView() === 'all' || activeView() === 'paleoart') {
          <div class="rounded-2xl border border-[#174463] bg-[#071927] p-4 flex flex-col justify-between group hover:border-[#06b6d4] transition-all duration-300 shadow-md relative overflow-hidden">
            <div>
              <!-- HUD Header -->
              <div class="flex items-center justify-between mb-3 text-[11px] font-mono">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-[#0c2e42] text-[#38bdf8] border border-[#0369a1]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                  03 // EM VIDA (PALEOARTE)
                </span>
                <span class="text-[#38bdf8] font-semibold">RECONSTITUIÇÃO</span>
              </div>

              <!-- Standardized Uncropped Specimen Viewport -->
              <div
                class="specimen-viewport relative h-56 sm:h-64 rounded-xl border border-[#174463] overflow-hidden flex items-center justify-center cursor-zoom-in group/img"
                (click)="openZoom('paleoart')"
                title="Clique para ampliar a reconstituição em vida"
              >
                <!-- Reticle crosshairs -->
                <div class="absolute top-2 left-2 text-[10px] font-mono text-[#075985] select-none">+ 03.C</div>
                <div class="absolute bottom-2 right-2 text-[10px] font-mono text-[#075985] select-none">LIFE // RESTORE</div>

                <img
                  [src]="paleoartIllustration()"
                  [alt]="'Reconstrução paleontológica em vida de ' + dino().common_name"
                  class="w-full h-full object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'paleoart')"
                />

                <!-- Zoom Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#0c2e42] text-[#38bdf8] border border-[#0369a1]">
                    🔍 EXPANDIR
                  </span>
                </div>
              </div>

              <!-- Metadata Description -->
              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#f8fafc]">Ilustração Paleobiológica</h4>
                <p class="text-xs text-[#94a3b8] line-clamp-2">
                  Desenho anatômico científico reconstituindo a pele, musculatura, postura biomecânica e cores estimadas.
                </p>
              </div>
            </div>

            <!-- Telemetry Footer -->
            <div class="mt-4 pt-3 border-t border-[#174463] flex items-center justify-between text-[11px] font-mono text-[#38bdf8]">
              <span>MASSA: ~{{ dino().fossil_profile?.mass_kg?.toLocaleString() || '?' }} kg</span>
              <span>DIETA: {{ dino().fossil_profile?.real_diet }}</span>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Interactive Lightbox Inspection Modal -->
    @if (zoomedSpecimen(); as zoom) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" (click)="closeZoom()">
        <div
          class="relative max-w-4xl w-full rounded-3xl border border-[#174463] bg-[#071927] p-6 shadow-2xl space-y-4"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-[#174463] pb-3">
            <div>
              <span class="text-xs font-mono uppercase text-[#06b6d4] font-bold">{{ zoom.category }}</span>
              <h3 class="text-xl font-black text-[#f8fafc]">{{ zoom.title }}</h3>
            </div>
            <button
              type="button"
              (click)="closeZoom()"
              class="w-9 h-9 rounded-full bg-[#0a2030] hover:bg-[#133952] border border-[#174463] text-[#94a3b8] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Large High-Res Viewport with full containment -->
          <div class="specimen-viewport relative h-[50vh] sm:h-[60vh] rounded-2xl border border-[#174463] overflow-hidden flex items-center justify-center p-4">
            <img
              [src]="zoom.imageUrl"
              [alt]="zoom.title"
              class="w-full h-full object-contain"
            />
          </div>

          <!-- Modal Telemetry & Caption -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs font-mono text-[#94a3b8]">
            <p>{{ zoom.description }}</p>
            <span class="text-[#38bdf8] shrink-0 font-bold">{{ zoom.telemetry }}</span>
          </div>
        </div>
      </div>
    }
  `
})
export class VisualTriptychComponent {
  public readonly dino = input.required<Dinosaur>();
  public readonly state = inject(ScannerStateService);

  public readonly activeView = signal<'all' | 'game' | 'fossil' | 'paleoart'>('all');
  public readonly zoomedSpecimen = signal<ZoomedSpecimen | null>(null);

  public readonly gamePortrait = computed(() => {
    return this.state.getPortraitUrl(this.dino().portrait_url);
  });

  public readonly fossilPhoto = computed(() => {
    return this.state.getFossilUrl(this.dino());
  });

  public readonly paleoartIllustration = computed(() => {
    return this.state.getPaleoartUrl(this.dino());
  });

  public onImageError(event: Event, type: 'portrait' | 'fossil' | 'paleoart'): void {
    const img = event.target as HTMLImageElement;
    if (type === 'fossil' || type === 'paleoart') {
      img.src = this.state.getPortraitUrl(this.dino().portrait_url);
    }
  }

  public openZoom(type: 'game' | 'fossil' | 'paleoart'): void {
    const d = this.dino();
    if (type === 'game') {
      this.zoomedSpecimen.set({
        title: `${d.common_name} (Paleo Pines)`,
        category: 'SPECIMEN 01 // 3D MODELAGEM IN-GAME',
        imageUrl: this.gamePortrait(),
        description: `Representação visual no jogo. Bioma: ${d.game_profile.biome}, Dieta: ${d.game_profile.diet}.`,
        telemetry: `Porte ${d.game_profile.size_category} · Sela: ${d.game_profile.is_rideable ? 'Sim' : 'Não'}`,
      });
    } else if (type === 'fossil') {
      this.zoomedSpecimen.set({
        title: `${d.fossil_profile?.scientific_name || d.common_name} (Fóssil Real)`,
        category: 'SPECIMEN 02 // ESQUELETO FÓSSIL ESCAVADO',
        imageUrl: this.fossilPhoto(),
        description: d.fossil_profile?.distinctive_features || 'Espécime fóssil documentado pela paleontologia.',
        telemetry: `Período: ${d.fossil_profile?.geological_period || '---'} (~${d.fossil_profile?.approximate_mya || '---'})`,
      });
    } else {
      this.zoomedSpecimen.set({
        title: `${d.fossil_profile?.scientific_name || d.common_name} (Reconstituição em Vida)`,
        category: 'SPECIMEN 03 // PALEOARTE CIENTÍFICA EM VIDA',
        imageUrl: this.paleoartIllustration(),
        description: 'Reconstrução anatômica biológica baseada em musculatura, tegumento e postura real.',
        telemetry: `Comprimento: ~${d.fossil_profile?.length_meters || '?'}m · Massa: ~${d.fossil_profile?.mass_kg?.toLocaleString() || '?'}kg`,
      });
    }
  }

  public closeZoom(): void {
    this.zoomedSpecimen.set(null);
  }
}
