import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionGeneralDataComponent } from './collection-general-data.component';

describe('CollectionGeneralDataComponent', () => {
  let component: CollectionGeneralDataComponent;
  let fixture: ComponentFixture<CollectionGeneralDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionGeneralDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
