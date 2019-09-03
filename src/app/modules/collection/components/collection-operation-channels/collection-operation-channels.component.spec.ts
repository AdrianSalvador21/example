import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionOperationChannelsComponent } from './collection-operation-channels.component';

describe('CollectionOperationChannelsComponent', () => {
  let component: CollectionOperationChannelsComponent;
  let fixture: ComponentFixture<CollectionOperationChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionOperationChannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionOperationChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
