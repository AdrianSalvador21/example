import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsModuleFilterComponent } from './reports-module-filter.component';

describe('ReportsModuleFilterComponent', () => {
  let component: ReportsModuleFilterComponent;
  let fixture: ComponentFixture<ReportsModuleFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsModuleFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsModuleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
