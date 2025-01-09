import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailClubComponent } from './detail-club.component';

describe('DetailClubComponent', () => {
  let component: DetailClubComponent;
  let fixture: ComponentFixture<DetailClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailClubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
