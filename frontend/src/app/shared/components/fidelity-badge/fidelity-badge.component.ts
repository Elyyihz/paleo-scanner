import { Component, computed, input } from '@angular/core';

/**
 * Visual badge indicating paleontological accuracy level with color cues.
 */
@Component({
  selector: 'app-fidelity-badge',
  standalone: true,
  template: `
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm"
      [class]="badgeClasses()"
    >
      <span class="w-2 h-2 rounded-full animate-pulse" [class]="dotClass()"></span>
      <span>{{ percentage() }}%</span>
      @if (showText()) {
        <span class="hidden sm:inline font-medium opacity-90">· {{ label() }}</span>
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
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20';
    }
    if (val >= 50) {
      return 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-amber-900/20';
    }
    return 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-rose-900/20';
  });

  public readonly dotClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-emerald-400';
    if (val >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  });

  public readonly label = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'Alta Fidelidade';
    if (val >= 50) return 'Fidelidade Moderada';
    return 'Licença Poética';
  });
}
