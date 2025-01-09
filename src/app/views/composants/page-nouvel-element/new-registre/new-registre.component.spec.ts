import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegistreComponent } from './new-registre.component';

describe('NewRegistreComponent', () => {
  let component: NewRegistreComponent;
  let fixture: ComponentFixture<NewRegistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRegistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRegistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
