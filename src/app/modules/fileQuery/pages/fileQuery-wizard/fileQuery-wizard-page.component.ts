import {Component, OnInit, ViewChild} from '@angular/core';
import {fadeInOut} from '../../../../shared/helpers/utils.helper';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {MatStepper} from '@angular/material';
import {FileQueryOperatorPageComponent} from '../fileQuery-operator';

@Component({
  templateUrl: './fileQuery-wizard-page.component.html',
  styleUrls: ['./fileQuery-wizard-page.component.scss'],
  animations: [fadeInOut]
})

export class FileQueryWizardPageComponent extends BaseComponent implements OnInit {
  fileLineDetails: boolean = true;
  showLineDetails: boolean = false;
  hideIssuesButtons: boolean = false;
  fileQueryWizard: boolean = true;
  showFileDetails: boolean = false;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('filterView') filterView: FileQueryOperatorPageComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  continueToLineDetails() {
    this.showLineDetails = true;
  }

  returnToFileDetails() {
    this.showLineDetails = false;
  }

  refreshResults() {
    this.filterView.RefreshResults(true, false);
  }

  continueToFileDetails() {
    this.showFileDetails = true;
  }

  returnToFilterPage() {
    this.showFileDetails = false;
  }
}
