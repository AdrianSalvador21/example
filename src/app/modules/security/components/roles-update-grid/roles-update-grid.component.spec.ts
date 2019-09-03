import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesUpdateGridComponent } from './roles-update-grid.component';

describe('RolesUpdateGridComponent', () => {
  let component: RolesUpdateGridComponent;
  let fixture: ComponentFixture<RolesUpdateGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesUpdateGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesUpdateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
