import {Component, OnInit, ViewChild} from '@angular/core';
import {UploadFileComponent} from '../upload-file/upload-file.component';

@Component({
  selector: 'app-massive-payments-wizard',
  templateUrl: './massive-payments-wizard.component.html',
  styleUrls: ['./massive-payments-wizard.component.scss']
})
export class MassivePaymentsWizardComponent implements OnInit {
  @ViewChild('upload') upload: UploadFileComponent;

  constructor() {
  }

  ngOnInit() {
  }

  cleanEvent() {
    this.upload.cleanForm();
  }

}
