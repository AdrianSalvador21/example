import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationFilterComponent} from './operation-filter.component';

describe('OperationFilterComponent', () => {
  let component: OperationFilterComponent;
  let fixture: ComponentFixture<OperationFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
