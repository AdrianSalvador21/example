import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPaymentsTypesComponent } from './collection-payments-types.component';

describe('CollectionPaymentsTypesComponent', () => {
  let component: CollectionPaymentsTypesComponent;
  let fixture: ComponentFixture<CollectionPaymentsTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionPaymentsTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPaymentsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
