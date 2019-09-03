import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BeneficiaryConfirmSectionComponent} from './beneficiary-confirm-section.component';

describe('BeneficiaryConfirmSectionComponent', () => {
  let component: BeneficiaryConfirmSectionComponent;
  let fixture: ComponentFixture<BeneficiaryConfirmSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaryConfirmSectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryConfirmSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
