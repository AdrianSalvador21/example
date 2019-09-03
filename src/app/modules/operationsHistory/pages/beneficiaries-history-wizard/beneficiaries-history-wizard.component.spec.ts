import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesHistoryWizardComponent } from './beneficiaries-history-wizard.component';

describe('BeneficiariesHistoryWizardComponent', () => {
  let component: BeneficiariesHistoryWizardComponent;
  let fixture: ComponentFixture<BeneficiariesHistoryWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiariesHistoryWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesHistoryWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
