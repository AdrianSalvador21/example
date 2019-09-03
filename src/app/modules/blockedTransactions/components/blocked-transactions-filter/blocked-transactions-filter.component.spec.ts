import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockedTransactionsFilterComponent} from './blocked-transactions-filter.component';

describe('BlockedTransactionsFilterComponent', () => {
  let component: BlockedTransactionsFilterComponent;
  let fixture: ComponentFixture<BlockedTransactionsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedTransactionsFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedTransactionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
