import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentDetailSectionComponent } from './referenced-payment-detail-section.component';

describe('ReferencedPaymentDetailSectionComponent', () => {
  let component: ReferencedPaymentDetailSectionComponent;
  let fixture: ComponentFixture<ReferencedPaymentDetailSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentDetailSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentDetailSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
