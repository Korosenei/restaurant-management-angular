import { TestBed } from '@angular/core/testing';

import { GerantService } from './gerant.service';

describe('GerantService', () => {
  let service: GerantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
