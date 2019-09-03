import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloadPldComponent} from './download-pld.component';

describe('DownloadPldComponent', () => {
  let component: DownloadPldComponent;
  let fixture: ComponentFixture<DownloadPldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadPldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
