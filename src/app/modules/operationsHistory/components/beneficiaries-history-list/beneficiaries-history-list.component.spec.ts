import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesHistoryListComponent } from './beneficiaries-history-list.component';

describe('BeneficiariesHistoryListComponent', () => {
  let component: BeneficiariesHistoryListComponent;
  let fixture: ComponentFixture<BeneficiariesHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiariesHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
