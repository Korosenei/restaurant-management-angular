import { TestBed } from '@angular/core/testing';

import { ParmsAchatService } from './parms-achat.service';

describe('ParmsAchatService', () => {
  let service: ParmsAchatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParmsAchatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
