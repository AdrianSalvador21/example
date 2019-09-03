import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material';
import {ReferencedPaymentHistoryComponent} from '../referenced-payment-history/referenced-payment-history.component';

@Component({
  selector: 'two-referenced-payment-history-wizard',
  templateUrl: './referenced-payment-history-wizard.component.html',
  styleUrls: ['./referenced-payment-history-wizard.component.scss']
})
export class ReferencedPaymentHistoryWizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('initialView') initialView: ReferencedPaymentHistoryComponent;

  constructor() { }

  ngOnInit() {
  }

  finalize() {
    this.stepper.reset();
    this.initialView.cleanForm();
  }

  preview() {
    this.stepper.previous();
  }

}
