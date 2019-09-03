import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BeneficiariesPldFilterComponent} from './beneficiaries-pld-filter.component';

describe('BeneficiariesPldFilterComponent', () => {
  let component: BeneficiariesPldFilterComponent;
  let fixture: ComponentFixture<BeneficiariesPldFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesPldFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesPldFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
