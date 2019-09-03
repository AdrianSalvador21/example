import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentConfirmComponent } from './referenced-payment-confirm.component';

describe('ReferencedPaymentConfirmComponent', () => {
  let component: ReferencedPaymentConfirmComponent;
  let fixture: ComponentFixture<ReferencedPaymentConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
