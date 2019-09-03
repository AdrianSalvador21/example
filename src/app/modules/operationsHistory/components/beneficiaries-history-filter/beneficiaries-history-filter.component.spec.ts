import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesHistoryFilterComponent } from './beneficiaries-history-filter.component';

describe('BeneficiariesHistoryFilterComponent', () => {
  let component: BeneficiariesHistoryFilterComponent;
  let fixture: ComponentFixture<BeneficiariesHistoryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiariesHistoryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesHistoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
