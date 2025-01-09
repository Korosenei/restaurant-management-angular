import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNotificationComponent } from './detail-notification.component';

describe('DetailNotificationComponent', () => {
  let component: DetailNotificationComponent;
  let fixture: ComponentFixture<DetailNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
