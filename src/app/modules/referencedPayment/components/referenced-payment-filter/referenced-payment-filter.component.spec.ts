import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentFilterComponent } from './referenced-payment-filter.component';

describe('ReferencedPaymentFilterComponent', () => {
  let component: ReferencedPaymentFilterComponent;
  let fixture: ComponentFixture<ReferencedPaymentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
