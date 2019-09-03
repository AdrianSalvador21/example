import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockedTransactionsComponent} from './blocked-transactions.component';

describe('BlockedTransactionsComponent', () => {
  let component: BlockedTransactionsComponent;
  let fixture: ComponentFixture<BlockedTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedTransactionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
