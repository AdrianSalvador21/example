import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationClarificationListComponent} from './operation-clarification-list.component';

describe('OperationClarificationListComponent', () => {
  let component: OperationClarificationListComponent;
  let fixture: ComponentFixture<OperationClarificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationClarificationListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationClarificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
