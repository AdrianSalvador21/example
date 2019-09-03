import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IssuesWizardComponent} from './issues-wizard.component';

describe('IssuesWizardComponent', () => {
  let component: IssuesWizardComponent;
  let fixture: ComponentFixture<IssuesWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssuesWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
