import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParamsAchatComponent } from './add-params-achat.component';

describe('AddParamsAchatComponent', () => {
  let component: AddParamsAchatComponent;
  let fixture: ComponentFixture<AddParamsAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddParamsAchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddParamsAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
