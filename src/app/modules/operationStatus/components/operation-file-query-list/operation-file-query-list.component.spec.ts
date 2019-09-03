import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationFileQueryListComponent} from './operation-file-query-list.component';

describe('OperationFileQueryListComponent', () => {
  let component: OperationFileQueryListComponent;
  let fixture: ComponentFixture<OperationFileQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationFileQueryListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationFileQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
