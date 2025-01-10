import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeComponent } from './list-employe.component';

describe('ListEmployeComponent', () => {
  let component: ListEmployeComponent;
  let fixture: ComponentFixture<ListEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
