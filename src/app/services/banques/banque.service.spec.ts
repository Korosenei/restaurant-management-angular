import { TestBed } from '@angular/core/testing';

import { BanqueService } from './banque.service';

describe('BanqueService', () => {
  let service: BanqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
