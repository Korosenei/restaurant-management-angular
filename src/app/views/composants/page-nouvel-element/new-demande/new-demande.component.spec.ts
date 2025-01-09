import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDemandeComponent } from './new-demande.component';

describe('NewDemandeComponent', () => {
  let component: NewDemandeComponent;
  let fixture: ComponentFixture<NewDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
