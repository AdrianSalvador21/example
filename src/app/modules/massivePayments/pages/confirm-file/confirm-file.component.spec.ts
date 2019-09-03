import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmFileComponent} from './confirm-file.component';

describe('ConfirmFileComponent', () => {
  let component: ConfirmFileComponent;
  let fixture: ComponentFixture<ConfirmFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmFileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
