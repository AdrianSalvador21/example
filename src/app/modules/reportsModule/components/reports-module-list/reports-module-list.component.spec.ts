import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsModuleListComponent } from './reports-module-list.component';

describe('ReportsModuleListComponent', () => {
  let component: ReportsModuleListComponent;
  let fixture: ComponentFixture<ReportsModuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsModuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
