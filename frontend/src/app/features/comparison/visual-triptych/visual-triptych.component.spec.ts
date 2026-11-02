import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VisualTriptychComponent } from './visual-triptych.component';
import { Dinosaur } from '../../../core/models/dinosaur.model';

describe('VisualTriptychComponent', () => {
  let component: VisualTriptychComponent;
  let fixture: ComponentFixture<VisualTriptychComponent>;

  const mockDino: Dinosaur = {
    slug: 'parasaurolophus',
    common_name: 'Parasaurolophus',
    game_profile: {
      biome: 'Forest',
      diet: 'Herbivore',
      social: 'Pack',
      poppin_favorite: 'Crunchy',
      wild_skill: 'Discoverer',
      farm_skill: 'Tender',
      size_category: 'Large',
      is_rideable: true,
      pen_area_m2: 50,
      friendcall: '1M|2L|3S',
    },
    fossil_profile: {
      scientific_name: 'Parasaurolophus walkeri',
      taxonomy_family: 'Hadrosauridae',
      geological_period: 'Late Cretaceous',
      approximate_mya: '76.5 - 73 Ma',
      length_meters: 9.5,
      mass_kg: 2500,
      real_diet: 'Herbivore',
      fossil_locations: ['Dinosaur Park Formation'],
      distinctive_features: 'Crista cranial oca tubular',
      fossil_image_url: '/static/fossils/parasaurolophus.jpg',
      paleoart_image_url: '/static/paleoart/parasaurolophus.jpg',
    },
    portrait_url: '/static/portraits/parasaurolophus.png',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualTriptychComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualTriptychComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dino', mockDino);
    fixture.detectChanges();
  });

  it('should create the visual triptych component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute image URLs for game, fossil, and paleoart', () => {
    expect(component.gamePortrait()).toContain('parasaurolophus');
    expect(component.fossilPhoto()).toContain('parasaurolophus');
    expect(component.paleoartIllustration()).toContain('parasaurolophus');
  });

  it('should allow toggling between view tabs', () => {
    component.activeView.set('fossil');
    fixture.detectChanges();
    expect(component.activeView()).toBe('fossil');
  });
});
