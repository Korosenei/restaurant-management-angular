import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgenceComponent } from './new-agence.component';

describe('NewAgenceComponent', () => {
  let component: NewAgenceComponent;
  let fixture: ComponentFixture<NewAgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAgenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
