import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockedTransactionsDetailComponent} from './blocked-transactions-detail.component';

describe('BlockedTransactionsDetailComponent', () => {
  let component: BlockedTransactionsDetailComponent;
  let fixture: ComponentFixture<BlockedTransactionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedTransactionsDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedTransactionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
