import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFilterComponent } from './collection-filter.component';

describe('CollectionFilterComponent', () => {
  let component: CollectionFilterComponent;
  let fixture: ComponentFixture<CollectionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
