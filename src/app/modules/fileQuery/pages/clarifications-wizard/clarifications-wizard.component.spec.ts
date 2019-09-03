import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClarificationsWizardComponent} from './clarifications-wizard.component';

describe('ClarificationsWizardComponent', () => {
  let component: ClarificationsWizardComponent;
  let fixture: ComponentFixture<ClarificationsWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClarificationsWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarificationsWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
