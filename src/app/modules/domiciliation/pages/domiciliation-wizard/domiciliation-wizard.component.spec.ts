import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomiciliationWizardComponent } from './domiciliation-wizard.component';

describe('DomiciliationWizardComponent', () => {
  let component: DomiciliationWizardComponent;
  let fixture: ComponentFixture<DomiciliationWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomiciliationWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
