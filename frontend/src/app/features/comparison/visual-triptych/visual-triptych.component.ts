import { Component, computed, inject, input, signal } from '@angular/core';
import { Dinosaur } from '../../../core/models/dinosaur.model';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Visual Triptych displaying side-by-side:
 * 1. Paleo Pines in-game stylized portrayal
 * 2. Real-world museum fossil specimen photograph
 * 3. Scientifically validated life reconstruction (paleoart)
 */
@Component({
  selector: 'app-visual-triptych',
  standalone: true,
  template: `
    <div class="rounded-3xl border border-[#5a3f2b] bg-[#1d140e] p-5 sm:p-7 shadow-xl space-y-5">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3e2b1d] pb-4">
        <div>
          <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">Galeria Comparativa Tripla</span>
          <h3 class="text-xl sm:text-2xl font-black text-[#fceddb]">
            Da Fantasia ao Fóssil: 3 Visões de <span class="text-[#f4a261]">{{ dino().common_name }}</span>
          </h3>
        </div>

        <!-- Mobile view selector buttons -->
        <div class="flex sm:hidden p-1 rounded-xl bg-[#2a1d14] border border-[#443122] text-xs font-bold" role="tablist">
          <button
            type="button"
            (click)="activeView.set('all')"
            class="px-2.5 py-1 rounded-lg transition-all"
            [class]="activeView() === 'all' ? 'bg-[#f4a261] text-[#16110c]' : 'text-[#dfd0be]'"
          >
            Todas
          </button>
          <button
            type="button"
            (click)="activeView.set('game')"
            class="px-2.5 py-1 rounded-lg transition-all"
            [class]="activeView() === 'game' ? 'bg-[#f4a261] text-[#16110c]' : 'text-[#dfd0be]'"
          >
            Jogo
          </button>
          <button
            type="button"
            (click)="activeView.set('fossil')"
            class="px-2.5 py-1 rounded-lg transition-all"
            [class]="activeView() === 'fossil' ? 'bg-[#f4a261] text-[#16110c]' : 'text-[#dfd0be]'"
          >
            Fóssil
          </button>
          <button
            type="button"
            (click)="activeView.set('paleoart')"
            class="px-2.5 py-1 rounded-lg transition-all"
            [class]="activeView() === 'paleoart' ? 'bg-[#f4a261] text-[#16110c]' : 'text-[#dfd0be]'"
          >
            Em Vida
          </button>
        </div>
      </div>

      <!-- 3-Column Visual Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- 1. IN-GAME PALEO PINES -->
        @if (activeView() === 'all' || activeView() === 'game') {
          <div class="rounded-2xl border border-[#3e5643] bg-[#162118] p-4 flex flex-col justify-between group hover:border-[#52b788] transition-all duration-300 shadow-md">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#14301f] text-[#74c69d] border border-[#2d6a4f]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#52b788]"></span>
                  1. No Jogo (Paleo Pines)
                </span>
                <span class="text-xs text-[#8cb399] font-medium">Estilizado</span>
              </div>

              <!-- In-game Image Container -->
              <div class="relative aspect-4/3 rounded-xl bg-[#0e1610] border border-[#2b4432] overflow-hidden flex items-center justify-center p-2">
                <img
                  [src]="gamePortrait()"
                  [alt]="'Visual no jogo de ' + dino().common_name"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'portrait')"
                />
              </div>

              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#fceddb]">{{ dino().common_name }}</h4>
                <p class="text-xs text-[#a3c4ae]">
                  Representação estética com olhos expressivos, cores personalizáveis e proporções fofas para simulação de fazenda.
                </p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-[#25392b] flex items-center justify-between text-[11px] text-[#71987d]">
              <span>Porte: {{ dino().game_profile.size_category }}</span>
              <span>Bioma: {{ dino().game_profile.biome }}</span>
            </div>
          </div>
        }

        <!-- 2. REAL EXCAVATED FOSSIL -->
        @if (activeView() === 'all' || activeView() === 'fossil') {
          <div class="rounded-2xl border border-[#6b4527] bg-[#22160d] p-4 flex flex-col justify-between group hover:border-[#f4a261] transition-all duration-300 shadow-md">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#382314] text-[#f4a261] border border-[#6e4626]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#e09f3e]"></span>
                  2. O Fóssil Real (Museu)
                </span>
                <span class="text-xs text-[#c49a78] font-medium">Osteologia</span>
              </div>

              <!-- Fossil Image Container -->
              <div class="relative aspect-4/3 rounded-xl bg-[#140c06] border border-[#442b17] overflow-hidden flex items-center justify-center">
                <img
                  [src]="fossilPhoto()"
                  [alt]="'Fóssil escavado de ' + dino().common_name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'fossil')"
                />
              </div>

              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#fceddb] italic truncate">
                  {{ dino().fossil_profile?.scientific_name || dino().common_name }}
                </h4>
                <p class="text-xs text-[#d1b399] line-clamp-3">
                  Registro paleontológico preservado: esqueleto fóssil, lâminas dérmicas e crânio petrificado documentados pela ciência.
                </p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-[#3d2716] flex items-center justify-between text-[11px] text-[#b89578]">
              <span>Comprimento: ~{{ dino().fossil_profile?.length_meters || '?' }} m</span>
              <span class="truncate max-w-[120px]">{{ dino().fossil_profile?.geological_period }}</span>
            </div>
          </div>
        }

        <!-- 3. PALEOART LIFE RESTORATION -->
        @if (activeView() === 'all' || activeView() === 'paleoart') {
          <div class="rounded-2xl border border-[#7a4f2b] bg-[#24170e] p-4 flex flex-col justify-between group hover:border-[#ffbe76] transition-all duration-300 shadow-md">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3d2412] text-[#ffbe76] border border-[#804f26]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#f4a261]"></span>
                  3. Paleoarte (Em Vida)
                </span>
                <span class="text-xs text-[#d9a97f] font-medium">Paleobiologia</span>
              </div>

              <!-- Paleoart Image Container -->
              <div class="relative aspect-4/3 rounded-xl bg-[#140c06] border border-[#4a2e18] overflow-hidden flex items-center justify-center">
                <img
                  [src]="paleoartIllustration()"
                  [alt]="'Reconstrução paleontológica em vida de ' + dino().common_name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  (error)="onImageError($event, 'paleoart')"
                />
              </div>

              <div class="mt-3.5 space-y-1">
                <h4 class="text-base font-bold text-[#fceddb]">Reconstituição Biológica</h4>
                <p class="text-xs text-[#d9bfab] line-clamp-3">
                  Desenho científico anatômico inferido a partir das inserções musculares ósseas, tegumento (escamas ou penas) e biomecânica real.
                </p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-[#442a17] flex items-center justify-between text-[11px] text-[#bf9b7e]">
              <span>Massa: ~{{ dino().fossil_profile?.mass_kg?.toLocaleString() || '?' }} kg</span>
              <span>Dieta: {{ dino().fossil_profile?.real_diet }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class VisualTriptychComponent {
  public readonly dino = input.required<Dinosaur>();
  public readonly state = inject(ScannerStateService);

  public readonly activeView = signal<'all' | 'game' | 'fossil' | 'paleoart'>('all');

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
      // Fallback to local mirror or portrait if specific fossil asset is missing
      img.src = this.state.getPortraitUrl(this.dino().portrait_url);
    }
  }
}
