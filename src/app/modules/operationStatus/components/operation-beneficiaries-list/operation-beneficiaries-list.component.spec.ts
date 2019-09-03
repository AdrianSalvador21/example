import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationBeneficiariesListComponent} from './operation-beneficiaries-list.component';

describe('OperationBeneficiariesListComponent', () => {
  let component: OperationBeneficiariesListComponent;
  let fixture: ComponentFixture<OperationBeneficiariesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationBeneficiariesListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationBeneficiariesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
