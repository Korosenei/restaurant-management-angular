import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRegistreComponent } from './detail-registre.component';

describe('DetailRegistreComponent', () => {
  let component: DetailRegistreComponent;
  let fixture: ComponentFixture<DetailRegistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailRegistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRegistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
