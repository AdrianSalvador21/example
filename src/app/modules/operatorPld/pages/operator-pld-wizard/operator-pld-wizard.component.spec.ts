import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperatorPldWizardComponent} from './operator-pld-wizard.component';

describe('OperatorPldWizardComponent', () => {
  let component: OperatorPldWizardComponent;
  let fixture: ComponentFixture<OperatorPldWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorPldWizardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorPldWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
