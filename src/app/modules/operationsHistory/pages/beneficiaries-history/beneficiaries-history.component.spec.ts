import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesHistoryComponent } from './beneficiaries-history.component';

describe('BeneficiariesHistoryComponent', () => {
  let component: BeneficiariesHistoryComponent;
  let fixture: ComponentFixture<BeneficiariesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiariesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
