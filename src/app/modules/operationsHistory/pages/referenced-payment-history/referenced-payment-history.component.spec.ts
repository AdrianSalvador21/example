import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentHistoryComponent } from './referenced-payment-history.component';

describe('ReferencedPaymentHistoryComponent', () => {
  let component: ReferencedPaymentHistoryComponent;
  let fixture: ComponentFixture<ReferencedPaymentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
