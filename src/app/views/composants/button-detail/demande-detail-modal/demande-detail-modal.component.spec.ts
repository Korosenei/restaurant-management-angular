import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeDetailModalComponent } from './demande-detail-modal.component';

describe('DemandeDetailModalComponent', () => {
  let component: DemandeDetailModalComponent;
  let fixture: ComponentFixture<DemandeDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
