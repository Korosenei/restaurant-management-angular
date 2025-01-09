import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChequeComponent } from './detail-cheque.component';

describe('DetailChequeComponent', () => {
  let component: DetailChequeComponent;
  let fixture: ComponentFixture<DetailChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailChequeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
