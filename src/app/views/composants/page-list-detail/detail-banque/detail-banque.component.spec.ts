import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBanqueComponent } from './detail-banque.component';

describe('DetailBanqueComponent', () => {
  let component: DetailBanqueComponent;
  let fixture: ComponentFixture<DetailBanqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailBanqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBanqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
