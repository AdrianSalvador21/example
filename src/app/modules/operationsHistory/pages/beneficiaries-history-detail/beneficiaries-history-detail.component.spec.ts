import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesHistoryDetailComponent } from './beneficiaries-history-detail.component';

describe('BeneficiariesHistoryDetailComponent', () => {
  let component: BeneficiariesHistoryDetailComponent;
  let fixture: ComponentFixture<BeneficiariesHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiariesHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
