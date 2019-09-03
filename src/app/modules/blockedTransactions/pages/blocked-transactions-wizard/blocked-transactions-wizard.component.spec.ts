import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockedTransactionsWizardComponent} from './blocked-transactions-wizard.component';

describe('BlockedTransactionsWizardComponent', () => {
  let component: BlockedTransactionsWizardComponent;
  let fixture: ComponentFixture<BlockedTransactionsWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedTransactionsWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedTransactionsWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
