import { Component, computed, input } from '@angular/core';

/**
 * Circular SVG gauge chart displaying the scientific fidelity score
 * with animated progress ring and evolutionary trait tags.
 */
@Component({
  selector: 'app-fidelity-gauge',
  standalone: true,
  template: `
    <div class="rounded-3xl border border-[#543b27] bg-[#1d140e] p-5 sm:p-7 shadow-xl flex flex-col items-center text-center space-y-4">
      <div>
        <span class="text-xs uppercase tracking-wider text-[#f4a261] font-bold">Avaliação Científica</span>
        <h3 class="text-lg sm:text-xl font-black text-[#fceddb]">Fidelidade com o Fóssil</h3>
      </div>

      <!-- Circular SVG Ring Gauge -->
      <div class="relative w-36 h-36 my-1">
        <svg viewBox="0 0 120 120" class="-rotate-90 w-full h-full" role="img" [attr.aria-label]="'Fidelidade de ' + percentage() + ' por cento'">
          <!-- Background track -->
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#362417"
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

        <!-- Centered Metric Score -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-mono font-black text-[#fceddb] tracking-tight">
            {{ percentage().toFixed(0) }}%
          </span>
          <span class="text-[10px] uppercase font-bold text-[#f4a261] tracking-wider">
            {{ verdictSummary() }}
          </span>
        </div>
      </div>

      <!-- Verdict Pill -->
      <div class="px-3.5 py-1 rounded-full text-xs font-bold border" [class]="verdictBadgeClass()">
        {{ verdict() }}
      </div>

      <!-- Trait Chips -->
      <div class="flex flex-wrap gap-1.5 justify-center text-[11px] pt-1">
        @for (chip of traitChips(); track chip.text) {
          <span
            class="px-2.5 py-1 rounded-full border font-medium transition-all"
            [class]="chip.type === 'match'
              ? 'bg-[#183321] text-[#74c69d] border-[#29633e]'
              : 'bg-[#2e1d13] text-[#f4a261] border-[#543621]'"
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
    if (val >= 80) return '#52b788';
    if (val >= 60) return '#f4a261';
    return '#ef4444';
  });

  public readonly verdictSummary = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'Alta Precisão';
    if (val >= 60) return 'Boa Precisão';
    return 'Lúdico';
  });

  public readonly verdictBadgeClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-[#183321] text-[#74c69d] border-[#29633e]';
    if (val >= 60) return 'bg-[#3b2713] text-[#f4a261] border-[#7d4e24]';
    return 'bg-[#3b1916] text-[#fca5a5] border-[#7a2820]';
  });

  public readonly traitChips = computed(() => {
    const chips: Array<{ text: string; type: 'match' | 'stylized' }> = [];

    if (this.dietMatch()) {
      chips.push({ text: 'Dieta Comprovada', type: 'match' });
    } else {
      chips.push({ text: 'Dieta Lúdica', type: 'stylized' });
    }

    const val = this.percentage();
    if (val >= 85) {
      chips.push({ text: 'Anatomia Rigorosa', type: 'match' });
      chips.push({ text: 'Proporções Reais', type: 'match' });
    } else if (val >= 70) {
      chips.push({ text: 'Porte Estilizado', type: 'stylized' });
      chips.push({ text: 'Cores de Fantasia', type: 'stylized' });
    } else {
      chips.push({ text: 'Adaptação de Gameplay', type: 'stylized' });
      chips.push({ text: 'Olhos Expressivos', type: 'stylized' });
    }

    return chips;
  });
}
