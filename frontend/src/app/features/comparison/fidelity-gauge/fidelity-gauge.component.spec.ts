import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FidelityGaugeComponent } from './fidelity-gauge.component';

describe('FidelityGaugeComponent', () => {
  let component: FidelityGaugeComponent;
  let fixture: ComponentFixture<FidelityGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FidelityGaugeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FidelityGaugeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('percentage', 85);
    fixture.componentRef.setInput('verdict', 'Alta Fidelidade Científica');
    fixture.componentRef.setInput('dietMatch', true);
    fixture.detectChanges();
  });

  it('should create the fidelity gauge component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate valid dashOffset for circular SVG', () => {
    // 314 * (1 - 0.85) = 47.1
    expect(component.dashOffset()).toBeCloseTo(47.1, 1);
  });

  it('should generate matching trait chips for high fidelity', () => {
    const chips = component.traitChips();
    expect(chips.some(c => c.text === 'Dieta Comprovada')).toBe(true);
    expect(chips.some(c => c.text === 'Anatomia Rigorosa')).toBe(true);
  });
});
