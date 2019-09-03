import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionOverduePaymentsReceptionComponent } from './collection-overdue-payments-reception.component';

describe('CollectionOverduePaymentsReceptionComponent', () => {
  let component: CollectionOverduePaymentsReceptionComponent;
  let fixture: ComponentFixture<CollectionOverduePaymentsReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionOverduePaymentsReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionOverduePaymentsReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
