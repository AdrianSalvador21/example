import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentComponent } from './referenced-payment.component';

describe('ReferencedPaymentComponent', () => {
  let component: ReferencedPaymentComponent;
  let fixture: ComponentFixture<ReferencedPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
