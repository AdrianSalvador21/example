import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationUnitQueryListComponent} from './operation-unit-query-list.component';

describe('OperationUnitQueryListComponent', () => {
  let component: OperationUnitQueryListComponent;
  let fixture: ComponentFixture<OperationUnitQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationUnitQueryListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationUnitQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
