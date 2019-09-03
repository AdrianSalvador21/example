import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationStatusFullFilterComponent } from './operation-status-full-filter.component';

describe('OperationStatusFullFilterComponent', () => {
  let component: OperationStatusFullFilterComponent;
  let fixture: ComponentFixture<OperationStatusFullFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationStatusFullFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationStatusFullFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
