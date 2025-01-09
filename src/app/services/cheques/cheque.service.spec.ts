import { TestBed } from '@angular/core/testing';

import { ChequeService } from './cheque.service';

describe('ChequeService', () => {
  let service: ChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
