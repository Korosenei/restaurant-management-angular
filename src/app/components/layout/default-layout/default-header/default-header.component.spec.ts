import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultHeaderComponent } from './default-header.component';

describe('DefaultHeaderComponent', () => {
  let component: DefaultHeaderComponent;
  let fixture: ComponentFixture<DefaultHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
