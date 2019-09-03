import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InitialSelectionComponent} from './initial-selection.component';

describe('InitialSelectionComponent', () => {
  let component: InitialSelectionComponent;
  let fixture: ComponentFixture<InitialSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InitialSelectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
