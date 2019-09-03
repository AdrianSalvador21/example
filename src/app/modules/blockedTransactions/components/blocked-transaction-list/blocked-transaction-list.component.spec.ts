import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockedTransactionListComponent} from './blocked-transaction-list.component';

describe('BlockedTransactionListComponent', () => {
  let component: BlockedTransactionListComponent;
  let fixture: ComponentFixture<BlockedTransactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedTransactionListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
