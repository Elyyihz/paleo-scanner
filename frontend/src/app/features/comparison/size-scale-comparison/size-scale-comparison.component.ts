import { Component, computed, input, signal } from '@angular/core';
import { RealFossilProfile } from '../../../core/models/dinosaur.model';

interface ScaleReference {
  id: string;
  label: string;
  meters: number;
}

/**
 * High-tech interactive comparative size and proportion tool
 * visualizing real fossil dimensions against recognizable modern references.
 */
@Component({
  selector: 'app-size-scale-comparison',
  standalone: true,
  host: { class: 'block w-full' },
  template: `
    <div class="rounded-3xl border border-[#174463] bg-[#0a2030] p-5 sm:p-7 shadow-xl space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#143750] pb-4">
        <div>
          <span class="text-xs uppercase font-mono tracking-wider text-[#06b6d4] font-bold">[METRIC SCALE // PROPORTION]</span>
          <h3 class="text-lg sm:text-xl font-black text-[#f8fafc]">Comparativo Interativo de Escala</h3>
        </div>

        <!-- Reference Selection Chips -->
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Referência de escala">
          @for (ref of references; track ref.id) {
            <button
              type="button"
              (click)="selectedRefId.set(ref.id)"
              class="px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer"
              [class]="selectedRefId() === ref.id
                ? 'bg-[#0891b2] text-white border-cyan-400 shadow-sm shadow-cyan-950/40'
                : 'bg-[#071927] text-[#94a3b8] border-[#174463] hover:bg-[#0f2c42] hover:text-[#f8fafc]'"
            >
              {{ ref.label }} ({{ ref.meters }}m)
            </button>
          }
        </div>
      </div>

      <!-- Proportional Bar Visualizer Viewport -->
      <div class="specimen-viewport p-6 rounded-2xl border border-[#174463] flex flex-col justify-end min-h-[190px]">
        <div class="flex items-end justify-center gap-8 sm:gap-16 h-36 border-b border-[#174463]/60 pb-1">
          <!-- Reference Object Column -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-[11px] font-mono text-[#94a3b8]">{{ activeRef().meters }} m</span>
            <div
              class="rounded-t-lg bg-[#0f2c42] border-2 border-[#1e5a84] transition-all duration-500 shadow-md flex items-center justify-center overflow-hidden"
              [style.height.px]="refBarHeight()"
              [style.width.px]="refBarWidth()"
            >
              <div class="text-[10px] font-mono font-bold text-[#94a3b8] rotate-[-90deg] whitespace-nowrap">
                {{ activeRef().label }}
              </div>
            </div>
            <span class="text-xs font-mono font-semibold text-[#94a3b8] text-center max-w-[80px]">{{ activeRef().label }}</span>
          </div>

          <!-- Dinosaur Column -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-[11px] font-mono font-bold text-[#06b6d4]">{{ dinoLength() }} m</span>
            <div
              class="rounded-t-lg bg-gradient-to-t from-[#0891b2] to-[#22d3ee] border-2 border-[#67e8f9] transition-all duration-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center overflow-hidden"
              [style.height.px]="dinoBarHeight()"
              [style.width.px]="dinoBarWidth()"
            >
              <div class="text-[10px] font-mono font-black text-[#05131e] rotate-[-90deg] whitespace-nowrap truncate px-1">
                {{ dinoName() }}
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-[#f8fafc] text-center max-w-[120px] truncate">{{ dinoName() }}</span>
          </div>
        </div>
      </div>

      <!-- Comparison Telemetry Insight Box -->
      <div class="p-4 rounded-2xl bg-[#071927] border border-[#174463] flex items-center gap-3 font-mono text-xs text-[#94a3b8]">
        <div class="w-8 h-8 rounded-xl bg-[#0b2b40] border border-[#174463] flex items-center justify-center text-[#06b6d4] shrink-0 font-bold">
          ⚡
        </div>
        <p class="leading-relaxed">
          <strong class="text-[#f8fafc]">{{ dinoName() }}</strong> (~{{ dinoLength() }} m) possuía
          <strong class="text-[#38bdf8]">{{ ratioText() }}</strong>
          em relação a um(a) <strong>{{ activeRef().label.toLowerCase() }}</strong> ({{ activeRef().meters }} m).
          Massa corporal fóssil estimada em <strong>~{{ fossil()?.mass_kg?.toLocaleString() || '---' }} kg</strong>.
        </p>
      </div>
    </div>
  `
})
export class SizeScaleComparisonComponent {
  public readonly fossil = input<RealFossilProfile | null>();
  public readonly dinoName = input.required<string>();

  public readonly references: ScaleReference[] = [
    { id: 'human', label: 'Humano', meters: 1.7 },
    { id: 'car', label: 'Carro SUV', meters: 4.5 },
    { id: 'bus', label: 'Ônibus Urbano', meters: 12.0 },
  ];

  public readonly selectedRefId = signal<string>('human');

  public readonly activeRef = computed(() => {
    return this.references.find(r => r.id === this.selectedRefId()) || this.references[0];
  });

  public readonly dinoLength = computed(() => {
    return this.fossil()?.length_meters || 8.0;
  });

  private readonly maxVisualHeight = 115;
  private readonly minVisualHeight = 18;

  public readonly dinoBarHeight = computed(() => {
    const d = this.dinoLength();
    const r = this.activeRef().meters;
    const maxVal = Math.max(d, r, 1);
    return Math.max(this.minVisualHeight, (d / maxVal) * this.maxVisualHeight);
  });

  public readonly dinoBarWidth = computed(() => {
    return Math.min(70, Math.max(42, this.dinoLength() * 4.5));
  });

  public readonly refBarHeight = computed(() => {
    const d = this.dinoLength();
    const r = this.activeRef().meters;
    const maxVal = Math.max(d, r, 1);
    return Math.max(this.minVisualHeight, (r / maxVal) * this.maxVisualHeight);
  });

  public readonly refBarWidth = computed(() => {
    return Math.min(50, Math.max(30, this.activeRef().meters * 3.5));
  });

  public readonly ratioText = computed(() => {
    const d = this.dinoLength();
    const r = this.activeRef().meters;
    const ratio = d / r;
    if (ratio >= 1) {
      return `${ratio.toFixed(1)}x o tamanho`;
    }
    return `${(ratio * 100).toFixed(0)}% do tamanho`;
  });
}
