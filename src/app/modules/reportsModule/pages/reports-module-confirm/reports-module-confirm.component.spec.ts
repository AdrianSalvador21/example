import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsModuleConfirmComponent } from './reports-module-confirm.component';

describe('ReportsModuleConfirmComponent', () => {
  let component: ReportsModuleConfirmComponent;
  let fixture: ComponentFixture<ReportsModuleConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsModuleConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsModuleConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
