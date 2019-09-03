import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationMassiveListComponent} from './operation-massive-list.component';

describe('OperationMassiveListComponent', () => {
  let component: OperationMassiveListComponent;
  let fixture: ComponentFixture<OperationMassiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationMassiveListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationMassiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
