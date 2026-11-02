import { Component, computed, input } from '@angular/core';

/**
 * Visual field stamp indicating paleontological accuracy level with sober laboratory HUD cues.
 */
@Component({
  selector: 'app-fidelity-badge',
  standalone: true,
  template: `
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wide border shadow-xs"
      [class]="badgeClasses()"
    >
      <span class="w-1.5 h-1.5 rounded-full" [class]="dotClass()"></span>
      <span>{{ percentage() }}%</span>
      @if (showText()) {
        <span class="hidden sm:inline opacity-90">· {{ label() }}</span>
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
      return 'bg-[#0f241a] text-[#4ade80] border-[#1b4d31]';
    }
    if (val >= 50) {
      return 'bg-[#241a0e] text-[#fcd34d] border-[#6b4716]';
    }
    return 'bg-[#261012] text-[#f87171] border-[#5c1c24]';
  });

  public readonly dotClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-[#4ade80]';
    if (val >= 50) return 'bg-[#fcd34d]';
    return 'bg-[#f87171]';
  });

  public readonly label = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'Alta Fidelidade';
    if (val >= 50) return 'Fidelidade Moderada';
    return 'Licença Poética';
  });
}
