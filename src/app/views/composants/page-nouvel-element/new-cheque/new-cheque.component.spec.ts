import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChequeComponent } from './new-cheque.component';

describe('NewChequeComponent', () => {
  let component: NewChequeComponent;
  let fixture: ComponentFixture<NewChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewChequeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
