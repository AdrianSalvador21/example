import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentDetailAccountsComponent } from './referenced-payment-detail-accounts.component';

describe('ReferencedPaymentDetailAccountsComponent', () => {
  let component: ReferencedPaymentDetailAccountsComponent;
  let fixture: ComponentFixture<ReferencedPaymentDetailAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentDetailAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentDetailAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
