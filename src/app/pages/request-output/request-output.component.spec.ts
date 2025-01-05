import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOutputComponent } from './request-output.component';

describe('RequestOutputComponent', () => {
  let component: RequestOutputComponent;
  let fixture: ComponentFixture<RequestOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
