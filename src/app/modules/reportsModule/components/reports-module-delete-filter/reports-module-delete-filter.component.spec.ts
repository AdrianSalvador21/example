import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsModuleDeleteFilterComponent } from './reports-module-delete-filter.component';

describe('ReportsModuleDeleteFilterComponent', () => {
  let component: ReportsModuleDeleteFilterComponent;
  let fixture: ComponentFixture<ReportsModuleDeleteFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsModuleDeleteFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsModuleDeleteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
