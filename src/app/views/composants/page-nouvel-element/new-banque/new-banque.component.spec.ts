import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBanqueComponent } from './new-banque.component';

describe('NewBanqueComponent', () => {
  let component: NewBanqueComponent;
  let fixture: ComponentFixture<NewBanqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBanqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBanqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
