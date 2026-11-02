import { Component, computed, inject, input } from '@angular/core';
import { Dinosaur } from '../../../core/models/dinosaur.model';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Interactive card displaying thumbnail, traits, and scientific metadata for a species
 * in warm earthy Paleo Pines style.
 */
@Component({
  selector: 'app-dinosaur-card',
  standalone: true,
  template: `
    <div
      (click)="state.openDinosaurModal(dino())"
      class="rounded-3xl border border-[#443122] bg-[#221912] hover:bg-[#291e16] hover:border-[#f4a261]/60 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-amber-950/40 hover:-translate-y-1"
    >
      <div>
        <!-- Portrait & Header -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-2xl bg-[#17100a] border border-[#543d2a] p-1 shrink-0 overflow-hidden group-hover:border-[#f4a261]/60 transition-colors shadow-md">
            @if (dino().portrait_url) {
              <img
                [src]="state.getPortraitUrl(dino().portrait_url)"
                [alt]="dino().common_name"
                class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            } @else {
              <div class="w-full h-full flex items-center justify-center text-slate-700">🦖</div>
            }
          </div>

          <div class="truncate flex-1">
            <h3 class="text-base font-bold text-[#fceddb] group-hover:text-[#f4a261] transition-colors truncate">
              {{ dino().common_name }}
            </h3>
            <p class="text-xs text-[#b8a490] italic truncate">
              {{ dino().fossil_profile?.scientific_name || dino().slug }}
            </p>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold border shadow-xs" [class]="biomeClass()">
                {{ dino().game_profile.biome }}
              </span>
              <span class="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#2e2117] text-[#dfd0be] border border-[#4f3827]">
                {{ dino().game_profile.diet }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Traits -->
        <div class="space-y-1.5 text-xs text-[#dfd0be] border-t border-[#3e2c1e] pt-3">
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-[#a89582]">Habilidade:</span>
            <span class="font-medium text-[#74c69d]">{{ dino().game_profile.wild_skill || 'Nenhuma' }}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-[#a89582]">Sabor Poppin:</span>
            <span class="font-medium text-[#f4a261]">🍬 {{ dino().game_profile.poppin_favorite }}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-[#a89582]">Fóssil Real:</span>
            <span class="font-medium text-[#dfd0be]">{{ dino().fossil_profile?.geological_period || 'Não catalogado' }}</span>
          </div>
        </div>
      </div>

      <!-- Action prompt -->
      <div class="mt-4 pt-3 border-t border-[#3e2c1e] flex items-center justify-between text-xs text-[#f4a261] group-hover:text-[#ffbe76] font-bold">
        <span>Comparar com Fóssil</span>
        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
  `
})
export class DinosaurCardComponent {
  public readonly state = inject(ScannerStateService);
  public readonly dinosaur = input.required<Dinosaur>();

  public readonly dino = computed(() => this.dinosaur());

  public readonly biomeClass = computed(() => {
    const biome = this.dino().game_profile.biome.toLowerCase();
    if (biome.includes('dapplewood') || biome.includes('forest')) {
      return 'bg-[#1b3d28] text-[#74c69d] border-[#2d6a4f]';
    }
    if (biome.includes('ariacotta') || biome.includes('desert')) {
      return 'bg-[#422915] text-[#f4a261] border-[#7a4c25]';
    }
    return 'bg-[#193a38] text-[#5eead4] border-[#134e4a]';
  });
}
