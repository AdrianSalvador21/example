import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material';
import {UploadFileSectionComponent} from '../../components/upload-file-section/upload-file-section.component';

@Component({
  selector: 'two-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @ViewChild('form') form: UploadFileSectionComponent;

  @Input()
  stepper: MatStepper;

  constructor() {
  }

  ngOnInit() {
  }

  cleanForm() {
    this.form.cleanButton();
  }

}
