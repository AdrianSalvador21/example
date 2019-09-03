import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionWizardComponent } from './collection-wizard.component';

describe('CollectionWizardComponent', () => {
  let component: CollectionWizardComponent;
  let fixture: ComponentFixture<CollectionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
