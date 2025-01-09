import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeDetailModalComponent } from './employe-detail-modal.component';

describe('EmployeDetailModalComponent', () => {
  let component: EmployeDetailModalComponent;
  let fixture: ComponentFixture<EmployeDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
