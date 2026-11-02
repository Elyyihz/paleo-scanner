import { Component, computed, input } from '@angular/core';

/**
 * Circular SVG HUD gauge chart displaying scientific fidelity
 * with high-tech cyan/emerald laser styling and digital monospace readouts.
 */
@Component({
  selector: 'app-fidelity-gauge',
  standalone: true,
  template: `
    <div class="rounded-3xl border border-[#174463] bg-[#0a2030] p-5 sm:p-7 shadow-xl flex flex-col items-center text-center space-y-4">
      <div>
        <span class="text-xs uppercase font-mono tracking-wider text-[#06b6d4] font-bold">[METRIC // TELEMETRY]</span>
        <h3 class="text-lg sm:text-xl font-black text-[#f8fafc]">Fidelidade com o Fóssil</h3>
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
            stroke="#0d293d"
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
          <span class="text-3xl font-mono font-black text-[#f8fafc] tracking-tight">
            {{ percentage().toFixed(0) }}%
          </span>
          <span class="text-[10px] uppercase font-mono font-bold text-[#38bdf8] tracking-wider">
            {{ verdictSummary() }}
          </span>
        </div>
      </div>

      <!-- Verdict Tag -->
      <div class="px-3.5 py-1 rounded-full text-xs font-mono font-bold border" [class]="verdictBadgeClass()">
        {{ verdict() }}
      </div>

      <!-- Trait Chips -->
      <div class="flex flex-wrap gap-1.5 justify-center text-[11px] pt-1">
        @for (chip of traitChips(); track chip.text) {
          <span
            class="px-2.5 py-1 rounded-full border font-mono transition-all"
            [class]="chip.type === 'match'
              ? 'bg-[#062c20] text-[#34d399] border-[#0d6b4a]'
              : 'bg-[#1e293b] text-[#94a3b8] border-[#334155]'"
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
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#06b6d4';
    return '#f59e0b';
  });

  public readonly verdictSummary = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'ALTA PRECISÃO';
    if (val >= 60) return 'BOA PRECISÃO';
    return 'LÚDICO';
  });

  public readonly verdictBadgeClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-[#062c20] text-[#34d399] border-[#0d6b4a] shadow-xs';
    if (val >= 60) return 'bg-[#0c2e42] text-[#38bdf8] border-[#0369a1] shadow-xs';
    return 'bg-[#3b200c] text-[#fbbf24] border-[#78350f] shadow-xs';
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
