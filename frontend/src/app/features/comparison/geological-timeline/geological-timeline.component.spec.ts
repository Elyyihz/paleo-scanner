import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeologicalTimelineComponent } from './geological-timeline.component';
import { RealFossilProfile } from '../../../core/models/dinosaur.model';

describe('GeologicalTimelineComponent', () => {
  let component: GeologicalTimelineComponent;
  let fixture: ComponentFixture<GeologicalTimelineComponent>;

  const mockFossil: RealFossilProfile = {
    scientific_name: 'Parasaurolophus walkeri',
    taxonomy_family: 'Hadrosauridae',
    geological_period: 'Late Cretaceous',
    approximate_mya: '76.5 - 73 Ma',
    length_meters: 9.5,
    mass_kg: 2500,
    real_diet: 'Herbivore',
    fossil_locations: ['Dinosaur Park Formation'],
    distinctive_features: 'Crista cranial oca',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeologicalTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeologicalTimelineComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fossil', mockFossil);
    fixture.detectChanges();
  });

  it('should create the geological timeline component', () => {
    expect(component).toBeTruthy();
  });

  it('should parse geological period and approximate mya correctly', () => {
    expect(component.displayMa()).toContain('75 Ma');
  });

  it('should compute valid marker percentage within bounds', () => {
    const percent = component.markerPercent();
    expect(percent).toBeGreaterThan(0);
    expect(percent).toBeLessThan(100);
  });
});
