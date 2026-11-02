import { Component, computed, input } from '@angular/core';
import { RealFossilProfile } from '../../../core/models/dinosaur.model';

/**
 * High-tech interactive geological timeline visualizing the species' chronological position
 * across the Permian, Triassic, Jurassic, and Cretaceous periods using sober stratigraphic tones.
 */
@Component({
  selector: 'app-geological-timeline',
  standalone: true,
  host: { class: 'block w-full h-full' },
  template: `
    <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-lg space-y-4 h-full flex flex-col justify-between">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222d3a] pb-3">
        <div>
          <span class="text-xs uppercase font-mono tracking-wider text-[#c8873a] font-semibold">[GEO-CRONOLOGIA]</span>
          <h3 class="text-lg font-bold text-[#ebe6dc]">Linha do Tempo Geológica</h3>
        </div>
        <span class="text-xs font-mono text-[#c8873a] bg-[#0c1015] px-2.5 py-1 rounded border border-[#222d3a] self-start sm:self-auto font-medium">
          {{ fossil()?.geological_period || 'Período Fóssil' }} · {{ fossil()?.approximate_mya || '~70 Ma' }}
        </span>
      </div>

      <!-- Segmented Geological Bar with Laser HUD Marker -->
      <div class="relative pt-6 pb-2">
        <!-- Floating Species Marker Needle -->
        <div
          class="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700 pointer-events-none z-20"
          [style.left.%]="markerPercent()"
        >
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c8873a] text-[#0c1015] shadow-md shadow-amber-950/40 whitespace-nowrap">
            {{ displayMa() }}
          </span>
          <svg width="12" height="8" viewBox="0 0 14 10" class="text-[#c8873a]" fill="currentColor">
            <path d="M7 10L0 0h14z" />
          </svg>
        </div>

        <!-- The Chronological Bar with Authentic Stratigraphic Tones -->
        <div class="flex h-9 rounded overflow-hidden text-[11px] font-mono font-bold text-white border border-[#222d3a] shadow-inner">
          <!-- Permian -->
          <div class="bg-[#9c4d2d] flex items-center justify-center transition-all hover:brightness-110" style="flex: 47" title="Permiano: 299 a 252 Ma">
            <span class="truncate px-1 text-[#ebe6dc]">Permiano</span>
          </div>

          <!-- Triassic -->
          <div class="bg-[#824479] flex items-center justify-center transition-all hover:brightness-110" style="flex: 51" title="Triássico: 252 a 201 Ma">
            <span class="truncate px-1 text-[#ebe6dc]">Triássico</span>
          </div>

          <!-- Jurassic -->
          <div class="bg-[#245e3f] flex items-center justify-center transition-all hover:brightness-110" style="flex: 56" title="Jurássico: 201 a 145 Ma">
            <span class="truncate px-1 text-[#ebe6dc]">Jurássico</span>
          </div>

          <!-- Cretaceous -->
          <div class="bg-[#a67924] flex items-center justify-center transition-all hover:brightness-110" style="flex: 79" title="Cretáceo: 145 a 66 Ma">
            <span class="truncate px-1 text-[#0c1015] font-black">Cretáceo</span>
          </div>
        </div>

        <!-- Epoch Boundary Milestones -->
        <div class="flex justify-between text-[10px] font-mono text-[#94a3b8] mt-2 px-1">
          <span>299 Ma</span>
          <span>252 Ma</span>
          <span>201 Ma</span>
          <span>145 Ma</span>
          <span class="text-[#e06c75] font-bold">66 Ma (Extinção K-Pg)</span>
        </div>
      </div>

      <!-- Explanatory Telemetry description -->
      <div class="p-3 rounded border border-[#222d3a] bg-[#0c1015] text-xs font-mono text-[#94a3b8] leading-relaxed">
        <span class="text-[#c8873a] font-bold">[INFO]</span> {{ explanationText() }}
      </div>
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
    const ma = Math.max(66, Math.min(299, this.parsedMa()));
    const percent = ((299 - ma) / (299 - 66)) * 100;
    return Math.max(3, Math.min(97, percent));
  });

  public readonly explanationText = computed(() => {
    const f = this.fossil();
    if (!f) {
      return 'Posicionamento aproximado com base na estratigrafia e datação radiométrica de isótopos.';
    }
    return `Espécie datada em aproximadamente ${f.approximate_mya}, estrato geológico ${f.geological_period}, anterior ao evento de impacto Cretáceo-Paleógeno há 66 Ma.`;
  });
}
