import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeComponent } from './detail-employe.component';

describe('DetailEmployeComponent', () => {
  let component: DetailEmployeComponent;
  let fixture: ComponentFixture<DetailEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
