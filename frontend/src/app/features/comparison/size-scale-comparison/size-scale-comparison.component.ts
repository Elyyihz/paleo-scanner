import { Component, computed, input, signal } from '@angular/core';
import { RealFossilProfile } from '../../../core/models/dinosaur.model';

interface ScaleReference {
  id: string;
  label: string;
  meters: number;
  iconType: 'human' | 'car' | 'bus' | 'trex';
}

/**
 * Interactive comparative size and proportion tool visualizing the real fossil
 * dimensions against recognizable real-world references (Human, Car, Bus).
 */
@Component({
  selector: 'app-size-scale-comparison',
  standalone: true,
  template: `
    <div class="rounded-3xl border border-[#543b27] bg-[#1d140e] p-5 sm:p-7 shadow-xl space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3e2b1d] pb-4">
        <div>
          <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">Proporções do Mundo Real</span>
          <h3 class="text-lg sm:text-xl font-black text-[#fceddb]">Comparativo Interativo de Escala</h3>
        </div>

        <!-- Reference Selection Chips -->
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Referência de escala">
          @for (ref of references; track ref.id) {
            <button
              type="button"
              (click)="selectedRefId.set(ref.id)"
              class="px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer"
              [class]="selectedRefId() === ref.id
                ? 'bg-[#f4a261] text-[#16110c] border-[#f4a261] shadow-xs'
                : 'bg-[#291c13] text-[#dfd0be] border-[#443021] hover:bg-[#342419]'"
            >
              {{ ref.label }} ({{ ref.meters }}m)
            </button>
          }
        </div>
      </div>

      <!-- Proportional Bar Visualizer -->
      <div class="p-6 rounded-2xl bg-[#140c07] border border-[#382416] flex flex-col justify-end min-h-[180px]">
        <div class="flex items-end justify-center gap-8 sm:gap-14 h-32">
          <!-- Reference Object Column -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-[11px] font-mono text-[#a89582]">{{ activeRef().meters }} m</span>
            <div
              class="rounded-t-lg bg-[#3a2718] border-2 border-[#68462b] transition-all duration-500 shadow-md flex items-center justify-center"
              [style.height.px]="refBarHeight()"
              [style.width.px]="refBarWidth()"
            >
              <div class="text-[10px] font-bold text-[#dfd0be] rotate-[-90deg] whitespace-nowrap">
                {{ activeRef().label }}
              </div>
            </div>
            <span class="text-xs font-semibold text-[#a89582] text-center max-w-[80px]">{{ activeRef().label }}</span>
          </div>

          <!-- Dinosaur Column -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-[11px] font-mono font-bold text-[#f4a261]">{{ dinoLength() }} m</span>
            <div
              class="rounded-t-lg bg-gradient-to-t from-[#c87627] to-[#f4a261] border-2 border-[#ffd199] transition-all duration-500 shadow-lg shadow-amber-950/40 flex items-center justify-center"
              [style.height.px]="dinoBarHeight()"
              [style.width.px]="dinoBarWidth()"
            >
              <div class="text-[10px] font-black text-[#16110c] rotate-[-90deg] whitespace-nowrap truncate px-1">
                {{ dinoName() }}
              </div>
            </div>
            <span class="text-xs font-bold text-[#fceddb] text-center max-w-[120px] truncate">{{ dinoName() }}</span>
          </div>
        </div>
      </div>

      <!-- Comparison Ratio Insight Text -->
      <div class="p-4 rounded-2xl bg-[#24170e] border border-[#442c1b] flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-[#3a2514] border border-[#6b4221] flex items-center justify-center text-[#f4a261] shrink-0 font-bold">
          ⚡
        </div>
        <p class="text-xs text-[#dfd0be] leading-relaxed">
          <strong class="text-[#fceddb]">{{ dinoName() }}</strong> (~{{ dinoLength() }} m) media
          <strong class="text-[#f4a261]">{{ ratioText() }}</strong>
          em relação a um(a) <strong>{{ activeRef().label.toLowerCase() }}</strong> ({{ activeRef().meters }} m).
          Estimativa de massa corporal fóssil de <strong>~{{ fossil()?.mass_kg?.toLocaleString() || '---' }} kg</strong>.
        </p>
      </div>
    </div>
  `
})
export class SizeScaleComparisonComponent {
  public readonly fossil = input<RealFossilProfile | null>();
  public readonly dinoName = input.required<string>();

  public readonly references: ScaleReference[] = [
    { id: 'human', label: 'Humano', meters: 1.7, iconType: 'human' },
    { id: 'car', label: 'Carro SUV', meters: 4.5, iconType: 'car' },
    { id: 'bus', label: 'Ônibus Urbano', meters: 12.0, iconType: 'bus' },
  ];

  public readonly selectedRefId = signal<string>('human');

  public readonly activeRef = computed(() => {
    return this.references.find(r => r.id === this.selectedRefId()) || this.references[0];
  });

  public readonly dinoLength = computed(() => {
    return this.fossil()?.length_meters || 8.0;
  });

  // Scale factor: max height 110px for the largest among dino and reference
  private readonly maxVisualHeight = 110;
  private readonly minVisualHeight = 16;

  public readonly dinoBarHeight = computed(() => {
    const d = this.dinoLength();
    const r = this.activeRef().meters;
    const maxVal = Math.max(d, r, 1);
    return Math.max(this.minVisualHeight, (d / maxVal) * this.maxVisualHeight);
  });

  public readonly dinoBarWidth = computed(() => {
    return Math.min(68, Math.max(40, this.dinoLength() * 4.5));
  });

  public readonly refBarHeight = computed(() => {
    const d = this.dinoLength();
    const r = this.activeRef().meters;
    const maxVal = Math.max(d, r, 1);
    return Math.max(this.minVisualHeight, (r / maxVal) * this.maxVisualHeight);
  });

  public readonly refBarWidth = computed(() => {
    return Math.min(48, Math.max(28, this.activeRef().meters * 3.5));
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
