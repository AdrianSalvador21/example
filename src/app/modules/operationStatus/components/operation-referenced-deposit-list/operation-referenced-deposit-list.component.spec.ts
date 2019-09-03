import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationReferencedDepositListComponent} from './operation-referenced-deposit-list.component';

describe('OperationReferencedDepositListComponent', () => {
  let component: OperationReferencedDepositListComponent;
  let fixture: ComponentFixture<OperationReferencedDepositListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationReferencedDepositListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationReferencedDepositListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
