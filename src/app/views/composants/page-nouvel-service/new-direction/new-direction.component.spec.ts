import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDirectionComponent } from './new-direction.component';

describe('NewDirectionComponent', () => {
  let component: NewDirectionComponent;
  let fixture: ComponentFixture<NewDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDirectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
