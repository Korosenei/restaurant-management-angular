import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTransactionComponent } from './detail-transaction.component';

describe('DetailTransactionComponent', () => {
  let component: DetailTransactionComponent;
  let fixture: ComponentFixture<DetailTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
