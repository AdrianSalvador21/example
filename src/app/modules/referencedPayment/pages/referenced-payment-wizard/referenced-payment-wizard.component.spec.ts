import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentWizardComponent } from './referenced-payment-wizard.component';

describe('ReferencedPaymentWizardComponent', () => {
  let component: ReferencedPaymentWizardComponent;
  let fixture: ComponentFixture<ReferencedPaymentWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
