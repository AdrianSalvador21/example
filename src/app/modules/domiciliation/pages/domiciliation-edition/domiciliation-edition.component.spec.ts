import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomiciliationEditionComponent } from './domiciliation-edition.component';

describe('DomiciliationEditionComponent', () => {
  let component: DomiciliationEditionComponent;
  let fixture: ComponentFixture<DomiciliationEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomiciliationEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliationEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
