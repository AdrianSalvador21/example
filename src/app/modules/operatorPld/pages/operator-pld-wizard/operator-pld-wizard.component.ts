import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material';
import {BeneficiariesPldComponent} from '../beneficiaries-pld/beneficiaries-pld.component';

@Component({
  selector: 'two-operator-pld-wizard',
  templateUrl: './operator-pld-wizard.component.html',
  styleUrls: ['./operator-pld-wizard.component.scss']
})
export class OperatorPldWizardComponent implements OnInit {

  @ViewChild('initialStep') initialStep: BeneficiariesPldComponent;
  @ViewChild('stepper') stepper: MatStepper;
  buttonToShow: number;

  constructor() {
  }

  ngOnInit() {
  }

  onButtonClick(data) {
    this.buttonToShow = data;
  }

  return() {
    this.stepper.selectedIndex = 0;
    return;
  }

  finalize() {
    this.initialStep.refresh();
    this.stepper.selectedIndex = 0;
    return;
  }

}
