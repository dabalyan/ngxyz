import { TestBed } from '@angular/core/testing';

import { NgxyzKonamiService } from './ngxyz-konami.service';

describe('NgxyzKonamiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxyzKonamiService = TestBed.get(NgxyzKonamiService);
    expect(service).toBeTruthy();
  });
});
