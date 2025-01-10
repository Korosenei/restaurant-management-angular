import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeComponent } from './employe.component';

describe('EmployeComponent', () => {
  let component: EmployeComponent;
  let fixture: ComponentFixture<EmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
