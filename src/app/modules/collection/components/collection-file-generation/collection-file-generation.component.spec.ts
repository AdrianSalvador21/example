import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFileGenerationComponent } from './collection-file-generation.component';

describe('CollectionFileGenerationComponent', () => {
  let component: CollectionFileGenerationComponent;
  let fixture: ComponentFixture<CollectionFileGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionFileGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFileGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
