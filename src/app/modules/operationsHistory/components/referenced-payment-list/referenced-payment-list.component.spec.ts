import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedPaymentListComponent } from './referenced-payment-list.component';

describe('ReferencedPaymentListComponent', () => {
  let component: ReferencedPaymentListComponent;
  let fixture: ComponentFixture<ReferencedPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencedPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencedPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
