import { TestBed } from '@angular/core/testing';

import { NoificationService } from './noification.service';

describe('NoificationService', () => {
  let service: NoificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
