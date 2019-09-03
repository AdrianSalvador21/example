import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BeneficiariesWizardComponent} from './beneficiaries-wizard.component';

describe('BeneficiariesWizardComponent', () => {
  let component: BeneficiariesWizardComponent;
  let fixture: ComponentFixture<BeneficiariesWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
