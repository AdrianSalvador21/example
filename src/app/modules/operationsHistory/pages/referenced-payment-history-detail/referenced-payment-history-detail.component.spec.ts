import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentHistoryDetailComponent } from './referenced-payment-history-detail.component';

describe('ReferencedPaymentHistoryDetailComponent', () => {
  let component: ReferencedPaymentHistoryDetailComponent;
  let fixture: ComponentFixture<ReferencedPaymentHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
