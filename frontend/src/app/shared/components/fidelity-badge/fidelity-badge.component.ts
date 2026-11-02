import { Component, computed, input } from '@angular/core';

/**
 * Visual field stamp indicating paleontological accuracy level with earthy nature cues.
 */
@Component({
  selector: 'app-fidelity-badge',
  standalone: true,
  template: `
    <div
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm"
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
      return 'bg-[#1b3a26] text-[#74c69d] border-[#2d6a4f] shadow-[#0f2317]/50';
    }
    if (val >= 50) {
      return 'bg-[#3b2713] text-[#f4a261] border-[#8a5525] shadow-[#201407]/50';
    }
    return 'bg-[#3d1a16] text-[#fca5a5] border-[#822a21] shadow-[#220c09]/50';
  });

  public readonly dotClass = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'bg-[#52b788] animate-pulse';
    if (val >= 50) return 'bg-[#f4a261]';
    return 'bg-[#ef4444]';
  });

  public readonly label = computed(() => {
    const val = this.percentage();
    if (val >= 80) return 'Alta Fidelidade';
    if (val >= 50) return 'Fidelidade Moderada';
    return 'Licença Poética';
  });
}
