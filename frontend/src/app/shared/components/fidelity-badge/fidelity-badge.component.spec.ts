import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FidelityBadgeComponent } from './fidelity-badge.component';

@Component({
  standalone: true,
  imports: [FidelityBadgeComponent],
  template: `<app-fidelity-badge [percentage]="percentage" [showText]="true" />`
})
class TestHostComponent {
  public percentage = 90;
}

describe('FidelityBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
  });

  it('should render high fidelity badge for percentage >= 80', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.percentage = 88;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('88%');
    expect(compiled.textContent).toContain('Alta Fidelidade');
  });

  it('should render moderate fidelity badge for percentage between 50 and 79', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.percentage = 65;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('65%');
    expect(compiled.textContent).toContain('Fidelidade Moderada');
  });

  it('should render poetic license badge for percentage below 50', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.percentage = 35;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('35%');
    expect(compiled.textContent).toContain('Licença Poética');
  });
});
