import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdForgetedComponent } from './pwd-forgeted.component';

describe('PwdForgetedComponent', () => {
  let component: PwdForgetedComponent;
  let fixture: ComponentFixture<PwdForgetedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwdForgetedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwdForgetedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
