import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ScannerStateService } from './scanner-state.service';
import { Dinosaur } from '../models/dinosaur.model';

describe('ScannerStateService', () => {
  let service: ScannerStateService;
  let httpMock: HttpTestingController;

  const mockDino: Dinosaur = {
    slug: 'tyrannosaurus-rex',
    common_name: 'Tyrannosaurus Rex',
    portrait_url: '/static/portraits/tyrannosaurus-rex.png',
    game_profile: {
      biome: 'Valley',
      diet: 'Carnivore',
      social: 'Solitary',
      poppin_favorite: 'Spicy',
      wild_skill: 'Smasher',
      farm_skill: 'Clearer',
      size_category: 'Large',
      is_rideable: true,
      pen_area_m2: 50,
      friendcall: 'Low roar'
    },
    fossil_profile: {
      scientific_name: 'Tyrannosaurus rex',
      taxonomy_family: 'Tyrannosauridae',
      geological_period: 'Late Cretaceous',
      approximate_mya: '68-66 M.a.',
      length_meters: 12.3,
      mass_kg: 8400,
      real_diet: 'Carnivore',
      fossil_locations: ['Hell Creek, USA'],
      distinctive_features: 'Massive bite force and reduced two-fingered forelimbs'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ScannerStateService,
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ScannerStateService);

    // Handle constructor requests (health + initial catalog)
    const healthReq = httpMock.expectOne('http://127.0.0.1:8000/api/v1/health');
    healthReq.flush({ status: 'healthy', service: 'paleo-scanner-api', version: '1.0.0' });

    const catalogReq = httpMock.expectOne('http://127.0.0.1:8000/api/v1/dinosaurs');
    catalogReq.flush([mockDino]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize and fetch catalog and online status', () => {
    expect(service.isBackendOnline()).toBe(true);
    expect(service.dinosaurs().length).toBe(1);
    expect(service.totalSpeciesCount()).toBe(1);
  });

  it('should filter dinosaurs by name query', () => {
    service.searchQuery.set('tyranno');
    expect(service.filteredDinosaurs().length).toBe(1);

    service.searchQuery.set('stegosaurus');
    expect(service.filteredDinosaurs().length).toBe(0);
  });

  it('should switch tabs between scanner and catalog', () => {
    service.setTab('catalog');
    expect(service.activeTab()).toBe('catalog');

    service.setTab('scanner');
    expect(service.activeTab()).toBe('scanner');
  });

  it('should manage dinosaur selection for modal inspection', () => {
    expect(service.selectedDinosaur()).toBeNull();
    service.openDinosaurModal(mockDino);
    expect(service.selectedDinosaur()?.slug).toBe('tyrannosaurus-rex');

    service.closeDinosaurModal();
    expect(service.selectedDinosaur()).toBeNull();
  });

  it('should navigate through dinosaurs cyclically with next and previous', () => {
    const mockDino2: Dinosaur = {
      ...mockDino,
      slug: 'triceratops',
      common_name: 'Triceratops'
    };
    const mockDino3: Dinosaur = {
      ...mockDino,
      slug: 'velociraptor',
      common_name: 'Velociraptor'
    };

    // Inject 3 dinos
    service.dinosaurs.set([mockDino, mockDino2, mockDino3]);
    service.openDinosaurModal(mockDino);
    expect(service.currentDinosaurIndex()).toBe(0);

    // Next -> mockDino2
    service.nextDinosaur();
    expect(service.selectedDinosaur()?.slug).toBe('triceratops');
    expect(service.currentDinosaurIndex()).toBe(1);

    // Next -> mockDino3
    service.nextDinosaur();
    expect(service.selectedDinosaur()?.slug).toBe('velociraptor');
    expect(service.currentDinosaurIndex()).toBe(2);

    // Next (cycle wrap) -> mockDino
    service.nextDinosaur();
    expect(service.selectedDinosaur()?.slug).toBe('tyrannosaurus-rex');
    expect(service.currentDinosaurIndex()).toBe(0);

    // Previous (cycle wrap backward) -> mockDino3
    service.previousDinosaur();
    expect(service.selectedDinosaur()?.slug).toBe('velociraptor');
    expect(service.currentDinosaurIndex()).toBe(2);
  });
});
