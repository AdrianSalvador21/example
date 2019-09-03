import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClarificationsFilterComponent} from './clarifications-filter.component';

describe('ClarificationsFilterComponent', () => {
  let component: ClarificationsFilterComponent;
  let fixture: ComponentFixture<ClarificationsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClarificationsFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarificationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
