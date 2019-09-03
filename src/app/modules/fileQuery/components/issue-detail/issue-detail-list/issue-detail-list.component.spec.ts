import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IssueDetailListComponent} from './issue-detail-list.component';

describe('IssueDetailListComponent', () => {
  let component: IssueDetailListComponent;
  let fixture: ComponentFixture<IssueDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueDetailListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
