import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IssueDetailButtonPanelComponent} from './issue-detail-button-panel.component';

describe('IssueDetailButtonPanelComponent', () => {
  let component: IssueDetailButtonPanelComponent;
  let fixture: ComponentFixture<IssueDetailButtonPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueDetailButtonPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailButtonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
