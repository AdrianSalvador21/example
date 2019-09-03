import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockedTransactionSeccionComponent} from './blocked-transaction-seccion.component';

describe('BlockedTransactionSeccionComponent', () => {
  let component: BlockedTransactionSeccionComponent;
  let fixture: ComponentFixture<BlockedTransactionSeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedTransactionSeccionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedTransactionSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
