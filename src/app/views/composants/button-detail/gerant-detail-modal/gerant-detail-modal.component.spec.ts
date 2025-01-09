import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerantDetailModalComponent } from './gerant-detail-modal.component';

describe('GerantDetailModalComponent', () => {
  let component: GerantDetailModalComponent;
  let fixture: ComponentFixture<GerantDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerantDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerantDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
