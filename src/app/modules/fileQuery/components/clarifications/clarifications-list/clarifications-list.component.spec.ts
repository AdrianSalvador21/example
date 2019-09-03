import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClarificationsListComponent} from './clarifications-list.component';

describe('ClarificationsListComponent', () => {
  let component: ClarificationsListComponent;
  let fixture: ComponentFixture<ClarificationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClarificationsListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarificationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
