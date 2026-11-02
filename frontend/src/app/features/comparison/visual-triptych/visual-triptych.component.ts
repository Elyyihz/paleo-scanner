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
  host: { class: 'block w-full' },
  template: `
    <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-sm space-y-5">
      <!-- Section Header with Viewport Switcher -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1c2633] pb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs uppercase font-mono tracking-wider text-[#c8873a] font-bold">[DOSSIÊ BIO-VISUAL]</span>
            <span class="text-[#3b4c60]">·</span>
            <span class="text-xs text-[#94a3b8] font-mono">REGISTRO TRIPLO DE ESPÉCIME</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-[#ebe6dc]">
            Análise Visual de <span class="text-[#c8873a]">{{ dino().common_name }}</span>
          </h3>
        </div>

        <!-- Filter tabs for small screens or focused inspection -->
        <div class="flex p-0.5 rounded-md bg-[#0c1015] border border-[#222d3a] text-xs font-mono font-bold" role="tablist">
          <button
            type="button"
            (click)="activeView.set('all')"
            class="px-3 py-1 rounded transition-all cursor-pointer"
            [class]="activeView() === 'all' ? 'bg-[#1e293b] text-white shadow-xs' : 'text-[#94a3b8] hover:text-[#ebe6dc]'"
          >
            Todas (3)
          </button>
          <button
            type="button"
            (click)="activeView.set('game')"
            class="px-3 py-1 rounded transition-all cursor-pointer"
            [class]="activeView() === 'game' ? 'bg-[#143322] text-[#4ade80] border border-[#1e5033]' : 'text-[#94a3b8] hover:text-[#ebe6dc]'"
          >
            Jogo
          </button>
          <button
            type="button"
            (click)="activeView.set('fossil')"
            class="px-3 py-1 rounded transition-all cursor-pointer"
            [class]="activeView() === 'fossil' ? 'bg-[#332010] text-[#fcd34d] border border-[#6b3d16]' : 'text-[#94a3b8] hover:text-[#ebe6dc]'"
          >
            Fóssil
          </button>
          <button
            type="button"
            (click)="activeView.set('paleoart')"
            class="px-3 py-1 rounded transition-all cursor-pointer"
            [class]="activeView() === 'paleoart' ? 'bg-[#331a10] text-[#fb923c] border border-[#6b2f16]' : 'text-[#94a3b8] hover:text-[#ebe6dc]'"
          >
            Em Vida
          </button>
        </div>
      </div>

      <!-- 3-Column Standardized Specimen Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- 1. IN-GAME PALEO PINES -->
        @if (activeView() === 'all' || activeView() === 'game') {
          <div class="rounded-lg border border-[#1b3a26] bg-[#0e1612] p-4 flex flex-col justify-between group hover:border-[#2e7d4b] transition-all duration-300 relative overflow-hidden">
            <div>
              <!-- HUD Header with anti-overlapping wrap -->
              <div class="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 text-[11px] font-mono">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold bg-[#143322] text-[#4ade80] border border-[#1e5033]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  01 · PALEO PINES (3D)
                </span>
                <span class="text-[#86efac] font-semibold text-[10px] uppercase tracking-wider shrink-0">ESTILIZADO</span>
              </div>

              <!-- Standardized Uncropped Specimen Viewport -->
              <div
                class="specimen-viewport relative h-56 sm:h-64 rounded border border-[#1b3a26] overflow-hidden flex items-center justify-center cursor-zoom-in group/img"
                (click)="openZoom('game')"
                title="Clique para ampliar o espécime"
              >
                <!-- Reticle crosshairs -->
                <div class="absolute top-2 left-2 text-[10px] font-mono text-[#2e7d4b] select-none">SPEC-01</div>
                <div class="absolute bottom-2 right-2 text-[10px] font-mono text-[#2e7d4b] select-none">3D // ASSET</div>

                <img
                  [src]="gamePortrait()"
                  [alt]="'Visual no jogo de ' + dino().common_name"
                  class="w-full h-full object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'portrait')"
                />

                <!-- Zoom Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#143322] text-[#4ade80] border border-[#1e5033]">
                    AMPLIAR DETALHES
                  </span>
                </div>
              </div>

              <!-- Metadata Description -->
              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#ebe6dc]">{{ dino().common_name }}</h4>
                <p class="text-xs text-[#94a3b8] line-clamp-2">
                  Modelagem volumétrica expressiva e estilizada para gameplay no rancho de Paleo Pines.
                </p>
              </div>
            </div>

            <!-- Telemetry Footer -->
            <div class="mt-4 pt-3 border-t border-[#1b3a26] flex items-center justify-between text-[11px] font-mono text-[#86efac]">
              <span>PORTE: {{ dino().game_profile.size_category }}</span>
              <span>BIOMA: {{ dino().game_profile.biome }}</span>
            </div>
          </div>
        }

        <!-- 2. REAL EXCAVATED FOSSIL PHOTOGRAPH -->
        @if (activeView() === 'all' || activeView() === 'fossil') {
          <div class="rounded-lg border border-[#3a2c1b] bg-[#16120e] p-4 flex flex-col justify-between group hover:border-[#c8873a] transition-all duration-300 relative overflow-hidden">
            <div>
              <!-- HUD Header with anti-overlapping wrap -->
              <div class="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 text-[11px] font-mono">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold bg-[#332010] text-[#fcd34d] border border-[#6b3d16]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  02 · ESPÉCIME FÓSSIL
                </span>
                <span class="text-[#fde68a] font-semibold text-[10px] uppercase tracking-wider shrink-0">OSTEOLOGIA</span>
              </div>

              <!-- Standardized Uncropped Specimen Viewport -->
              <div
                class="specimen-viewport relative h-56 sm:h-64 rounded border border-[#3a2c1b] overflow-hidden flex items-center justify-center cursor-zoom-in group/img"
                (click)="openZoom('fossil')"
                title="Clique para ampliar o fóssil"
              >
                <!-- Reticle crosshairs -->
                <div class="absolute top-2 left-2 text-[10px] font-mono text-[#c8873a] select-none">SPEC-02</div>
                <div class="absolute bottom-2 right-2 text-[10px] font-mono text-[#c8873a] select-none">FOSSIL // MOUNT</div>

                <img
                  [src]="fossilPhoto()"
                  [alt]="'Fóssil real de ' + dino().common_name"
                  class="w-full h-full object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'fossil')"
                />

                <!-- Zoom Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#332010] text-[#fcd34d] border border-[#6b3d16]">
                    AMPLIAR DETALHES
                  </span>
                </div>
              </div>

              <!-- Metadata Description -->
              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#ebe6dc] italic truncate">
                  {{ dino().fossil_profile?.scientific_name || dino().common_name }}
                </h4>
                <p class="text-xs text-[#94a3b8] line-clamp-2">
                  Espécime osteológico autêntico escavado em sedimentos geológicos e catalogado em acervo de museu.
                </p>
              </div>
            </div>

            <!-- Telemetry Footer -->
            <div class="mt-4 pt-3 border-t border-[#3a2c1b] flex items-center justify-between text-[11px] font-mono text-[#fcd34d]">
              <span>COMP: ~{{ dino().fossil_profile?.length_meters || '?' }} m</span>
              <span class="truncate max-w-[120px]">{{ dino().fossil_profile?.geological_period }}</span>
            </div>
          </div>
        }

        <!-- 3. PALEOART LIFE RESTORATION -->
        @if (activeView() === 'all' || activeView() === 'paleoart') {
          <div class="rounded-lg border border-[#3a2218] bg-[#16100d] p-4 flex flex-col justify-between group hover:border-[#9c5836] transition-all duration-300 relative overflow-hidden">
            <div>
              <!-- HUD Header with anti-overlapping wrap (FIXES THE REPORTED BUG) -->
              <div class="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 text-[11px] font-mono">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold bg-[#331a10] text-[#fb923c] border border-[#6b2f16]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
                  03 · RECONSTITUIÇÃO EM VIDA
                </span>
                <span class="text-[#fdba74] font-semibold text-[10px] uppercase tracking-wider shrink-0">PALEOARTE</span>
              </div>

              <!-- Standardized Uncropped Specimen Viewport -->
              <div
                class="specimen-viewport relative h-56 sm:h-64 rounded border border-[#3a2218] overflow-hidden flex items-center justify-center cursor-zoom-in group/img"
                (click)="openZoom('paleoart')"
                title="Clique para ampliar a reconstituição em vida"
              >
                <!-- Reticle crosshairs -->
                <div class="absolute top-2 left-2 text-[10px] font-mono text-[#c96b32] select-none">SPEC-03</div>
                <div class="absolute bottom-2 right-2 text-[10px] font-mono text-[#c96b32] select-none">LIFE // PALEOART</div>

                <img
                  [src]="paleoartIllustration()"
                  [alt]="'Reconstrução paleontológica em vida de ' + dino().common_name"
                  class="w-full h-full object-contain p-3 group-hover/img:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'paleoart')"
                />

                <!-- Zoom Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#331a10] text-[#fb923c] border border-[#6b2f16]">
                    AMPLIAR DETALHES
                  </span>
                </div>
              </div>

              <!-- Metadata Description -->
              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#ebe6dc]">Ilustração Paleobiológica</h4>
                <p class="text-xs text-[#94a3b8] line-clamp-2">
                  Desenho anatômico científico reconstituindo a pele, musculatura, postura biomecânica e cores estimadas.
                </p>
              </div>
            </div>

            <!-- Telemetry Footer -->
            <div class="mt-4 pt-3 border-t border-[#3a2218] flex items-center justify-between text-[11px] font-mono text-[#fdba74]">
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
          class="relative max-w-4xl w-full rounded-lg border border-[#2c3b4c] bg-[#121820] p-6 shadow-2xl space-y-4"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-[#222d3a] pb-3">
            <div>
              <span class="text-xs font-mono uppercase text-[#c8873a] font-bold">{{ zoom.category }}</span>
              <h3 class="text-xl font-black text-[#ebe6dc]">{{ zoom.title }}</h3>
            </div>
            <button
              type="button"
              (click)="closeZoom()"
              class="w-8 h-8 rounded bg-[#1c2633] hover:bg-[#253344] border border-[#2c3b4c] text-[#94a3b8] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Large High-Res Viewport with full containment -->
          <div class="specimen-viewport relative h-[50vh] sm:h-[60vh] rounded border border-[#222d3a] overflow-hidden flex items-center justify-center p-4">
            <img
              [src]="zoom.imageUrl"
              [alt]="zoom.title"
              class="w-full h-full object-contain"
            />
          </div>

          <!-- Modal Telemetry & Caption -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs font-mono text-[#94a3b8]">
            <p>{{ zoom.description }}</p>
            <span class="text-[#c8873a] shrink-0 font-bold">{{ zoom.telemetry }}</span>
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
