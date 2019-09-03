import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BeneficiariesPldListComponent} from './beneficiaries-pld-list.component';

describe('BeneficiariesPldListComponent', () => {
  let component: BeneficiariesPldListComponent;
  let fixture: ComponentFixture<BeneficiariesPldListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesPldListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiariesPldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
