import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IssueDetailSectionComponent} from './issue-detail-section.component';

describe('IssueDetailSectionComponent', () => {
  let component: IssueDetailSectionComponent;
  let fixture: ComponentFixture<IssueDetailSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueDetailSectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
