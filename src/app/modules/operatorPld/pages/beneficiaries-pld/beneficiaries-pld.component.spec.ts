import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BeneficiariesPldComponent} from './beneficiaries-pld.component';

describe('BeneficiariesPldComponent', () => {
  let component: BeneficiariesPldComponent;
  let fixture: ComponentFixture<BeneficiariesPldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesPldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesPldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
