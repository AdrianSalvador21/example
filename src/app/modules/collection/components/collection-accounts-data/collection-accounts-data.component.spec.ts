import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAccountsDataComponent } from './collection-accounts-data.component';

describe('CollectionAccountsDataComponent', () => {
  let component: CollectionAccountsDataComponent;
  let fixture: ComponentFixture<CollectionAccountsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionAccountsDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAccountsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
