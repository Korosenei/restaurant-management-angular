import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanqueComponent } from './banque.component';

describe('BanqueComponent', () => {
  let component: BanqueComponent;
  let fixture: ComponentFixture<BanqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
