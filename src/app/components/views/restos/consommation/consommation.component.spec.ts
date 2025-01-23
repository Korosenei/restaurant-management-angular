import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsommationComponent } from './consommation.component';

describe('ConsommationComponent', () => {
  let component: ConsommationComponent;
  let fixture: ComponentFixture<ConsommationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsommationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsommationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
