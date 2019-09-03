import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MassivePaymentsWizardComponent} from './massive-payments-wizard.component';

describe('MassivePaymentsWizardComponent', () => {
  let component: MassivePaymentsWizardComponent;
  let fixture: ComponentFixture<MassivePaymentsWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MassivePaymentsWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassivePaymentsWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
