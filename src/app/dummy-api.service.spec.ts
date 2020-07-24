import { TestBed } from '@angular/core/testing';

import { DummyApiService } from './dummy-api.service';

describe('DummyApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DummyApiService = TestBed.get(DummyApiService);
    expect(service).toBeTruthy();
  });
});
