import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentHistoryWizardComponent } from './referenced-payment-history-wizard.component';

describe('ReferencedPaymentHistoryWizardComponent', () => {
  let component: ReferencedPaymentHistoryWizardComponent;
  let fixture: ComponentFixture<ReferencedPaymentHistoryWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentHistoryWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentHistoryWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
