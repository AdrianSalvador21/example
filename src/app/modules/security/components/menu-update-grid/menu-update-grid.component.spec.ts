import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUpdateGridComponent } from './menu-update-grid.component';

describe('MenuUpdateGridComponent', () => {
  let component: MenuUpdateGridComponent;
  let fixture: ComponentFixture<MenuUpdateGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUpdateGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUpdateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
