import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationStatusFilterComponent} from './operation-status-filter.component';

describe('OperationStatusFilterComponent', () => {
  let component: OperationStatusFilterComponent;
  let fixture: ComponentFixture<OperationStatusFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationStatusFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
