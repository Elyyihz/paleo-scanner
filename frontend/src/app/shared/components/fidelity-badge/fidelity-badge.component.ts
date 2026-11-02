import { Component, computed, input } from '@angular/core';

/**
 * Visual field stamp indicating paleontological accuracy level with high-tech HUD cues.
 */
@Component({
  selector: 'app-fidelity-badge',
  standalone: true,
  template: `
    <div
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border shadow-sm"
      [class]="badgeClasses()"
    >
      <span class="w-2 h-2 rounded-full" [class]="dotClass()"></span>
      <span>{{ percentage() }}%</span>
      @if (showText()) {
        <span class="hidden sm:inline font-semibold opacity-95">· {{ label() }}</span>
      }
    </div>
  `
})
export class FidelityBadgeComponent {
  public readonly percentage = input.required<number>();
  public readonly showText = input<boolean>(true);

  public readonly badgeClasses = computed(() => {
    const val = this.percentage();
    if (val >= 80) {
      return 'bg-[#064e3b] text-[#34d399] border-[#059669] shadow-[#064e3b]/30';
    }
    if (val >= 50) {
      return 'bg-[#0c4a6e] text-[#38bdf8] border-[#0284c7] shadow-[#0c4a6e]/30';
    }
    return 'bg-[#4c0519] text-[#fb7185] border-[#be123c] shadow-[#4c0519]/30';
  });

  public readonly dotClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-[#10b981] animate-pulse';
    if (val >= 50) return 'bg-[#06b6d4]';
    return 'bg-[#f43f5e]';
  });

  public readonly label = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'Alta Fidelidade';
    if (val >= 50) return 'Fidelidade Moderada';
    return 'Licença Poética';
  });
}
