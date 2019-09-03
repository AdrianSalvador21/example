import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionEditionComponent } from './collection-edition.component';

describe('CollectionEditionComponent', () => {
  let component: CollectionEditionComponent;
  let fixture: ComponentFixture<CollectionEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
