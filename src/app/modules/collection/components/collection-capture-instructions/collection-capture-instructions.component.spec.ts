import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCaptureInstructionsComponent } from './collection-capture-instructions.component';

describe('CollectionCaptureInstructionsComponent', () => {
  let component: CollectionCaptureInstructionsComponent;
  let fixture: ComponentFixture<CollectionCaptureInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionCaptureInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCaptureInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
