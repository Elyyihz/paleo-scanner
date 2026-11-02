import { Component, computed, input } from '@angular/core';
import { RealFossilProfile } from '../../../core/models/dinosaur.model';

/**
 * Interactive geological timeline visualizing the species' chronological position
 * across the Permian, Triassic, Jurassic, and Cretaceous periods.
 */
@Component({
  selector: 'app-geological-timeline',
  standalone: true,
  template: `
    <div class="rounded-3xl border border-[#543b27] bg-[#1d140e] p-5 sm:p-7 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3e2b1d] pb-3">
        <div>
          <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">Cronologia da Terra</span>
          <h3 class="text-lg sm:text-xl font-black text-[#fceddb]">Linha do Tempo Geológica</h3>
        </div>
        <span class="text-xs font-mono text-[#f4a261] bg-[#2e1d13] px-3 py-1 rounded-full border border-[#523522] self-start sm:self-auto">
          {{ fossil()?.geological_period || 'Período Fóssil' }} · {{ fossil()?.approximate_mya || '~70 Ma' }}
        </span>
      </div>

      <!-- Segmented Geological Bar -->
      <div class="relative pt-6 pb-2">
        <!-- Floating Species Marker Needle -->
        <div
          class="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700 pointer-events-none z-10"
          [style.left.%]="markerPercent()"
        >
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4a261] text-[#16110c] shadow-md whitespace-nowrap">
            {{ displayMa() }}
          </span>
          <svg width="14" height="10" viewBox="0 0 14 10" class="text-[#f4a261]" fill="currentColor">
            <path d="M7 10L0 0h14z" />
          </svg>
        </div>

        <!-- The Bar -->
        <div class="flex h-10 rounded-xl overflow-hidden text-[11px] font-bold text-[#16110c] border border-[#443122] shadow-inner">
          <!-- Permian -->
          <div class="bg-[#8b5a2b] flex items-center justify-center transition-all hover:brightness-110" style="flex: 47" title="Permiano: 299 a 252 Ma">
            <span class="truncate px-1 text-[#fceddb]">Permiano</span>
          </div>

          <!-- Triassic -->
          <div class="bg-[#b37d4e] flex items-center justify-center transition-all hover:brightness-110" style="flex: 51" title="Triássico: 252 a 201 Ma">
            <span class="truncate px-1 text-[#fceddb]">Triássico</span>
          </div>

          <!-- Jurassic -->
          <div class="bg-[#52b788] flex items-center justify-center transition-all hover:brightness-110" style="flex: 56" title="Jurássico: 201 a 145 Ma">
            <span class="truncate px-1 text-[#0f2416]">Jurássico</span>
          </div>

          <!-- Cretaceous -->
          <div class="bg-[#f4a261] flex items-center justify-center transition-all hover:brightness-110" style="flex: 79" title="Cretáceo: 145 a 66 Ma">
            <span class="truncate px-1 text-[#16110c]">Cretáceo</span>
          </div>
        </div>

        <!-- Epoch Boundary Milestones -->
        <div class="flex justify-between text-[10px] font-mono text-[#a89582] mt-2 px-1">
          <span>299 Ma</span>
          <span>252 Ma</span>
          <span>201 Ma</span>
          <span>145 Ma</span>
          <span>66 Ma (Extinção)</span>
        </div>
      </div>

      <!-- Explanatory description -->
      <p class="text-xs text-[#cfbcab] leading-relaxed">
        {{ explanationText() }}
      </p>
    </div>
  `
})
export class GeologicalTimelineComponent {
  public readonly fossil = input<RealFossilProfile | null>();

  private readonly parsedMa = computed(() => {
    const f = this.fossil();
    if (!f || !f.approximate_mya) {
      return 70;
    }
    // Extract numbers from "76.5 - 73 Ma" or "150 Ma"
    const matches = f.approximate_mya.match(/\d+(\.\d+)?/g);
    if (!matches || matches.length === 0) {
      if (f.geological_period.includes('Permian')) return 280;
      if (f.geological_period.includes('Triassic')) return 220;
      if (f.geological_period.includes('Jurassic')) return 150;
      return 72;
    }
    const nums = matches.map(Number);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg;
  });

  public readonly displayMa = computed(() => {
    const ma = this.parsedMa();
    return `~${ma.toFixed(0)} Ma`;
  });

  public readonly markerPercent = computed(() => {
    // Total scale: 299 Ma (left 0%) to 66 Ma (right 100%)
    const ma = Math.max(66, Math.min(299, this.parsedMa()));
    const percent = ((299 - ma) / (299 - 66)) * 100;
    return Math.max(3, Math.min(97, percent));
  });

  public readonly explanationText = computed(() => {
    const f = this.fossil();
    if (!f) {
      return 'Posição aproximada com base no registro sedimentar fóssil.';
    }
    return `Esta espécie viveu há cerca de ${f.approximate_mya}, durante a era ${f.geological_period}, antes do evento de extinção em massa do Cretáceo-Paleógeno (K-Pg) que encerrou o reinado dos dinossauros não-avianos há 66 milhões de anos.`;
  });
}
