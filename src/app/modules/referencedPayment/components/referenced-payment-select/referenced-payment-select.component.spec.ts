import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentSelectComponent } from './referenced-payment-select.component';

describe('ReferencedPaymentSelectComponent', () => {
  let component: ReferencedPaymentSelectComponent;
  let fixture: ComponentFixture<ReferencedPaymentSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
