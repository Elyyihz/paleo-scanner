import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizeScaleComparisonComponent } from './size-scale-comparison.component';
import { RealFossilProfile } from '../../../core/models/dinosaur.model';

describe('SizeScaleComparisonComponent', () => {
  let component: SizeScaleComparisonComponent;
  let fixture: ComponentFixture<SizeScaleComparisonComponent>;

  const mockFossil: RealFossilProfile = {
    scientific_name: 'Stegosaurus stenops',
    taxonomy_family: 'Stegosauridae',
    geological_period: 'Jurassic',
    approximate_mya: '155 - 150 Ma',
    length_meters: 9.0,
    mass_kg: 3500,
    real_diet: 'Herbivore',
    fossil_locations: ['Morrison Formation'],
    distinctive_features: 'Placas dérmicas e thagomizer',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeScaleComparisonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SizeScaleComparisonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fossil', mockFossil);
    fixture.componentRef.setInput('dinoName', 'Stegosaurus');
    fixture.detectChanges();
  });

  it('should create the size scale comparison component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate proportional scale ratio text', () => {
    // 9.0m dino vs 1.7m human -> ~5.3x
    expect(component.ratioText()).toContain('5.3x');
  });

  it('should switch scale reference to Car SUV', () => {
    component.selectedRefId.set('car');
    fixture.detectChanges();
    expect(component.activeRef().label).toBe('Carro SUV');
    // 9.0m dino vs 4.5m car -> 2.0x
    expect(component.ratioText()).toContain('2.0x');
  });
});
