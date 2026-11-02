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
    <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-lg space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222d3a] pb-3.5">
        <div>
          <span class="text-xs uppercase font-mono tracking-wider text-[#c8873a] font-semibold">[ESCALA MÉTRICA // PROPORÇÃO]</span>
          <h3 class="text-lg font-bold text-[#ebe6dc]">Comparativo Interativo de Escala</h3>
        </div>

        <!-- Reference Selection Chips -->
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Referência de escala">
          @for (ref of references; track ref.id) {
            <button
              type="button"
              (click)="selectedRefId.set(ref.id)"
              class="px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors border cursor-pointer"
              [class]="selectedRefId() === ref.id
                ? 'bg-[#c8873a] text-[#0c1015] border-[#c8873a] font-bold shadow-xs'
                : 'bg-[#0c1015] text-[#94a3b8] border-[#222d3a] hover:bg-[#1a232e] hover:text-[#ebe6dc]'"
            >
              {{ ref.label }} ({{ ref.meters }}m)
            </button>
          }
        </div>
      </div>

      <!-- Proportional Bar Visualizer Viewport -->
      <div class="specimen-viewport p-5 rounded border border-[#222d3a] bg-[#080c10] flex flex-col justify-end min-h-[190px]">
        <div class="flex items-end justify-center gap-8 sm:gap-16 h-36 border-b border-[#222d3a] pb-1">
          <!-- Reference Object Column -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-[11px] font-mono text-[#94a3b8]">{{ activeRef().meters }} m</span>
            <div
              class="rounded-t bg-[#1a232e] border border-[#37475a] transition-all duration-500 shadow-md flex items-center justify-center overflow-hidden"
              [style.height.px]="refBarHeight()"
              [style.width.px]="refBarWidth()"
            >
              <div class="text-[10px] font-mono font-bold text-[#94a3b8] rotate-[-90deg] whitespace-nowrap">
                {{ activeRef().label }}
              </div>
            </div>
            <span class="text-xs font-mono font-medium text-[#94a3b8] text-center max-w-[80px]">{{ activeRef().label }}</span>
          </div>

          <!-- Dinosaur Column -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-[11px] font-mono font-bold text-[#c8873a]">{{ dinoLength() }} m</span>
            <div
              class="rounded-t bg-gradient-to-t from-[#8c5a22] to-[#c8873a] border border-[#e0a96d] transition-all duration-500 shadow-md shadow-amber-950/30 flex items-center justify-center overflow-hidden"
              [style.height.px]="dinoBarHeight()"
              [style.width.px]="dinoBarWidth()"
            >
              <div class="text-[10px] font-mono font-bold text-[#0c1015] rotate-[-90deg] whitespace-nowrap truncate px-1">
                {{ dinoName() }}
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-[#ebe6dc] text-center max-w-[120px] truncate">{{ dinoName() }}</span>
          </div>
        </div>
      </div>

      <!-- Comparison Telemetry Insight Box -->
      <div class="p-3.5 rounded border border-[#222d3a] bg-[#0c1015] flex items-center gap-3 font-mono text-xs text-[#94a3b8]">
        <div class="w-7 h-7 rounded bg-[#16202a] border border-[#222d3a] flex items-center justify-center text-[#c8873a] shrink-0 font-bold">
          ⚡
        </div>
        <p class="leading-relaxed">
          <strong class="text-[#ebe6dc]">{{ dinoName() }}</strong> (~{{ dinoLength() }} m) possuía
          <strong class="text-[#c8873a]">{{ ratioText() }}</strong>
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
