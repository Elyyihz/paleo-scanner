import { Component, computed, input } from '@angular/core';

/**
 * Circular SVG HUD gauge chart displaying scientific fidelity
 * with sober laboratory amber/moss styling and digital monospace readouts.
 */
@Component({
  selector: 'app-fidelity-gauge',
  standalone: true,
  host: { class: 'block w-full h-full' },
  template: `
    <div class="rounded-lg border border-[#222d3a] bg-[#121820] p-5 sm:p-6 shadow-lg flex flex-col items-center text-center space-y-4 h-full justify-between">
      <div>
        <span class="text-xs uppercase font-mono tracking-wider text-[#c8873a] font-semibold">[MÉTRICA // TELEMETRIA]</span>
        <h3 class="text-lg font-bold text-[#ebe6dc]">Fidelidade com o Fóssil</h3>
      </div>

      <!-- Circular SVG Ring HUD Gauge -->
      <div class="relative w-36 h-36 my-1">
        <svg viewBox="0 0 120 120" class="-rotate-90 w-full h-full" role="img" [attr.aria-label]="'Fidelidade de ' + percentage() + ' por cento'">
          <!-- Background track -->
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#16202a"
            stroke-width="10"
          />
          <!-- Foreground animated progress ring -->
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            [attr.stroke]="gaugeColor()"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray="314"
            [style.stroke-dashoffset]="dashOffset()"
            class="transition-all duration-1000 ease-out"
          />
        </svg>

        <!-- Centered Digital Telemetry -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-mono font-bold text-[#ebe6dc] tracking-tight">
            {{ percentage().toFixed(0) }}%
          </span>
          <span class="text-[10px] uppercase font-mono font-semibold text-[#c8873a] tracking-wider">
            {{ verdictSummary() }}
          </span>
        </div>
      </div>

      <!-- Verdict Tag -->
      <div class="px-3 py-1 rounded text-xs font-mono font-medium border" [class]="verdictBadgeClass()">
        {{ verdict() }}
      </div>

      <!-- Trait Chips -->
      <div class="flex flex-wrap gap-1.5 justify-center text-[11px] pt-1">
        @for (chip of traitChips(); track chip.text) {
          <span
            class="px-2.5 py-0.5 rounded border font-mono transition-all"
            [class]="chip.type === 'match'
              ? 'bg-[#0f241a] text-[#4ade80] border-[#1b4d31]'
              : 'bg-[#16202a] text-[#94a3b8] border-[#222d3a]'"
          >
            {{ chip.text }}
          </span>
        }
      </div>
    </div>
  `
})
export class FidelityGaugeComponent {
  public readonly percentage = input.required<number>();
  public readonly verdict = input<string>('Alta Fidelidade Científica');
  public readonly dietMatch = input<boolean>(true);
  public readonly traits = input<string[]>([]);

  public readonly dashOffset = computed(() => {
    const val = Math.max(0, Math.min(100, this.percentage()));
    return 314 * (1 - val / 100);
  });

  public readonly gaugeColor = computed(() => {
    const val = this.percentage();
    if (val >= 80) return '#2e7d4b';
    if (val >= 60) return '#c8873a';
    return '#b45309';
  });

  public readonly verdictSummary = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'ALTA PRECISÃO';
    if (val >= 60) return 'BOA PRECISÃO';
    return 'LÚDICO';
  });

  public readonly verdictBadgeClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-[#0f241a] text-[#4ade80] border-[#1b4d31] shadow-xs';
    if (val >= 60) return 'bg-[#241a0e] text-[#fcd34d] border-[#6b4716] shadow-xs';
    return 'bg-[#261012] text-[#f87171] border-[#5c1c24] shadow-xs';
  });

  public readonly traitChips = computed(() => {
    const chips: Array<{ text: string; type: 'match' | 'stylized' }> = [];

    if (this.dietMatch()) {
      chips.push({ text: 'DIETA: COMPATÍVEL', type: 'match' });
    } else {
      chips.push({ text: 'DIETA: LÚDICA', type: 'stylized' });
    }

    const val = this.percentage();
    if (val >= 85) {
      chips.push({ text: 'ANATOMIA: RIGOROSA', type: 'match' });
      chips.push({ text: 'ESCALA: REAL', type: 'match' });
    } else if (val >= 70) {
      chips.push({ text: 'PORTE: ESTILIZADO', type: 'stylized' });
      chips.push({ text: 'PIGMENTO: LIVRE', type: 'stylized' });
    } else {
      chips.push({ text: 'ADAPTAÇÃO: GAMEPLAY', type: 'stylized' });
      chips.push({ text: 'OLHOS: EXPRESSIVOS', type: 'stylized' });
    }

    return chips;
  });
}
