import { TestBed } from '@angular/core/testing';

import { NgxyzC2cService } from './ngxyz-c2c.service';

describe('NgxyzC2cService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxyzC2cService = TestBed.get(NgxyzC2cService);
    expect(service).toBeTruthy();
  });
});
