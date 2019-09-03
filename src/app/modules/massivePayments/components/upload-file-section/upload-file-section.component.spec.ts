import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadFileSectionComponent} from './upload-file-section.component';

describe('UploadFileSectionComponent', () => {
  let component: UploadFileSectionComponent;
  let fixture: ComponentFixture<UploadFileSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFileSectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
