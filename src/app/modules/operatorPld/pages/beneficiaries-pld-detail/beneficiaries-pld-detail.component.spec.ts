import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BeneficiariesPldDetailComponent} from './beneficiaries-pld-detail.component';

describe('BeneficiariesPldDetailComponent', () => {
  let component: BeneficiariesPldDetailComponent;
  let fixture: ComponentFixture<BeneficiariesPldDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesPldDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesPldDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
