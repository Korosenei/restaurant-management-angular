import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeComponent } from './new-employe.component';

describe('NewEmployeComponent', () => {
  let component: NewEmployeComponent;
  let fixture: ComponentFixture<NewEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
