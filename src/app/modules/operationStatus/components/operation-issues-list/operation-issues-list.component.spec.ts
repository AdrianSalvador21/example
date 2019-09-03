import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationIssuesListComponent} from './operation-issues-list.component';

describe('OperationIssuesListComponent', () => {
  let component: OperationIssuesListComponent;
  let fixture: ComponentFixture<OperationIssuesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationIssuesListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
