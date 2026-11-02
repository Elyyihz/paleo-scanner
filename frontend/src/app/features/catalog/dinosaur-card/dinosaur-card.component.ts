import { Component, computed, inject, input } from '@angular/core';
import { Dinosaur } from '../../../core/models/dinosaur.model';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Interactive card displaying thumbnail, traits, and scientific metadata for a species.
 */
@Component({
  selector: 'app-dinosaur-card',
  standalone: true,
  template: `
    <div
      (click)="state.openDinosaurModal(dino())"
      class="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/50 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-cyan-950/40 hover:-translate-y-1"
    >
      <div>
        <!-- Portrait & Header -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 p-1 shrink-0 overflow-hidden group-hover:border-cyan-400/60 transition-colors shadow-md">
            @if (dino().portrait_url) {
              <img
                [src]="state.getPortraitUrl(dino().portrait_url)"
                [alt]="dino().common_name"
                class="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            } @else {
              <div class="w-full h-full flex items-center justify-center text-slate-700">🦖</div>
            }
          </div>

          <div class="truncate flex-1">
            <h3 class="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {{ dino().common_name }}
            </h3>
            <p class="text-xs text-slate-400 italic truncate">
              {{ dino().fossil_profile?.scientific_name || dino().slug }}
            </p>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold border" [class]="biomeClass()">
                {{ dino().game_profile.biome }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {{ dino().game_profile.diet }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Traits -->
        <div class="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-500">Habilidade:</span>
            <span class="font-medium text-cyan-300">{{ dino().game_profile.wild_skill || 'Nenhuma' }}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-500">Poppin Favorito:</span>
            <span class="font-medium text-amber-300">🍬 {{ dino().game_profile.poppin_favorite }}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-500">Fóssil Real:</span>
            <span class="font-medium text-slate-300">{{ dino().fossil_profile?.geological_period || 'Não registrado' }}</span>
          </div>
        </div>
      </div>

      <!-- Action prompt -->
      <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 group-hover:text-cyan-300 font-semibold">
        <span>Comparar com Fóssil</span>
        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
    }
    if (biome.includes('ariacotta') || biome.includes('desert')) {
      return 'bg-amber-950/70 text-amber-300 border-amber-800/60';
    }
    return 'bg-teal-950/70 text-teal-300 border-teal-800/60';
  });
}
