import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDirectionComponent } from './detail-direction.component';

describe('DetailDirectionComponent', () => {
  let component: DetailDirectionComponent;
  let fixture: ComponentFixture<DetailDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDirectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
