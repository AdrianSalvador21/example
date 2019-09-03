import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentDetailComponent } from './referenced-payment-detail.component';

describe('ReferencedPaymentDetailComponent', () => {
  let component: ReferencedPaymentDetailComponent;
  let fixture: ComponentFixture<ReferencedPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
