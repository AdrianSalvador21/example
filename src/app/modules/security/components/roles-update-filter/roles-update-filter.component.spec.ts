import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesUpdateFilterComponent } from './roles-update-filter.component';

describe('RolesUpdateFilterComponent', () => {
  let component: RolesUpdateFilterComponent;
  let fixture: ComponentFixture<RolesUpdateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesUpdateFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesUpdateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
