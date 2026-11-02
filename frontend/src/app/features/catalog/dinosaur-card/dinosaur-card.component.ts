import { Component, computed, inject, input } from '@angular/core';
import { Dinosaur } from '../../../core/models/dinosaur.model';
import { ScannerStateService } from '../../../core/services/scanner-state.service';

/**
 * Interactive card displaying thumbnail, traits, and scientific metadata for a species
 * in sober laboratory bio-archive style with clean vector icons and standardized uncropped viewport.
 */
@Component({
  selector: 'app-dinosaur-card',
  standalone: true,
  host: { class: 'block h-full' },
  template: `
    <div
      (click)="state.openDinosaurModal(dino())"
      class="rounded-lg border border-[#222d3a] bg-[#121820] hover:bg-[#16202a] hover:border-[#c8873a] transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-0.5 h-full"
    >
      <div>
        <!-- Portrait & Header -->
        <div class="flex items-center gap-3.5 mb-3.5">
          <div class="w-14 h-14 rounded bg-[#080c10] border border-[#222d3a] p-1 shrink-0 overflow-hidden group-hover:border-[#c8873a] transition-colors shadow-inner flex items-center justify-center">
            @if (dino().portrait_url) {
              <img
                [src]="state.getPortraitUrl(dino().portrait_url)"
                [alt]="dino().common_name"
                class="w-full h-full object-contain rounded group-hover:scale-105 transition-transform"
                (error)="onImageError($event)"
                loading="lazy"
              />
            } @else {
              <!-- Clean SVG Dinosaur Fossil Skull -->
              <svg class="w-7 h-7 text-[#37475a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2a10 10 0 0 1 10 10c0 4.418-2.865 8.167-6.839 9.49"/>
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                <path d="M2.5 12a9.5 9.5 0 0 1 7-9.2"/>
                <path d="M2 18l4-4"/>
              </svg>
            }
          </div>

          <div class="truncate flex-1">
            <h3 class="text-base font-bold text-[#ebe6dc] group-hover:text-[#c8873a] transition-colors truncate">
              {{ dino().common_name }}
            </h3>
            <p class="text-xs text-[#94a3b8] italic truncate font-mono">
              {{ dino().fossil_profile?.scientific_name || dino().slug }}
            </p>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium border" [class]="biomeClass()">
                {{ dino().game_profile.biome }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#0c1015] text-[#94a3b8] border border-[#222d3a]">
                {{ dino().game_profile.diet }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Traits with SVG icons -->
        <div class="space-y-1.5 text-xs text-[#cbd5e1] border-t border-[#222d3a] pt-2.5 font-mono">
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-[#94a3b8]">Habilidade:</span>
            <span class="font-medium text-[#4ade80]">{{ dino().game_profile.wild_skill || 'Nenhuma' }}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-[#94a3b8]">Sabor Poppin:</span>
            <span class="font-medium text-[#c8873a] inline-flex items-center gap-1">
              <svg class="w-3 h-3 text-[#c8873a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"/>
                <path d="m15 9 5-5M9 15l-5 5M9 9 4 4M15 15l5 5"/>
              </svg>
              <span>{{ dino().game_profile.poppin_favorite }}</span>
            </span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-[#94a3b8]">Período Fóssil:</span>
            <span class="font-medium text-[#94a3b8] truncate max-w-[140px]">{{ dino().fossil_profile?.geological_period || 'Não catalogado' }}</span>
          </div>
        </div>
      </div>

      <!-- Action prompt -->
      <div class="mt-3.5 pt-2.5 border-t border-[#222d3a] flex items-center justify-between text-xs text-[#c8873a] group-hover:text-[#dba159] font-mono font-semibold uppercase tracking-wider">
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
      return 'bg-[#183321] text-[#4ade80] border-[#2e7d4b]';
    }
    if (biome.includes('ariacotta') || biome.includes('desert')) {
      return 'bg-[#3b2313] text-[#fcd34d] border-[#b45309]';
    }
    return 'bg-[#16202a] text-[#38bdf8] border-[#25415d]';
  });

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Fallback to local public static directory if backend static isn't serving it
    const slug = this.dino().slug;
    if (!img.src.includes(`/static/portraits/${slug}.png`)) {
      img.src = `/static/portraits/${slug}.png`;
    }
  }
}
